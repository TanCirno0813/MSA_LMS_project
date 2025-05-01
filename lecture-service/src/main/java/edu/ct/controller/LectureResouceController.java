package edu.ct.controller;

import edu.ct.dto.LectureResourceDto;
import edu.ct.service.LectureResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/lectures")
@RequiredArgsConstructor
public class LectureResouceController {

    private final LectureResourceService service;

    @GetMapping("/{lectureId}/resources")
    public List<LectureResourceDto> getResources(@PathVariable Long lectureId) {
        return service.getResources(lectureId);
    }

    @PostMapping("/{lectureId}/resources")
    public ResponseEntity<?> upload(@PathVariable Long lectureId, @RequestParam("file") MultipartFile file) {
        try {
            service.upload(lectureId, file);
            return ResponseEntity.ok("업로드 성공");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("업로드 실패");
        }
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("삭제 성공");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("파일 삭제 실패: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("자료를 찾을 수 없습니다: " + e.getMessage());
        }
    }
}
