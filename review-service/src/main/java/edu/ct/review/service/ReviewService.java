package edu.ct.review.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final RestTemplate restTemplate;

    private static final String LECTURE_SERVICE_URL = "http://lecture-service/api"; // ← Eureka 서비스 이름 사용

    public Object fetchAllReviews() {
        try {
            String targetUrl = LECTURE_SERVICE_URL + "/reviews";
            log.info("리뷰 전체 요청 → {}", targetUrl);

            ResponseEntity<Object> response = restTemplate.exchange(
                    targetUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Object>() {}
            );

            log.info("응답 상태: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            log.error("리뷰 가져오기 실패: {}", e.getMessage());
            throw new RuntimeException("리뷰 가져오기 실패", e);
        }
    }
}
