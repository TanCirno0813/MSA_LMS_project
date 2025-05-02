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
}

