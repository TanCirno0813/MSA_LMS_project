package edu.ct.controller;

import edu.ct.dto.ContentDto;
import edu.ct.dto.LectureDetailDto;
import edu.ct.dto.LectureDto;
import edu.ct.dto.LectureListDto;
import edu.ct.entity.Lecture;
import edu.ct.repository.LectureRepository;
import edu.ct.service.ContentService;
import edu.ct.service.LectureService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/lectures")
@RequiredArgsConstructor
public class LectureController {

    private final LectureRepository lectureRepository;
    private final LectureService lectureService;

    @GetMapping
    public Object getLectures(
            @RequestParam(required = false, defaultValue = "false") boolean simple,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "9") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword
    ) {
        // 단순 리스트 요청인 경우
        if (simple) {
            log.info("Returning simple lecture list");
            // 이름, ID, 설명만 담긴 간단한 응답 생성
            List<Map<String, Object>> simpleLectures = lectureRepository.findAll().stream()
                .map(lecture -> {
                    Map<String, Object> simpleLecture = new HashMap<>();
                    simpleLecture.put("id", lecture.getId());
                    simpleLecture.put("title", lecture.getTitle());
                    simpleLecture.put("author", lecture.getAuthor());
                    simpleLecture.put("description", lecture.getDescription());
                    simpleLecture.put("category", lecture.getCategory());
                    simpleLecture.put("thumbnail", lecture.getThumbnail());
                    return simpleLecture;
                })
                .collect(Collectors.toList());
            return simpleLectures;
        }
        
        // 페이징 요청인 경우
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "id"));
        Page<Lecture> lecturePage;

        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty() && !"전체".equals(category);

        if (hasCategory && hasKeyword) {
            lecturePage = lectureRepository.findByCategoryAndTitleContainingIgnoreCase(category, keyword, pageable);
        } else if (hasCategory) {
            lecturePage = lectureRepository.findByCategory(category, pageable);
        } else if (hasKeyword) {
            lecturePage = lectureRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        } else {
            lecturePage = lectureRepository.findAll(pageable);
        }

        List<LectureListDto> dtoList = lecturePage.getContent().stream().map(lecture -> {
            LectureListDto dto = new LectureListDto();
            dto.setId(lecture.getId());
            dto.setTitle(lecture.getTitle());
            dto.setAuthor(lecture.getAuthor());
            dto.setThumbnail(lecture.getThumbnail());
            dto.setCategory(lecture.getCategory());
            dto.setLikes(lecture.getLikeCount());  // ✅ 좋아요 개수 반영
            dto.setDescription(lecture.getDescription());
            return dto;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("lectures", dtoList);
        result.put("totalCount", lecturePage.getTotalElements());
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<LectureDetailDto> getLecture(@PathVariable Long id) {
        return lectureRepository.findById(id)
                .map(lecture -> {
                    LectureDetailDto dto = new LectureDetailDto();
                    dto.setId(lecture.getId());
                    dto.setTitle(lecture.getTitle());
                    dto.setAuthor(lecture.getAuthor());
                    dto.setDescription(lecture.getDescription());

                    List<ContentDto> contents = lecture.getContents().stream().map(content -> {
                        ContentDto c = new ContentDto();
                        c.setId(content.getId());
                        c.setTitle(content.getTitle());
                        c.setType(content.getType());
                        c.setUrl(content.getUrl());
                        return c;
                    }).collect(Collectors.toList());

                    dto.setContents(contents);
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lecture> createLecture(@RequestBody Lecture lecture) {
        Lecture savedLecture = lectureRepository.save(lecture);
        return new ResponseEntity<>(savedLecture, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lecture> updateLecture(@PathVariable Long id, @RequestBody Lecture lectureDetails) {
        return lectureRepository.findById(id)
                .map(lecture -> {
                    lecture.setTitle(lectureDetails.getTitle());
                    lecture.setAuthor(lectureDetails.getAuthor());
                    lecture.setDescription(lectureDetails.getDescription());
                    lecture.setThumbnail(lectureDetails.getThumbnail());
                    lecture.setCategory(lectureDetails.getCategory());
                    
                    Lecture updatedLecture = lectureRepository.save(lecture);
                    return ResponseEntity.ok(updatedLecture);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLecture(@PathVariable Long id) {
        return lectureRepository.findById(id)
                .map(lecture -> {
                    lectureRepository.delete(lecture);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<LectureDto> getLecturesByUser(@PathVariable Long userId) {
        return lectureService.getLecturesByUser(userId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LectureDto>> getAllLectures() {
        return ResponseEntity.ok(lectureService.getAllLectures());
    }


    @PostMapping("/{id}/like")
    public Map<String, Object> toggleLike(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        boolean liked = lectureService.toggleLike(id, userId);
        long likes = lectureService.countLikes(id);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", liked);
        response.put("likes", likes);

        return response;
    }

    @GetMapping("/{id}/likes")
    public long getLikes(@PathVariable Long id) {
        return lectureService.countLikes(id);
    }

}
