package edu.ct.examservice.service;

import edu.ct.examservice.dto.*;
import edu.ct.examservice.entity.Exam;
import edu.ct.examservice.entity.ExamResult;
import edu.ct.examservice.repository.ExamRepository;
import edu.ct.examservice.repository.ExamResultRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GradingService {

    private final ExamRepository examRepository;
    private final ExamResultRepository examResultRepository;
    private final ExamClientService examClientService;

    public List<ExamResultResponse> gradeAll(List<ExamResultRequest> requests) {
        List<ExamResultResponse> results = new ArrayList<>();
        for (ExamResultRequest request : requests) {
            results.add(grade(request));
        }
        return results;
    }

    public ExamResultResponse grade(ExamResultRequest request) {
        JSONArray questions = new JSONArray(request.getQuestionJson());
        int total = 0;
        int correct = 0;
        String examIdStr = String.valueOf(request.getExamId());

        List<QuestionResult> questionResults = new ArrayList<>();

        for (int i = 0; i < questions.length(); i++) {
            JSONObject q = questions.getJSONObject(i);
            String type = q.getString("type");
            int questionId = q.getInt("id");
            String key = examIdStr + "_" + questionId;

            String userAnswer = request.getAnswers().getOrDefault(key, "").trim();
            String correctAnswer = q.optString("answer", "").trim();

            if (correctAnswer.isEmpty()) continue;

            total++;
            boolean isCorrect = false;

            if ("objective".equals(type)) {
                isCorrect = normalize(userAnswer).equals(normalize(correctAnswer));
            } else if ("subjective".equals(type)) {
                List<String> keywords = Arrays.stream(correctAnswer.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList();

                isCorrect = keywords.stream().allMatch(k -> normalize(userAnswer).contains(normalize(k)));
            }

            if (isCorrect) correct++;

            QuestionResult qr = new QuestionResult();
            qr.setQuestionId(questionId);
            qr.setQuestion(q.getString("question"));
            qr.setUserAnswer(userAnswer);
            qr.setCorrectAnswer(correctAnswer);
            qr.setCorrect(isCorrect);
            questionResults.add(qr);
        }

        double score = total > 0 ? (double) correct / total * 100.0 : 0.0;
        boolean passed = correct >= (total / 2.0);

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("시험 정보를 찾을 수 없습니다."));

        ExamResult entity = ExamResult.builder()
                .exam(exam)
                .userId(request.getUserId())
                .answers(new JSONObject(request.getAnswers()).toString())
                .totalQuestions(total)
                .correctAnswers(correct)
                .score((int) score)
                .passed(passed)
                .submittedAt(LocalDateTime.now())
                .build();

        examResultRepository.save(entity);

        return ExamResultResponse.builder()
                .examId(exam.getId())
                .userId(request.getUserId())
                .totalQuestions(total)
                .correctAnswers(correct)
                .score(score)
                .passed(passed)
                .examTitle(examClientService.getExamTitleById(exam.getId()))
                .questionResults(questionResults) // ✅ 핵심!
                .build();
    }

    private String normalize(String str) {
        return str == null ? "" : str
                .replaceAll("[\\u0000-\\u001F\\u007F\\u200B\\uFEFF\\u00A0]", "")
                .replaceAll("\\s+", " ")
                .trim()
                .toLowerCase();
    }

    public List<ExamResult> getLatestResults() {
        return examResultRepository.findLatestResults(); // ✅ 이미 구현돼 있음
    }

    public List<ExamResult> getUserResults(Long userId) {
        return examResultRepository.findByUserId(userId);
    }

    public ExamResultResponse toResponse(ExamResult result) {
        return ExamResultResponse.builder()
                .id(result.getId())
                .examId(result.getExam().getId())
                .userId(result.getUserId())
                .totalQuestions(result.getTotalQuestions())
                .correctAnswers(result.getCorrectAnswers())
                .score(result.getScore())
                .passed(result.getPassed())
                .examTitle(result.getExam().getTitle())
                .build();
    }
}


