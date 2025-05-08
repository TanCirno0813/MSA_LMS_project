package edu.ct.recruitment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ct.recruitment.dto.RecruitmentDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecruitmentService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String baseUrl = "https://apis.data.go.kr/1051000/recruitment";

    @Value("${api.service.key}")
    private String serviceKey;

    public List<RecruitmentDto> fetchRecruitments(Integer pageNo, String search, String filter) {
        try {
            List<RecruitmentDto> recruitments;

            // 검색어가 있는 경우: 전체 데이터를 먼저 수집
            if (search != null && !search.isEmpty()) {
                recruitments = fetchAllData();
                recruitments = filterRecruitments(recruitments, search, filter);
                return paginate(recruitments, pageNo);
            }

            // 검색어가 없는 경우: 페이지별로 데이터 호출
            String url = buildApiUrl(pageNo);
            recruitments = fetchDataFromApi(url);
            return filterRecruitments(recruitments, search, filter);

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    // 전체 데이터를 수집하는 메서드 (검색어가 있는 경우 사용)
    private List<RecruitmentDto> fetchAllData() throws Exception {
        List<RecruitmentDto> allRecruitments = new ArrayList<>();
        int page = 1;

        while (true) {
            String url = buildApiUrl(page);
            List<RecruitmentDto> pageData = fetchDataFromApi(url);

            // 더 이상 데이터가 없으면 종료
            if (pageData.isEmpty()) break;

            allRecruitments.addAll(pageData);
            page++;
        }
        return allRecruitments;
    }

    // 페이지네이션 처리
    private List<RecruitmentDto> paginate(List<RecruitmentDto> recruitments, Integer pageNo) {
        int pageSize = 10;  // 페이지당 항목 수
        int startIndex = (pageNo - 1) * pageSize;
        int endIndex = Math.min(startIndex + pageSize, recruitments.size());

        if (startIndex >= recruitments.size()) {
            return Collections.emptyList();
        }

        return recruitments.subList(startIndex, endIndex);
    }

    // 필터링 처리
    private List<RecruitmentDto> filterRecruitments(List<RecruitmentDto> recruitments, String search, String filter) {
        return recruitments.stream()
                .filter(item -> matchesSearch(item, search))
                .filter(item -> matchesFilter(item, filter))
                .collect(Collectors.toList());
    }

    // API URL 빌드 메서드
    private String buildApiUrl(Integer pageNo) {
        if (pageNo == null || pageNo <= 1) {
            return String.format("%s/list?serviceKey=%s&type=json", baseUrl, serviceKey);
        } else {
            return String.format("%s/list?serviceKey=%s&type=json&pageNo=%d", baseUrl, serviceKey, pageNo);
        }
    }

    // API 데이터 호출 메서드
    private List<RecruitmentDto> fetchDataFromApi(String url) throws Exception {
        URI uri = new URI(url);
        String response = restTemplate.getForObject(uri, String.class);
        JsonNode resultArray = new ObjectMapper().readTree(response).path("result");

        List<RecruitmentDto> recruitments = new ArrayList<>();
        for (JsonNode item : resultArray) {
            recruitments.add(parseRecruitment(item));
        }
        return recruitments;
    }

    // 검색 조건에 맞는지 확인
    private boolean matchesSearch(RecruitmentDto item, String search) {
        return search == null || search.isEmpty() || item.getRecrutPbancTtl().contains(search);
    }

    // 필터 조건에 맞는지 확인
    private boolean matchesFilter(RecruitmentDto item, String filter) {
        return filter == null || filter.isEmpty() || item.getRecrutSe().equals(filter);
    }

    // JSON 파싱 메서드
    private RecruitmentDto parseRecruitment(JsonNode item) {
        return new RecruitmentDto(
                item.path("recrutPblntSn").asText("N/A"),
                item.path("recrutPbancTtl").asText("N/A"),
                item.path("instNm").asText("N/A"),
                item.path("recrutSe").asText("N/A"),
                item.path("hireTypeNmLst").asText("N/A"),
                item.path("srcUrl").asText("N/A")
        );
    }
}