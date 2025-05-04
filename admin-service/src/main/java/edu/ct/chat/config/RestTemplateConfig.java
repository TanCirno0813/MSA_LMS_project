package edu.ct.chat.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.StreamReadConstraints;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Collections;

@Configuration
public class RestTemplateConfig {
    
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
        
        // 최대 중첩 깊이 제한 늘리기
        StreamReadConstraints streamReadConstraints = StreamReadConstraints.builder()
                .maxNestingDepth(10000)  // 기본값(1000)에서 10000으로 증가
                .build();
        mapper.getFactory().setStreamReadConstraints(streamReadConstraints);
        
        return mapper;
    }
    
    @Bean
    @LoadBalanced // Eureka 서비스명으로 호출하기 위해 필요
    public RestTemplate restTemplate() {
        // RestTemplate 설정 개선
        MappingJackson2HttpMessageConverter messageConverter = new MappingJackson2HttpMessageConverter();
        messageConverter.setObjectMapper(objectMapper());
        
        return new RestTemplateBuilder()
                .setConnectTimeout(Duration.ofMillis(5000))
                .setReadTimeout(Duration.ofMillis(5000))
                .additionalMessageConverters(Collections.singletonList(messageConverter))
                .build();
    }
}
