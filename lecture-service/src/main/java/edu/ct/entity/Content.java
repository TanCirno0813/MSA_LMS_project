package edu.ct.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String type; // 예: "video", "quiz"

    private String url; // 영상 링크 or 퀴즈 페이지 연결용

    @ManyToOne
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;
}
