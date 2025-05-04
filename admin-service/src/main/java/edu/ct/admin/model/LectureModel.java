package edu.ct.admin.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LectureModel {
    private Long id;
    private String author;
    private String title;
    private String description;
    private String thumbnail;
    private String category;
} 