package edu.ct.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LectureDto {
    private Long id;
    private String author;
    private String title;
    private String description;
    private String thumbnail;
    private String category;
} 