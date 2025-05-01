package edu.ct.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class LectureResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileUrl;

    private LocalDateTime uploadedAt;

    private Long lectureId;

    public LectureResource(String fileName, String fileUrl, Long lectureId) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.uploadedAt = LocalDateTime.now();
        this.lectureId = lectureId;
    }
}
