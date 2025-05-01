package edu.ct.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LectureReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long lectureId; // 연결된 강의 ID
    private String title;
    @Column(length = 2000)
    private String content;
    private String lectureTitle; // 👈 추가

    private String author;
    private LocalDateTime createdAt;
}