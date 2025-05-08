package edu.ct.recruitment.controller;

import edu.ct.recruitment.dto.RecruitmentDto;
import edu.ct.recruitment.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitments")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    public RecruitmentController(RecruitmentService recruitmentService) {
        this.recruitmentService = recruitmentService;
    }

    @GetMapping
    public List<RecruitmentDto> getRecruitments(
            @RequestParam(value = "pageNo", required = false) Integer pageNo,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "filter", required = false) String filter) {
        return recruitmentService.fetchRecruitments(pageNo, search, filter);
    }
}

