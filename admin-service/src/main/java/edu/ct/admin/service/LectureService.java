package edu.ct.admin.service;

import edu.ct.admin.dto.LectureDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LectureService {

    private final RestTemplate restTemplate;
    private static final String LECTURE_SERVICE_URL = "http://lecture-service/api/lectures";

    public Map<String, Object> getAllLectures(int page, int limit, String category, String keyword) {
        String url = LECTURE_SERVICE_URL + "?page=" + page + "&limit=" + limit;
        
        if (category != null && !category.isEmpty()) {
            url += "&category=" + category;
        }
        
        if (keyword != null && !keyword.isEmpty()) {
            url += "&keyword=" + keyword;
        }
        
        return restTemplate.getForObject(url, Map.class);
    }
    
    public List<LectureDto> getAllLecturesWithoutPagination() {
        try {
            log.info("Requesting lectures from: " + LECTURE_SERVICE_URL + "?simple=true");

            // 응답 타입을 String 대신 Object로 변경
            ResponseEntity<Object> response = restTemplate.exchange(
                LECTURE_SERVICE_URL + "?simple=true", 
                HttpMethod.GET,
                null,
                Object.class
            );
            
            log.info("Response status: " + response.getStatusCode());
            
            // 응답 본문이 있는지 확인
            Object responseBody = response.getBody();
            if (responseBody == null) {
                log.warn("Empty response body received");
                return new ArrayList<>();
            }
            
            log.info("Response type: " + responseBody.getClass().getName());
            
            // 응답이 이미 List 형태인 경우 (배열)
            if (responseBody instanceof List) {
                List<?> responseList = (List<?>) responseBody;
                log.info("Received list response with " + responseList.size() + " items");
                
                ObjectMapper mapper = new ObjectMapper();
                List<LectureDto> result = new ArrayList<>();
                
                for (Object item : responseList) {
                    if (item instanceof Map) {
                        try {
                            result.add(mapper.convertValue(item, LectureDto.class));
                        } catch (Exception e) {
                            log.warn("Failed to convert map item to LectureDto: " + e.getMessage());
                        }
                    }
                }
                
                return result;
            } 
            // 응답이 Map 형태인 경우 (JSON 객체)
            else if (responseBody instanceof Map) {
                Map<?, ?> responseMap = (Map<?, ?>) responseBody;
                log.info("Received map response with keys: " + responseMap.keySet());
                
                if (responseMap.containsKey("lectures") && responseMap.get("lectures") instanceof List) {
                    List<?> lecturesList = (List<?>) responseMap.get("lectures");
                    ObjectMapper mapper = new ObjectMapper();
                    List<LectureDto> result = new ArrayList<>();
                    
                    for (Object item : lecturesList) {
                        if (item instanceof Map) {
                            try {
                                result.add(mapper.convertValue(item, LectureDto.class));
                            } catch (Exception e) {
                                log.warn("Failed to convert map item to LectureDto: " + e.getMessage());
                            }
                        }
                    }
                    
                    return result;
                }
            }
            
            log.warn("Unrecognized response format: " + responseBody);
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Error fetching lectures: " + e.getMessage(), e);
            throw e;
        }
    }

    public LectureDto getLectureById(Long id) {
        return restTemplate.getForObject(LECTURE_SERVICE_URL + "/" + id, LectureDto.class);
    }

    public LectureDto createLecture(LectureDto lectureDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // ID 값을 null로 설정하여 데이터베이스에서 자동 생성되도록 함
        lectureDto.setId(null);
        
        HttpEntity<LectureDto> request = new HttpEntity<>(lectureDto, headers);
        
        return restTemplate.postForObject(LECTURE_SERVICE_URL, request, LectureDto.class);
    }

    public void updateLecture(Long id, LectureDto lectureDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<LectureDto> request = new HttpEntity<>(lectureDto, headers);
        
        restTemplate.put(LECTURE_SERVICE_URL + "/" + id, request);
    }

    public void deleteLecture(Long id) {
        restTemplate.delete(LECTURE_SERVICE_URL + "/" + id);
    }
} 