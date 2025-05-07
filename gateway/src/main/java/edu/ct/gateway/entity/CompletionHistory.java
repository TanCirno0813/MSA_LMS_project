package edu.ct.gateway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class CompletionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long lectureId;
    private String lectureTitle;
    private String contentTitle;
    private LocalDate completedAt;

    private Long watchedTime;
    private Long totalDuration;
    private Long resumeTime;

    @Column(nullable = false)
    private Boolean isCompleted = false; // ✅ 90% 이상 시 true
}
