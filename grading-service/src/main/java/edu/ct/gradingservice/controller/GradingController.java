package edu.ct.gradingservice.controller;

import edu.ct.gradingservice.dto.AnswerSubmit;
import edu.ct.gradingservice.dto.ResultResponse;
import edu.ct.gradingservice.service.GradingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grading")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GradingController {

    private final GradingService gradingService;

    @PostMapping("/submit")
    public ResultResponse gradeAllExams(@RequestBody List<AnswerSubmit> submissions) {
        return gradingService.gradeMultiple(submissions);
    }
}
