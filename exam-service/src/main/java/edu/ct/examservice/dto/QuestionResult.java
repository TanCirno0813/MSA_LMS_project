package edu.ct.examservice.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionResult {
    private int questionId;
    private String question;
    private String userAnswer;
    private String correctAnswer;
    @JsonProperty("correct")
    private boolean isCorrect;
}
