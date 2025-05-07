package edu.ct.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureDto {
    private Long id;
    private String title;
    private String author;
    private String thumbnail;
    private String category;
    private String level;
    private int likes;
    private String description;

    public LectureDto(Long id, String title) {
    }
}