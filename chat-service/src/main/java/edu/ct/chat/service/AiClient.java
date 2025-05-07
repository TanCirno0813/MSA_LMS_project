package edu.ct.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openai.api-key}")
    private String apiKey;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public String ask(String userMessage) {
        // 🌟 API 키 확인 로그
        System.out.println("API Key: " + (apiKey != null ? "Present" : "Missing"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);  // ✅ Bearer 토큰 설정 확인
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", "너는 교육 추천 봇이야. 사용자의 메시지를 보고 강의 추천이나 도움을 줘."),
                        Map.of("role", "user", "content", userMessage)
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, entity, Map.class);
            System.out.println("Response Status: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                Map message = (Map) choices.get(0).get("message");
                return (String) message.get("content");
            } else {
                return "AI 응답 오류: " + response.getStatusCode();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "OpenAI API 호출 오류: " + e.getMessage();
        }
    }
}

