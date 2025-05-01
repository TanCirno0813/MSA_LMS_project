package edu.ct.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentDto {
    private Long id;
    private String title;
    private String type;
    private String url;
    private Long lectureId;
}