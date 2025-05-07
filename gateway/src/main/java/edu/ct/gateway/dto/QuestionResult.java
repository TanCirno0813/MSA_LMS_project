package edu.ct.gateway.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResult {
    private int questionId;
    private String question;
    private String userAnswer;
    private String correctAnswer;

    @JsonProperty("correct")
    private boolean isCorrect;
}
