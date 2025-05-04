package edu.ct.chat.service;

import edu.ct.chat.dto.ContentDto;
import edu.ct.chat.dto.ExamDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentService {

    private final RestTemplate restTemplate;
    private final ExamService examService;
    private static final String CONTENT_SERVICE_URL = "http://lecture-service/api/contents";

    public List<ContentDto> getContentsByLectureId(Long lectureId) {
        try {
            log.info("Requesting contents for lecture ID: {}", lectureId);
            ResponseEntity<List<ContentDto>> response = restTemplate.exchange(
                CONTENT_SERVICE_URL + "/lecture/" + lectureId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ContentDto>>() {}
            );
            
            log.info("Response status: {}", response.getStatusCode());
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            log.error("Error fetching contents for lecture ID {}: {}", lectureId, e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    public ContentDto getContentById(Long id) {
        return restTemplate.getForObject(CONTENT_SERVICE_URL + "/" + id, ContentDto.class);
    }

    public ContentDto createContent(ContentDto contentDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<ContentDto> request = new HttpEntity<>(contentDto, headers);
        
        // 컨텐츠 타입이 quiz인 경우 exam-service와 연동
        if ("quiz".equals(contentDto.getType())) {
            try {
                // url 필드에 exam ID가 있는지 확인
                if (contentDto.getUrl() != null && !contentDto.getUrl().isEmpty()) {
                    try {
                        Long examId = Long.parseLong(contentDto.getUrl());
                        // 기존 exam이 존재하는지 확인
                        examService.getExamById(examId);
                    } catch (NumberFormatException e) {
                        log.warn("URL is not a valid exam ID. Creating a new exam.");
                        // URL이 숫자가 아니면 새 exam 생성
                        createExamForQuizContent(contentDto);
                    } catch (Exception e) {
                        log.warn("Exam with ID {} not found. Creating a new exam.", contentDto.getUrl());
                        // exam이 존재하지 않으면 새 exam 생성
                        createExamForQuizContent(contentDto);
                    }
                } else {
                    // url이 비어있으면 새 exam 생성
                    createExamForQuizContent(contentDto);
                }
            } catch (Exception e) {
                log.error("Error integrating with exam service: {}", e.getMessage(), e);
            }
        }
        
        return restTemplate.postForObject(CONTENT_SERVICE_URL, request, ContentDto.class);
    }

    public void updateContent(Long id, ContentDto contentDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // 컨텐츠 타입이 quiz인 경우 exam-service와 연동
        if ("quiz".equals(contentDto.getType())) {
            try {
                // 기존 컨텐츠 정보 조회
                ContentDto existingContent = getContentById(id);
                
                if (existingContent != null) {
                    // URL 필드가 다른 경우(exam ID가 다른 경우)
                    if (!existingContent.getUrl().equals(contentDto.getUrl())) {
                        try {
                            // 새로운 exam ID가 유효한지 확인
                            Long examId = Long.parseLong(contentDto.getUrl());
                            try {
                                examService.getExamById(examId);
                            } catch (Exception e) {
                                // 유효하지 않은 exam ID이면 새로 생성
                                createExamForQuizContent(contentDto);
                            }
                        } catch (NumberFormatException e) {
                            // URL이 숫자가 아니면 새 exam 생성
                            createExamForQuizContent(contentDto);
                        }
                    } else {
                        // URL이 같은 경우, exam 내용 업데이트
                        try {
                            Long examId = Long.parseLong(contentDto.getUrl());
                            updateExamForQuizContent(examId, contentDto);
                        } catch (Exception e) {
                            log.error("Error updating exam: {}", e.getMessage(), e);
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Error integrating with exam service during update: {}", e.getMessage(), e);
            }
        }
        
        HttpEntity<ContentDto> request = new HttpEntity<>(contentDto, headers);
        restTemplate.put(CONTENT_SERVICE_URL + "/" + id, request);
    }

    public void deleteContent(Long id) {
        // 삭제하기 전에 컨텐츠 정보 조회
        try {
            ContentDto content = getContentById(id);
            if (content != null && "quiz".equals(content.getType()) && content.getUrl() != null) {
                try {
                    // URL 필드에 저장된 exam ID로 exam 삭제
                    Long examId = Long.parseLong(content.getUrl());
                    examService.deleteExam(examId);
                } catch (Exception e) {
                    log.error("Error deleting associated exam: {}", e.getMessage(), e);
                }
            }
        } catch (Exception e) {
            log.error("Error fetching content before deletion: {}", e.getMessage(), e);
        }
        
        restTemplate.delete(CONTENT_SERVICE_URL + "/" + id);
    }

    /**
     * 퀴즈 컨텐츠용 새 exam을 생성합니다.
     */
    private void createExamForQuizContent(ContentDto contentDto) {
        ExamDto examDto = new ExamDto();
        examDto.setLectureId(contentDto.getLectureId());
        examDto.setTitle(contentDto.getTitle());
        examDto.setDescription("퀴즈 컨텐츠를 통한 자동 생성 시험");
        
        ExamDto createdExam = examService.createExam(examDto);
        if (createdExam != null && createdExam.getId() != null) {
            // 생성된 exam ID를 컨텐츠의 URL 필드에 저장
            contentDto.setUrl(createdExam.getId().toString());
        }
    }

    /**
     * 퀴즈 컨텐츠용 exam을 업데이트합니다.
     */
    private void updateExamForQuizContent(Long examId, ContentDto contentDto) {
        try {
            ExamDto examDto = examService.getExamById(examId);
            if (examDto != null) {
                // 컨텐츠 정보로 exam 업데이트
                examDto.setTitle(contentDto.getTitle());
                examService.updateExam(examId, examDto);
            }
        } catch (Exception e) {
            log.error("Error updating exam for quiz content: {}", e.getMessage(), e);
        }
    }
} 