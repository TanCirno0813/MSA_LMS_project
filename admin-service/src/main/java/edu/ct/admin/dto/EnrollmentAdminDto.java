package edu.ct.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor // ✅ 이거 추가!
public class EnrollmentAdminDto {
    private Long id;
    private Long lectureId;
    private String userId;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;
}