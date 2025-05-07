package edu.ct.gateway.controller;

import edu.ct.gateway.dto.ExamResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class AdminExamResultController {

    private final RestTemplate restTemplate;

    @GetMapping("/results")
    public ResponseEntity<List<ExamResultResponse>> getResults() {
        ResponseEntity<ExamResultResponse[]> response = restTemplate.getForEntity(
                "http://exam-service/api/grading/results/latest", ExamResultResponse[].class);

        return ResponseEntity.ok(Arrays.asList(response.getBody()));
    }
    
    @GetMapping("/results/user/{userId}")
    public ResponseEntity<List<ExamResultResponse>> getUserResults(@PathVariable Long userId) {
        ResponseEntity<ExamResultResponse[]> response = restTemplate.getForEntity(
                "http://exam-service/api/grading/results/user/" + userId, ExamResultResponse[].class);

        return ResponseEntity.ok(Arrays.asList(response.getBody()));
    }
}