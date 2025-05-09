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
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecruitmentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://apis.data.go.kr/1051000/recruitment";

    @Value("${api.service.key}")
    private String serviceKey;

    private final RedisTemplate<String, Object> redisTemplate;
    private static final long CACHE_EXPIRATION = 1800; // 30분

    /**
     * 주기적으로 공공 API에서 최신 채용 데이터를 페이지별로 가져와 Redis에 저장
     */
    @Scheduled(fixedRate = 300000) // 30분마다 실행
    public void updateRecruitmentData() {
        log.info("자동 채용 데이터 갱신 시작");
        int pageNo = 1;
        while (true) {
            try {
                List<RecruitmentDto> recruitments = fetchRecruitmentsFromApi(pageNo);
                if (recruitments.isEmpty()) break;
                cacheRecruitments(recruitments, pageNo);
                log.info("페이지 {} 갱신 완료: {}건", pageNo, recruitments.size());
                pageNo++;
            } catch (Exception e) {
                log.error("데이터 갱신 중 오류 발생 (페이지 {}): {}", pageNo, e.getMessage());
                break;
            }
        }
    }

    /**
     * Redis에서 데이터 조회
     */
    @SuppressWarnings("unchecked")
    public List<RecruitmentDto> getRecruitments(int pageNo) {
        String cacheKey = "recruitment_data_" + pageNo;
        List<RecruitmentDto> cachedData = (List<RecruitmentDto>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedData != null && !cachedData.isEmpty()) {
            log.info("Redis에서 페이지 {}의 채용 데이터를 조회했습니다.", pageNo);
            return cachedData;
        }

        log.info("Redis에 데이터가 없으므로 API에서 페이지 {}의 채용 정보를 가져옵니다.", pageNo);
        List<RecruitmentDto> recruitments = fetchRecruitmentsFromApi(pageNo);
        if (!recruitments.isEmpty()) {
            cacheRecruitments(recruitments, pageNo);
        }
        return recruitments;
    }

    /**
     * Redis에 데이터 캐싱
     */
    private void cacheRecruitments(List<RecruitmentDto> recruitments, int pageNo) {
        String cacheKey = "recruitment_data_" + pageNo;
        redisTemplate.opsForValue().set(cacheKey, recruitments, CACHE_EXPIRATION, TimeUnit.SECONDS);
        log.info("Redis에 페이지 {}의 {}건의 채용 데이터를 캐싱했습니다.", pageNo, recruitments.size());
    }

    /**
     * API URI 구성
     */
    private URI buildApiUri(int pageNo) {
        return UriComponentsBuilder.fromHttpUrl(baseUrl + "/list")
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", 5)
                .queryParam("pageNo", pageNo)
                .queryParam("resultType", "json")
                .build(true)
                .toUri();
    }

    /**
     * API 호출 메서드
     */
    private List<RecruitmentDto> fetchRecruitmentsFromApi(int pageNo) {
        try {
            URI uri = buildApiUri(pageNo);
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
                    item.path("detailUrl").asText("N/A")
            ));
        }
        return recruitments;
    }
}
