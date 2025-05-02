package edu.ct.examservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    private int id;
    @JsonProperty("question")
    private String questionText;

    @JsonProperty("answer")
    private String correctAnswer;
}
