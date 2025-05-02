package edu.ct.examservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // 누가 푼 것인지 (User Service 연동용)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String answers; // JSON 문자열로 저장 (ex: {"1":"A", "2":"B", "3":"서술형 답안"})

    private Integer totalQuestions;

    private Integer correctAnswers;

    private Boolean passed; // true = 합격, false = 불합격

    private Integer score;

    private LocalDateTime submittedAt;
}
