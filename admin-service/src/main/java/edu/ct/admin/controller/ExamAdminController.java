package edu.ct.admin.controller;

import edu.ct.admin.dto.ExamDto;
import edu.ct.admin.service.ExamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admins/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE })
public class ExamAdminController {

    private final ExamService examService;

    /**
     * 특정 강의의 모든 시험을 조회합니다.
     */
    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<ExamDto>> getExamsByLectureId(@PathVariable Long lectureId) {
        try {
            List<ExamDto> exams = examService.getExamsByLectureId(lectureId);
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            log.error("Error fetching exams for lecture ID {}: {}", lectureId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    /**
     * 특정 ID의 시험을 조회합니다.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getExam(@PathVariable Long id) {
        try {
            log.info("시험 데이터 요청 - ID: {}", id);
            ExamDto exam = examService.getExamById(id);
            log.info("시험 데이터 응답 - ID: {}, 제목: {}, 질문 데이터 크기: {}", 
                id, exam.getTitle(), exam.getQuestion() != null ? exam.getQuestion().length() : 0);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            log.error("시험 데이터 조회 실패 - ID: {}, 오류: {}", id, e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "시험을 찾을 수 없습니다: " + e.getMessage()));
        }
    }

    /**
     * 특정 ID의 시험을 조회합니다. (별칭 경로 - 하위 호환성 유지)
     */
    @GetMapping("/quiz/{id}")
    public ResponseEntity<?> getExamById(@PathVariable Long id) {
        log.info("퀴즈 데이터 요청 (quiz 경로) - ID: {}, 기본 경로로 리다이렉트", id);
        return getExam(id);
    }

    /**
     * 새로운 시험을 생성합니다.
     */
    @PostMapping
    public ResponseEntity<?> createExam(@RequestBody ExamDto examDto) {
        try {
            ExamDto createdExam = examService.createExam(examDto);
            return new ResponseEntity<>(createdExam, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating exam: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "시험 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 기존 시험을 수정합니다.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Long id, @RequestBody ExamDto examDto) {
        try {
            examService.updateExam(id, examDto);
            return ResponseEntity.ok().body(Collections.singletonMap("message", "시험이 성공적으로 업데이트되었습니다."));
        } catch (Exception e) {
            log.error("Error updating exam with ID {}: {}", id, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "시험 수정에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 시험을 삭제합니다.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        try {
            examService.deleteExam(id);
            return ResponseEntity.ok().body(Collections.singletonMap("message", "시험이 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            log.error("Error deleting exam with ID {}: {}", id, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "시험 삭제에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 시험 문제 목록을 업데이트합니다.
     */
    @PutMapping("/{id}/questions")
    public ResponseEntity<?> updateExamQuestions(@PathVariable Long id, @RequestBody String questions) {
        try {
            ExamDto exam = examService.getExamById(id);
            if (exam != null) {
                exam.setQuestion(questions);
                examService.updateExam(id, exam);
                return ResponseEntity.ok().body(Collections.singletonMap("message", "시험 문제가 성공적으로 업데이트되었습니다."));
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("error", "시험을 찾을 수 없습니다."));
            }
        } catch (Exception e) {
            log.error("Error updating questions for exam with ID {}: {}", id, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "시험 문제 수정에 실패했습니다: " + e.getMessage()));
        }
    }
} 