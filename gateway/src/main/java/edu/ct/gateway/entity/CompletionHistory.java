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
    private String contentTitle;
    private LocalDate completedAt;

    // ✅ 추가: 영상 시청 시간 및 전체 길이 (초 단위)
    private Long watchedTime;
    private Long totalDuration;
}
