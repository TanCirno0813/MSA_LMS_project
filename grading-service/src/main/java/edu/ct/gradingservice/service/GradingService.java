package edu.ct.gradingservice.service;

import edu.ct.gradingservice.dto.AnswerSubmit;
import edu.ct.gradingservice.dto.ResultResponse;
import edu.ct.gradingservice.dto.QuestionResult;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GradingService {

    private final ExamClientService examClientService;

    public ResultResponse grade(AnswerSubmit request) {
        JSONArray questions = new JSONArray(request.getQuestionJson());
        int total = 0;
        int correct = 0;

        String examId = String.valueOf(request.getExamId());
        List<QuestionResult> questionResults = new ArrayList<>();

        for (int i = 0; i < questions.length(); i++) {
            JSONObject q = questions.getJSONObject(i);
            String type = q.getString("type");
            int questionId = q.getInt("id");
            String key = examId + "_" + questionId;

            String userAnswer = request.getAnswers().getOrDefault(key, "").trim();
            String correctAnswer = q.optString("answer", "").trim();

            if (correctAnswer.isEmpty()) continue;

            total++;
            boolean isCorrect = false;

            if (type.equals("objective")) {
                System.out.printf("👉 비교 대상: userAnswer=[%s], correctAnswer=[%s]\n", userAnswer, correctAnswer);
                System.out.printf("📦 raw userAnswer bytes: %s\n", Arrays.toString(userAnswer.getBytes(StandardCharsets.UTF_8)));
                System.out.printf("📦 raw correctAnswer bytes: %s\n", Arrays.toString(correctAnswer.getBytes(StandardCharsets.UTF_8)));

                if (normalize(userAnswer).equals(normalize(correctAnswer))) {
                    correct++;
                    isCorrect = true;
                }
            } else if (type.equals("subjective")) {
                List<String> keywords = Arrays.stream(correctAnswer.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList();

                boolean allKeywordsPresent = keywords.stream()
                        .allMatch(k -> normalize(userAnswer).contains(normalize(k)));

                if (allKeywordsPresent) {
                    correct++;
                    isCorrect = true;
                }
            }

            QuestionResult qr = new QuestionResult();
            qr.setQuestionId(questionId);
            qr.setQuestion(q.getString("question"));
            qr.setUserAnswer(userAnswer);
            qr.setCorrectAnswer(correctAnswer.trim());
            qr.setCorrect(isCorrect);
            questionResults.add(qr);
        }

        ResultResponse result = new ResultResponse();
        result.setTotalQuestions(total);
        result.setCorrectCount(correct);
        result.setScore(total > 0 ? (double) correct / total * 100.0 : 0.0);
        result.setQuestionResults(questionResults);
        result.setExamTitle(examClientService.getExamTitleById(request.getExamId()));
        return result;
    }

    public ResultResponse gradeMultiple(List<AnswerSubmit> submissions) {
        int total = 0;
        int correct = 0;
        List<QuestionResult> allResults = new ArrayList<>();
        String examTitle = null;

        for (AnswerSubmit submission : submissions) {
            ResultResponse result = grade(submission);
            total += result.getTotalQuestions();
            correct += result.getCorrectCount();
            if (result.getQuestionResults() != null) {
                allResults.addAll(result.getQuestionResults());
            }
            if (examTitle == null && result.getExamTitle() != null) {
                examTitle = result.getExamTitle();
            }
        }

        ResultResponse finalResult = new ResultResponse();
        finalResult.setTotalQuestions(total);
        finalResult.setCorrectCount(correct);
        finalResult.setScore(total > 0 ? (double) correct / total * 100.0 : 0.0);
        finalResult.setQuestionResults(allResults);
        finalResult.setExamTitle(examTitle);
        return finalResult;
    }

    private String normalize(String str) {
        return str == null ? "" : str
                .replaceAll("[\\u0000-\\u001F\\u007F\\u200B\\uFEFF\\u00A0]", "") // 제어 문자, 특수 공백 제거
                .replaceAll("\\s+", " ") // 여러 공백 하나로
                .trim()
                .toLowerCase();
    }
}
