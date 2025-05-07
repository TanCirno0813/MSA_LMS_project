package edu.ct.examservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ct.examservice.dto.*;
import edu.ct.examservice.entity.Exam;
import edu.ct.examservice.entity.ExamResult;
import edu.ct.examservice.repository.ExamRepository;
import edu.ct.examservice.repository.ExamResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamService {

    private final ExamRepository examRepository;
    private final ExamResultRepository examResultRepository;
    private final ObjectMapper objectMapper;

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

    @Transactional(readOnly = true)
    public List<ExamResultResponse> getLatestExamResults() {
        List<ExamResult> results = examResultRepository.findLatestResults();

        return results.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ExamResultResponse convertToDto(ExamResult examResult) {
        Exam exam = examResult.getExam();

        List<Question> questions = parseQuestions(exam.getQuestion());
        Map<String, String> userAnswers = parseUserAnswers(examResult.getAnswers());

        List<QuestionResult> questionResults = questions.stream()
                .map(q -> {
                    String key = exam.getId() + "_" + q.getId();
                    String userAnswer = userAnswers.getOrDefault(key, null);
                    boolean correct = userAnswer != null && userAnswer.equalsIgnoreCase(q.getCorrectAnswer());

                    return QuestionResult.builder()
                            .questionId(q.getId())
                            .question(q.getQuestionText())
                            .userAnswer(userAnswer)
                            .correctAnswer(q.getCorrectAnswer())
                            .isCorrect(correct)
                            .build();
                })
                .collect(Collectors.toList());

        int correctCount = (int) questionResults.stream().filter(QuestionResult::isCorrect).count();
        int totalQuestions = questionResults.size();
        double score = totalQuestions > 0 ? (correctCount * 100.0 / totalQuestions) : 0;
        boolean passed = correctCount >= Math.ceil(totalQuestions / 2.0);

        return ExamResultResponse.builder()
                .id(examResult.getId())
                .examId(exam.getId())
                .userId(examResult.getUserId())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctCount)
                .score(score)
                .passed(passed)
                .examTitle(exam.getTitle())
                .questionResults(questionResults)
                .build();
    }

    private List<Question> parseQuestions(String questionJson) {
        try {
            return objectMapper.readValue(questionJson, new TypeReference<List<Question>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("문제 파싱 오류", e);
        }
    }

    private Map<String, String> parseUserAnswers(String answersJson) {
        try {
            return objectMapper.readValue(answersJson, new TypeReference<Map<String, String>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("답안 파싱 오류", e);
        }
    }

    public List<ExamResultResponse> getResultsByUser(Long userId) {
        List<ExamResult> results = examResultRepository.findByUserId(userId);
        return results.stream()
                .map(r -> new ExamResultResponse(r.getExam().getTitle(), r.getScore()))
                .collect(Collectors.toList());
    }
}