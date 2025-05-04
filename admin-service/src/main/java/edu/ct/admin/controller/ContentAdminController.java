package edu.ct.admin.controller;

import edu.ct.admin.dto.ContentDto;
import edu.ct.admin.service.ContentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admins/contents")
@RequiredArgsConstructor
public class ContentAdminController {

    private final ContentService contentService;

    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<ContentDto>> getContentsByLectureId(@PathVariable Long lectureId) {
        List<ContentDto> contents = contentService.getContentsByLectureId(lectureId);
        return ResponseEntity.ok(contents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentDto> getContentById(@PathVariable Long id) {
        try {
            ContentDto content = contentService.getContentById(id);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            log.error("Error fetching content with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ContentDto> createContent(@RequestBody ContentDto contentDto) {
        try {
            ContentDto newContent = contentService.createContent(contentDto);
            return new ResponseEntity<>(newContent, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating content: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateContent(@PathVariable Long id, @RequestBody ContentDto contentDto) {
        try {
            contentService.updateContent(id, contentDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error updating content with ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        try {
            contentService.deleteContent(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting content with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
} 