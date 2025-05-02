package edu.ct.examservice.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResultResponse {
    private Long id;
    private Long examId;
    private Long userId;
    private int totalQuestions;
    private int correctAnswers;
    private double score;
    private boolean passed;
    private String examTitle;
    private List<QuestionResult> questionResults;
}
