package edu.ct.dto;

import edu.ct.entity.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EnrollmentStatusDto {
    private Long lectureId;
    private EnrollmentStatus status;
}