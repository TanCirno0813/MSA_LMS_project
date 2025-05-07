package edu.ct.admin.controller;

import edu.ct.admin.dto.EnrollmentAdminDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/admins/enrollments")
@RequiredArgsConstructor
public class AdminEnrollmentController {

    private final RestTemplate restTemplate;

    private static final String LECTURE_SERVICE_URL = "http://lecture-service/api/enrollments";

    // 전체 수강 신청 목록 조회
    @GetMapping
    public ResponseEntity<List<EnrollmentAdminDto>> getAllEnrollments() {
        ResponseEntity<List<EnrollmentAdminDto>> response = restTemplate.exchange(
                LECTURE_SERVICE_URL + "/all",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EnrollmentAdminDto>>() {}
        );
        return ResponseEntity.ok(response.getBody());
    }

    // 수강 신청 승인 처리
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveEnrollment(@PathVariable Long id) {
        restTemplate.put(LECTURE_SERVICE_URL + "/" + id + "/approve", null);
        return ResponseEntity.ok("승인 완료");
    }

    // 수강 신청 거절 처리
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectEnrollment(@PathVariable Long id) {
        restTemplate.put(LECTURE_SERVICE_URL + "/" + id + "/reject", null);
        return ResponseEntity.ok("거절 완료");
    }
}
