package edu.ct.gateway.config;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SmsConfig {

    @Value("${coolsms.api.key}")
    private String api_key;

    @Value("${coolsms.api.secret}")
    private String api_secret;

    @Bean
    public DefaultMessageService messageService() {
        return NurigoApp.INSTANCE.initialize(api_key, api_secret, "https://api.coolsms.co.kr");
    }
}
