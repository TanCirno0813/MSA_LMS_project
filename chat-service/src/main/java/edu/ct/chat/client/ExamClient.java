package edu.ct.chat.client;

import edu.ct.chat.dto.ExamResultDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "exam-service")
public interface ExamClient {
    @GetMapping("/api/exams/user/{userId}")
    List<ExamResultDto> getResultsByUser(@PathVariable("userId") Long userId);
}
