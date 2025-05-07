package edu.ct.examservice.controller;

import edu.ct.examservice.dto.ExamResultRequest;
import edu.ct.examservice.dto.ExamResultResponse;
import edu.ct.examservice.entity.ExamResult;
import edu.ct.examservice.service.GradingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grading")
@RequiredArgsConstructor
public class GradingController {

    private final GradingService gradingService;

    @PostMapping("/submit")
    public ResponseEntity<List<ExamResultResponse>> submitAll(@RequestBody List<ExamResultRequest> requests) {
        List<ExamResultResponse> responses = gradingService.gradeAll(requests);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/results/latest")
    public ResponseEntity<List<ExamResultResponse>> getLatestResults() {
        List<ExamResult> latest = gradingService.getLatestResults(); // 🔄 서비스 추가
        List<ExamResultResponse> response = latest.stream()
                .map(gradingService::toResponse) // 🔄 ExamResult → ExamResultResponse로 변환
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/results/user/{userId}")
    public ResponseEntity<List<ExamResultResponse>> getUserResults(@PathVariable Long userId) {
        List<ExamResult> userResults = gradingService.getUserResults(userId);
        List<ExamResultResponse> response = userResults.stream()
                .map(gradingService::toResponse)
                .toList();
                
        return ResponseEntity.ok(response);
    }
}

