package edu.ct.admin.controller;

import edu.ct.admin.dto.LectureDto;
import edu.ct.admin.service.LectureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admins/lectures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LectureAdminController {

    private final LectureService lectureService;

    @GetMapping
    public ResponseEntity<?> getAllLectures() {
        try {
            log.info("Fetching all lectures without pagination");
            List<LectureDto> lectures = lectureService.getAllLecturesWithoutPagination();
            return ResponseEntity.ok(lectures);
        } catch (HttpClientErrorException.NotFound e) {
            log.error("Lecture service endpoint not found: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Lecture service endpoint not found. Please check if the lecture service is running and the API path is correct."));
        } catch (Exception e) {
            log.error("Error fetching lectures: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to fetch lectures: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLectureById(@PathVariable Long id) {
        try {
            LectureDto lecture = lectureService.getLectureById(id);
            return ResponseEntity.ok(lecture);
        } catch (Exception e) {
            log.error("Error fetching lecture with id {}: {}", id, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to fetch lecture: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createLecture(@RequestBody LectureDto lectureDto) {
        try {
            LectureDto createdLecture = lectureService.createLecture(lectureDto);
            return new ResponseEntity<>(createdLecture, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating lecture: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to create lecture: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLecture(@PathVariable Long id, @RequestBody LectureDto lectureDto) {
        try {
            lectureService.updateLecture(id, lectureDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error updating lecture with id {}: {}", id, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to update lecture: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLecture(@PathVariable Long id) {
        try {
            lectureService.deleteLecture(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting lecture with id {}: {}", id, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to delete lecture: " + e.getMessage()));
        }
    }
} 