package edu.ct.controller;

import edu.ct.dto.LectureResourceDto;
import edu.ct.service.LectureResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/lectures")
@RequiredArgsConstructor
public class LectureResourceController {

    private final LectureResourceService service;

    @GetMapping("/{lectureId}/resources")
    public List<LectureResourceDto> getResources(@PathVariable Long lectureId) {
        return service.getResources(lectureId);
    }

    @PostMapping("/{lectureId}/resources")
    public ResponseEntity<String> upload(@PathVariable Long lectureId, @RequestParam("file") MultipartFile file) {
        try {
            service.upload(lectureId, file);
            return ResponseEntity.ok("업로드 성공");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("업로드 실패: " + e.getMessage());
        }
    }

    @GetMapping("/resources/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
        Resource resource = new UrlResource(Paths.get("uploads").resolve(fileName).toUri());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("삭제 성공");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("삭제 실패: " + e.getMessage());
        }
    }
}

