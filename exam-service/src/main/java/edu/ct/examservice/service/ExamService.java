package edu.ct.examservice.service;

import edu.ct.examservice.dto.ExamCreateRequest;
import edu.ct.examservice.dto.ExamResponse;
import edu.ct.examservice.entity.Exam;
import edu.ct.examservice.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamService {

    private final ExamRepository examRepository;

    public Long createExam(ExamCreateRequest request) {
        try {
            log.info("시험 생성 시작 - 제목: {}, 강의 ID: {}", request.getTitle(), request.getLectureId());
            
            Exam exam = new Exam();
            exam.setLectureId(request.getLectureId());
            exam.setTitle(request.getTitle());
            exam.setDescription(request.getDescription());
            exam.setStartTime(request.getStartTime());
            exam.setEndTime(request.getEndTime());
            exam.setQuestion(request.getQuestion());
            Exam savedExam = examRepository.save(exam);
            log.info("시험 생성 완료 - ID: {}", savedExam.getId());
            
            return savedExam.getId();
        } catch (Exception e) {
            log.error("시험 생성 실패 - 제목: {}, 오류: {}", request.getTitle(), e.getMessage(), e);
            throw e;
        }
    }

    public ExamResponse getExam(Long id) {
        Exam exam = examRepository.findById(id).orElseThrow();
        ExamResponse res = new ExamResponse(exam);

        return res;
    }

    public List<ExamResponse> getAllExams() {
        return examRepository.findAll()
                .stream()
                .map(ExamResponse::new)
                .toList();
    }
    public List<ExamResponse> getExamsByLectureId(Long lectureId) {
        List<Exam> exams = examRepository.findByLectureId(lectureId);
        return exams.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateExam(Long id, ExamCreateRequest request) {
        try {
            log.info("시험 업데이트 시작 - ID: {}, 제목: {}", id, request.getTitle());
            
            Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("시험을 찾을 수 없습니다. ID: " + id));
            
            exam.setLectureId(request.getLectureId());
            exam.setTitle(request.getTitle());
            exam.setDescription(request.getDescription());
            exam.setStartTime(request.getStartTime());
            exam.setEndTime(request.getEndTime());
            exam.setQuestion(request.getQuestion());
            
            examRepository.save(exam);
            log.info("시험 업데이트 완료 - ID: {}", id);
        } catch (Exception e) {
            log.error("시험 업데이트 실패 - ID: {}, 오류: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    private ExamResponse toResponse(Exam exam) {
        ExamResponse response = new ExamResponse();
        response.setId(exam.getId());
        response.setLectureId(exam.getLectureId());
        response.setTitle(exam.getTitle());
        response.setDescription(exam.getDescription());
        response.setStartTime(exam.getStartTime());
        response.setEndTime(exam.getEndTime());
        response.setQuestion(exam.getQuestion());
        return response;
    }
}