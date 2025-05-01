package edu.ct.examservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lecture_id")
    private Long lectureId;


    private String title;
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Lob
    @Column(name = "question", columnDefinition = "LONGTEXT")
    private String question;

}


