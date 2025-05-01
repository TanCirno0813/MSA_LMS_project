package edu.ct.gradingservice.dto;

import lombok.Getter;

import java.util.List;


@Getter
public class ResultResponse {
    private int totalQuestions;
    private int correctCount;
    private double score;
    private String examTitle;
    private List<QuestionResult> questionResults;

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public void setQuestionResults(List<QuestionResult> questionResults) {
        this.questionResults = questionResults;
    }
}

