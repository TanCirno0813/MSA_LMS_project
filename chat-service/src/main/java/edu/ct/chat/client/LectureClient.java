package edu.ct.chat.client;

import edu.ct.chat.dto.LectureDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "lecture-service")
public interface LectureClient {
    @GetMapping("/api/lectures/user/{userId}")
    List<LectureDto> getLecturesByUser(@PathVariable("userId") Long userId);
}

