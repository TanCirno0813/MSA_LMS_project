package edu.ct.examservice.controller;

import edu.ct.examservice.dto.ExamCreateRequest;
import edu.ct.examservice.dto.ExamResponse;
import edu.ct.examservice.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping
    public ResponseEntity<Long> createExam(@RequestBody ExamCreateRequest request) {
        return ResponseEntity.ok(examService.createExam(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResponse> getExam(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExam(id));
    }

    @GetMapping
    public ResponseEntity<List<ExamResponse>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<ExamResponse>> getExamsByLectureId(@PathVariable Long lectureId) {
        return ResponseEntity.ok(examService.getExamsByLectureId(lectureId));
    }

    /**
     * 기존 시험 정보를 업데이트합니다.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateExam(@PathVariable Long id, @RequestBody ExamCreateRequest request) {
        examService.updateExam(id, request);
        return ResponseEntity.ok().build();
    }
}