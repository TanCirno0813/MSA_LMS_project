package edu.ct.examservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultRequest {
    private Long examId;
    private Long userId;
    private Map<String, String> answers;
    private String questionJson;
}
