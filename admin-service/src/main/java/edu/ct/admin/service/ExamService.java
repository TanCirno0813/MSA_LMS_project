package edu.ct.admin.service;

import edu.ct.admin.dto.ExamDto;
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
public class ExamService {

    private final RestTemplate restTemplate;
    private static final String EXAM_SERVICE_URL = "http://exam-service/api/exams";

    /**
     * 강의 ID에 해당하는 모든 시험을 조회합니다.
     */
    public List<ExamDto> getExamsByLectureId(Long lectureId) {
        try {
            log.info("Requesting exams for lecture ID: {}", lectureId);
            ResponseEntity<List<ExamDto>> response = restTemplate.exchange(
                EXAM_SERVICE_URL + "/lecture/" + lectureId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ExamDto>>() {}
            );
            
            log.info("Response status: {}", response.getStatusCode());
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            log.error("Error fetching exams for lecture ID {}: {}", lectureId, e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * 특정 ID의 시험을 조회합니다.
     */
    public ExamDto getExamById(Long id) {
        try {
            log.info("시험 정보 요청 - ID: {}", id);
            ResponseEntity<ExamDto> response = restTemplate.getForEntity(EXAM_SERVICE_URL + "/" + id, ExamDto.class);
            log.info("시험 정보 응답 - ID: {}, 상태 코드: {}", id, response.getStatusCode());
            
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("시험 정보 응답 오류 - ID: {}, 상태 코드: {}", id, response.getStatusCode());
                throw new RuntimeException("시험 정보를 가져오는데 실패했습니다. 상태 코드: " + response.getStatusCode());
            }
            
            return response.getBody();
        } catch (Exception e) {
            log.error("시험 정보 조회 실패 - ID: {}, 오류: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 새로운 시험을 생성합니다.
     */
    public ExamDto createExam(ExamDto examDto) {
        try {
            log.info("Creating new exam: {}", examDto.getTitle());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<ExamDto> request = new HttpEntity<>(examDto, headers);
            
            Long examId = restTemplate.postForObject(EXAM_SERVICE_URL, request, Long.class);
            if (examId != null) {
                // 생성된 시험의 ID를 가져와서 완전한 객체를 반환
                examDto.setId(examId);
                return examDto;
            }
            return null;
        } catch (Exception e) {
            log.error("Error creating exam: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 기존 시험을 수정합니다.
     */
    public void updateExam(Long id, ExamDto examDto) {
        try {
            log.info("시험 업데이트 시작 - ID: {}, 제목: {}, JSON 데이터 크기: {}", 
                id, examDto.getTitle(), 
                examDto.getQuestion() != null ? examDto.getQuestion().length() : 0);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<ExamDto> request = new HttpEntity<>(examDto, headers);
            
            ResponseEntity<Void> response = restTemplate.exchange(
                EXAM_SERVICE_URL + "/" + id,
                HttpMethod.PUT,
                request,
                Void.class
            );
            
            log.info("시험 업데이트 응답 - ID: {}, 상태 코드: {}", id, response.getStatusCode());
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("시험 업데이트 실패. 상태 코드: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("시험 업데이트 실패 - ID: {}, 오류: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 시험을 삭제합니다.
     */
    public void deleteExam(Long id) {
        try {
            log.info("Deleting exam with ID: {}", id);
            restTemplate.delete(EXAM_SERVICE_URL + "/" + id);
        } catch (Exception e) {
            log.error("Error deleting exam with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }
} 