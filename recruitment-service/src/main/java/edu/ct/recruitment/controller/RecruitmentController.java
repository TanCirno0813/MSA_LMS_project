package edu.ct.recruitment.controller;

import edu.ct.recruitment.dto.RecruitmentDto;
import edu.ct.recruitment.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recruitments")
@RequiredArgsConstructor
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRecruitments(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(required = false) String searchKeyword) {
        return ResponseEntity.ok(recruitmentService.getRecruitments(pageNo, searchKeyword));
    }
}
