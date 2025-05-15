package edu.ct.chat.client;

import edu.ct.chat.dto.LectureDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "lecture-service")
public interface LectureClient {
    @GetMapping("/api/lectures/all")
    List<LectureDto> getAllLectures();
}

