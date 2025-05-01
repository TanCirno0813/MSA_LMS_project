package edu.ct.gradingservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter @Setter
public class AnswerSubmit {
    private Long examId;
    private Map<String, String> answers;
    private String questionJson;
}
