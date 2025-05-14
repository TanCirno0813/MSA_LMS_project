package edu.ct.admin.controller;

import edu.ct.admin.dto.LectureDto;
import edu.ct.admin.service.LectureService;
import edu.ct.admin.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LectureAdminController {

    private final LectureService lectureService;
    private final FileUploadService fileUploadService;

    @GetMapping("/lectures")
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

    @GetMapping("/lectures/{id}")
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

    @PostMapping("/lectures")
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

    @PutMapping("/lectures/{id}")
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

    @DeleteMapping("/lectures/{id}")
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
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            log.info("File upload request received. Original filename: {}", file.getOriginalFilename());
            
            if (file.isEmpty()) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "파일이 비어 있습니다."));
            }
            
            // 파일 확장자 검증
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "파일명이 유효하지 않습니다."));
            }
            
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
            if (!fileExtension.matches("\\.(jpg|jpeg|png|gif)$")) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "허용되지 않는 파일 형식입니다. jpg, jpeg, png, gif 파일만 업로드 가능합니다."));
            }
            
            // 파일 사이즈 검증 (5MB 이하)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "파일 크기가 5MB를 초과합니다."));
            }
            
            String fileUrl = fileUploadService.storeFile(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage(), e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "파일 업로드에 실패했습니다: " + e.getMessage()));
        }
    }
} 