package edu.ct.controller;

import edu.ct.dto.EnrollmentAdminDto;
import edu.ct.dto.EnrollmentRequestDto;
import edu.ct.entity.Enrollment;
import edu.ct.entity.EnrollmentStatus;
import edu.ct.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class LectureEnrollmentController {

    private final EnrollmentRepository enrollmentRepository;

    // 수강 신청 API
    @PostMapping("/api/lectures/{lectureId}/enrollments")
    public ResponseEntity<?> enroll(@PathVariable Long lectureId, @RequestBody EnrollmentRequestDto dto) {
        // 이미 신청한 경우 중복 신청 방지
        if (enrollmentRepository.existsByLectureIdAndUserIdAndStatus(
                lectureId, dto.getUserId(), EnrollmentStatus.PENDING) ||
            enrollmentRepository.existsByLectureIdAndUserIdAndStatus(
                lectureId, dto.getUserId(), EnrollmentStatus.APPROVED)) {
            return ResponseEntity.badRequest().body("이미 신청하였거나 승인된 강의입니다.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setLectureId(lectureId);
        enrollment.setUserId(dto.getUserId());
        enrollment.setStatus(EnrollmentStatus.PENDING);
        enrollment.setAppliedAt(LocalDateTime.now());

        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok("수강 신청 완료");
    }

    // 사용자 수강 신청 상태 확인 API
    @GetMapping("/api/lectures/{lectureId}/enrollments/status")
    public ResponseEntity<?> getEnrollmentStatus(
            @PathVariable Long lectureId,
            @RequestParam String userId) {

        // APPROVED 상태 우선 확인
        if (enrollmentRepository.existsByLectureIdAndUserIdAndStatus(lectureId, userId, EnrollmentStatus.APPROVED)) {
            return ResponseEntity.ok(Map.of("status", "APPROVED"));
        }

        // PENDING 상태 확인
        if (enrollmentRepository.existsByLectureIdAndUserIdAndStatus(lectureId, userId, EnrollmentStatus.PENDING)) {
            return ResponseEntity.ok(Map.of("status", "PENDING"));
        }

        // REJECTED 상태 확인
        if (enrollmentRepository.existsByLectureIdAndUserIdAndStatus(lectureId, userId, EnrollmentStatus.REJECTED)) {
            return ResponseEntity.ok(Map.of("status", "REJECTED"));
        }

        // 신청 내역 없음
        return ResponseEntity.ok(Map.of("status", "NONE")); // ✅ 변경
    }

    // 관리자용 모든 수강신청 목록 조회 API
    @GetMapping("/api/enrollments/all")
    public ResponseEntity<List<EnrollmentAdminDto>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        List<EnrollmentAdminDto> result = enrollments.stream()
                .map(e -> new EnrollmentAdminDto(
                        e.getId(),
                        e.getLectureId(),
                        e.getUserId(),
                        e.getStatus(),
                        e.getAppliedAt(),
                        e.getApprovedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // 수강 신청 승인 API
    @PutMapping("/api/enrollments/{id}/approve")
    public ResponseEntity<?> approveEnrollment(@PathVariable Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 수강신청 정보가 없습니다."));
        
        enrollment.setStatus(EnrollmentStatus.APPROVED);
        enrollment.setApprovedAt(LocalDateTime.now());
        enrollmentRepository.save(enrollment);
        
        return ResponseEntity.ok("승인 완료");
    }

    // 수강 신청 거절 API
    @PutMapping("/api/enrollments/{id}/reject")
    public ResponseEntity<?> rejectEnrollment(@PathVariable Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 수강신청 정보가 없습니다."));
        
        enrollment.setStatus(EnrollmentStatus.REJECTED);
        enrollment.setApprovedAt(LocalDateTime.now()); // 거절 시간도 기록
        enrollmentRepository.save(enrollment);
        
        return ResponseEntity.ok("거절 완료");
    }
}