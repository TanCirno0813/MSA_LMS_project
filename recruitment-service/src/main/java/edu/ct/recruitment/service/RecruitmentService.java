package edu.ct.recruitment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ct.recruitment.dto.RecruitmentDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecruitmentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://apis.data.go.kr/1051000/recruitment";
    private static final int PAGE_SIZE = 5;
    private static final int TOTAL_ITEMS = 100;
    private static final int MAX_PAGE = 20;  // 최대 페이지 수 제한

    @Value("${api.service.key}")
    private String serviceKey;

    private final RedisTemplate<String, Object> redisTemplate;
    private static final long CACHE_EXPIRATION = 1800; // 30분

    /**
     * 주기적으로 공공 API에서 최신 채용 데이터를 가져와 Redis에 저장
     */
    @Scheduled(fixedRate = 300000) // 30분마다 실행
    public void updateRecruitmentData() {
        log.info("자동 채용 데이터 갱신 시작");
        try {
            List<RecruitmentDto> allRecruitments = fetchRecruitmentsFromApi();
            if (!allRecruitments.isEmpty()) {
                cacheAllRecruitments(allRecruitments);
                log.info("총 {}건의 채용 데이터를 갱신했습니다.", allRecruitments.size());
            }
        } catch (Exception e) {
            log.error("데이터 갱신 중 오류 발생: {}", e.getMessage());
        }
    }

    /**
     * Redis에서 페이지네이션된 데이터 조회
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getRecruitments(int pageNo, String searchKeyword) {
        // 페이지 번호 유효성 검사
        if (pageNo < 1) {
            log.warn("유효하지 않은 페이지 번호: {}", pageNo);
            Map<String, Object> result = new HashMap<>();
            result.put("items", Collections.emptyList());
            result.put("totalItems", 0);
            return result;
        }

        String cacheKey = "recruitment_data_all";
        List<RecruitmentDto> allRecruitments = (List<RecruitmentDto>) redisTemplate.opsForValue().get(cacheKey);
        
        if (allRecruitments == null || allRecruitments.isEmpty()) {
            log.info("Redis에 데이터가 없으므로 API에서 채용 정보를 가져옵니다.");
            allRecruitments = fetchRecruitmentsFromApi();
            if (!allRecruitments.isEmpty()) {
                cacheAllRecruitments(allRecruitments);
            }
        }

        // 검색어가 있는 경우 필터링
        if (searchKeyword != null && !searchKeyword.trim().isEmpty()) {
            String keyword = searchKeyword.toLowerCase().trim();
            allRecruitments = allRecruitments.stream()
                .filter(recruitment -> 
                    recruitment.getRecrutPbancTtl().toLowerCase().contains(keyword))
                .collect(Collectors.toList());
        }

        int totalItems = allRecruitments.size();
        int maxPage = (int) Math.ceil((double) totalItems / PAGE_SIZE);

        // 페이지 번호가 최대 페이지를 초과하는 경우
        if (pageNo > maxPage) {
            Map<String, Object> result = new HashMap<>();
            result.put("items", Collections.emptyList());
            result.put("totalItems", totalItems);
            return result;
        }

        // 페이지네이션 처리
        int startIndex = (pageNo - 1) * PAGE_SIZE;
        int endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
        
        List<RecruitmentDto> pageItems = allRecruitments.subList(startIndex, endIndex);
        
        Map<String, Object> result = new HashMap<>();
        result.put("items", pageItems);
        result.put("totalItems", totalItems);
        return result;
    }

    /**
     * Redis에 전체 데이터 캐싱
     */
    private void cacheAllRecruitments(List<RecruitmentDto> recruitments) {
        String cacheKey = "recruitment_data_all";
        redisTemplate.opsForValue().set(cacheKey, recruitments, CACHE_EXPIRATION, TimeUnit.SECONDS);
        log.info("Redis에 총 {}건의 채용 데이터를 캐싱했습니다.", recruitments.size());
    }

    /**
     * API URI 구성
     */
    private URI buildApiUri() {
        return UriComponentsBuilder.fromHttpUrl(baseUrl + "/list")
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", TOTAL_ITEMS)
                .queryParam("pageNo", 1)
                .queryParam("resultType", "json")
                .build(true)
                .toUri();
    }

    /**
     * API 호출 메서드
     */
    private List<RecruitmentDto> fetchRecruitmentsFromApi() {
        try {
            URI uri = buildApiUri();
            String response = restTemplate.getForObject(uri, String.class);
            if (response == null || response.isEmpty()) {
                log.warn("API 응답이 비어있습니다.");
                return Collections.emptyList();
            }
            return parseRecruitmentResponse(response);
        } catch (Exception e) {
            log.error("API 호출 중 오류 발생", e);
            return Collections.emptyList();
        }
    }

    /**
     * API 응답 파싱 메서드
     */
    private List<RecruitmentDto> parseRecruitmentResponse(String response) throws Exception {
        JsonNode root = new ObjectMapper().readTree(response);
        JsonNode resultArray = root.path("result");
        if (resultArray.isMissingNode()) {
            return Collections.emptyList();
        }

        List<RecruitmentDto> recruitments = new ArrayList<>();
        for (JsonNode item : resultArray) {
            recruitments.add(new RecruitmentDto(
                    item.path("recrutPblntSn").asText("N/A"),
                    item.path("recrutPbancTtl").asText("N/A"),
                    item.path("instNm").asText("N/A"),
                    item.path("recrutSe").asText("N/A"),
                    item.path("hireTypeLst").asText("N/A"),
                    item.path("srcUrl").asText("N/A")
            ));
        }
        return recruitments;
    }
}
