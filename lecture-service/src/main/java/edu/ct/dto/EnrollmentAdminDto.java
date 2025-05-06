package edu.ct.dto;

import edu.ct.entity.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor // ✅ 이거 추가!
public class EnrollmentAdminDto {
    private Long id;
    private Long lectureId;
    private String userId;
    private EnrollmentStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;
}