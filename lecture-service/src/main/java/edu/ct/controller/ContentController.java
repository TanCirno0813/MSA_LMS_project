package edu.ct.controller;

import edu.ct.dto.ContentDto;
import edu.ct.entity.Content;
import edu.ct.entity.Lecture;
import edu.ct.repository.ContentRepository;
import edu.ct.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/contents")
@RequiredArgsConstructor
public class ContentController {

    private final ContentRepository contentRepository;
    private final LectureRepository lectureRepository;

    // 특정 강의의 모든 컨텐츠 조회
    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<ContentDto>> getContentsByLectureId(@PathVariable Long lectureId) {
        List<Content> contents = contentRepository.findByLectureId(lectureId);
        List<ContentDto> contentDtos = contents.stream()
                .map(content -> {
                    ContentDto dto = new ContentDto();
                    dto.setId(content.getId());
                    dto.setTitle(content.getTitle());
                    dto.setType(content.getType());
                    dto.setUrl(content.getUrl());
                    dto.setLectureId(content.getLecture().getId());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(contentDtos);
    }

    // 특정 컨텐츠 조회
    @GetMapping("/{id}")
    public ResponseEntity<ContentDto> getContentById(@PathVariable Long id) {
        return contentRepository.findById(id)
                .map(content -> {
                    ContentDto dto = new ContentDto();
                    dto.setId(content.getId());
                    dto.setTitle(content.getTitle());
                    dto.setType(content.getType());
                    dto.setUrl(content.getUrl());
                    dto.setLectureId(content.getLecture().getId());
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 새 컨텐츠 생성
    @PostMapping
    public ResponseEntity<ContentDto> createContent(@RequestBody ContentDto contentDto) {
        return lectureRepository.findById(contentDto.getLectureId())
                .map(lecture -> {
                    Content content = new Content();
                    content.setTitle(contentDto.getTitle());
                    content.setType(contentDto.getType());
                    content.setUrl(contentDto.getUrl());
                    content.setLecture(lecture);
                    
                    Content savedContent = contentRepository.save(content);
                    
                    ContentDto responseDto = new ContentDto();
                    responseDto.setId(savedContent.getId());
                    responseDto.setTitle(savedContent.getTitle());
                    responseDto.setType(savedContent.getType());
                    responseDto.setUrl(savedContent.getUrl());
                    responseDto.setLectureId(savedContent.getLecture().getId());
                    
                    return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
                })
                .orElse(ResponseEntity.badRequest().build());
    }

    // 컨텐츠 수정
    @PutMapping("/{id}")
    public ResponseEntity<ContentDto> updateContent(@PathVariable Long id, @RequestBody ContentDto contentDto) {
        return contentRepository.findById(id)
                .map(content -> {
                    // 강의 ID가 변경된 경우 새 강의를 연결
                    if (!content.getLecture().getId().equals(contentDto.getLectureId())) {
                        return lectureRepository.findById(contentDto.getLectureId())
                                .map(newLecture -> {
                                    updateContentFields(content, contentDto, newLecture);
                                    return saveAndReturnDto(content);
                                })
                                .orElse(ResponseEntity.badRequest().build());
                    } else {
                        // 강의 ID가 동일한 경우 기존 강의를 유지
                        updateContentFields(content, contentDto, content.getLecture());
                        return saveAndReturnDto(content);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 컨텐츠 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        return contentRepository.findById(id)
                .map(content -> {
                    contentRepository.delete(content);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 컨텐츠 필드 업데이트 헬퍼 메서드
    private void updateContentFields(Content content, ContentDto contentDto, Lecture lecture) {
        content.setTitle(contentDto.getTitle());
        content.setType(contentDto.getType());
        content.setUrl(contentDto.getUrl());
        content.setLecture(lecture);
    }

    // 저장 및 DTO 반환 헬퍼 메서드
    private ResponseEntity<ContentDto> saveAndReturnDto(Content content) {
        Content savedContent = contentRepository.save(content);
        
        ContentDto responseDto = new ContentDto();
        responseDto.setId(savedContent.getId());
        responseDto.setTitle(savedContent.getTitle());
        responseDto.setType(savedContent.getType());
        responseDto.setUrl(savedContent.getUrl());
        responseDto.setLectureId(savedContent.getLecture().getId());
        
        return ResponseEntity.ok(responseDto);
    }
} 