package edu.ct.examservice.dto;


import edu.ct.examservice.entity.Exam;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ExamResponse {
    private Long id;
    private Long lectureId;  // ✅ 추가
    private String title;
    private String description;
    private String question;
    private LocalDateTime startTime;
    private LocalDateTime endTime;


    public ExamResponse(Exam exam) {
        this.id = exam.getId();
        this.lectureId = exam.getLectureId();
        this.title = exam.getTitle();
        this.description = exam.getDescription();
        this.question = exam.getQuestion();
    }
}

