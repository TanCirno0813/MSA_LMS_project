package edu.ct.recruitment.controller;

import edu.ct.recruitment.dto.RecruitmentDto;
import edu.ct.recruitment.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitments")
@RequiredArgsConstructor
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @GetMapping
    public List<RecruitmentDto> getRecruitments(@RequestParam(defaultValue = "1") int pageNo) {
        return recruitmentService.getRecruitments(pageNo);
    }
}
