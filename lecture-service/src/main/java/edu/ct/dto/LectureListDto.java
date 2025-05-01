package edu.ct.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LectureListDto {
    private Long id;
    private String title;
    private String author;
    private String thumbnail;
    private String category;
    private String level;
    private int likes;
    private String description;
}