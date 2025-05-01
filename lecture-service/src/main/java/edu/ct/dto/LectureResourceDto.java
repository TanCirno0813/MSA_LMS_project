package edu.ct.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LectureResourceDto {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String uploadedAt;
    private Long lectureId;
}
