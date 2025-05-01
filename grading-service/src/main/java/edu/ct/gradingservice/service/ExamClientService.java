package edu.ct.gradingservice.service;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExamClientService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getExamTitleById(Long examId) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                    "http://localhost:8003/api/exams/" + examId,
                    String.class
            );
            JSONObject json = new JSONObject(response.getBody());
            return json.optString("title", null);
        } catch (Exception e) {
            System.out.println("⚠️ 시험 제목 조회 실패: " + e.getMessage());
            return null;
        }
    }
}
