package edu.ct.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LectureDetailDto {
    private Long id;
    private String title;
    private String author;
    private String description;
    private List<ContentDto> contents;
}