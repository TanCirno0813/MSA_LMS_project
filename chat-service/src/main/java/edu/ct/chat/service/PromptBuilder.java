package edu.ct.chat.service;

import org.springframework.stereotype.Component;
import edu.ct.chat.dto.LectureDto;

import java.util.List;

import java.util.Collections;
import java.util.stream.Collectors;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PromptBuilder {

    public String build(String userMessage, List<LectureDto> lectures) {
        StringBuilder sb = new StringBuilder();

        // 사이트 소개 요청 처리
        if (isSiteIntroductionRequest(userMessage)) {
            return buildSiteIntroduction();
        }

        // 임의 추천 요청 처리
        if (isRandomRecommendationRequest(userMessage)) {
            return buildRandomRecommendation(lectures);
        }

        // 강의 추천 요청 처리
        if (isRecommendationRequest(userMessage)) {
            return buildKeywordRecommendation(userMessage, lectures);
        }

        // 기본 처리
        sb.append("사용자 질문: ").append(userMessage).append("\n");
        sb.append("해당 질문에 대한 명확한 답변을 찾지 못했습니다. 강의 추천이나 사이트 소개를 요청해보세요.");
        return sb.toString();
    }

    // 💡 사이트 소개 빌드 메서드
    private String buildSiteIntroduction() {
        return """
               이 사이트는 다양한 강의를 추천하고 수강할 수 있는 학습 플랫폼입니다.
               주요 기능:
               - 강의 추천
               - 강의 검색
               - 강의 상세 보기
               다양한 주제의 강의를 제공하여 학습과 성장을 지원합니다.
               """;
    }

    // 💡 임의 추천 빌드 메서드
    private String buildRandomRecommendation(List<LectureDto> lectures) {
        List<LectureDto> randomLectures = getRandomLectures(lectures, 3);
        StringBuilder sb = new StringBuilder("아래는 임의로 추천하는 강의 목록입니다:\n");
        for (LectureDto lec : randomLectures) {
            sb.append("- ").append(lec.getTitle()).append("\n");
        }
        return sb.toString();
    }

    // 💡 키워드 기반 강의 추천 빌드 메서드
    private String buildKeywordRecommendation(String userMessage, List<LectureDto> lectures) {
        StringBuilder sb = new StringBuilder("추천할 수 있는 강의 목록입니다:\n");
        List<LectureDto> filteredLectures = filterLecturesByKeyword(userMessage, lectures);

        if (filteredLectures.isEmpty()) {
            sb.append("- 추천할 수 있는 강의가 없습니다. 아래는 전체 강의 목록입니다:\n");
            for (LectureDto lec : lectures) {
                sb.append("- ").append(lec.getTitle()).append("\n");
            }
        } else {
            for (LectureDto lec : filteredLectures) {
                sb.append("- ").append(lec.getTitle()).append("\n");
            }
        }
        return sb.toString();
    }

    // 💡 임의의 강의 목록 추출
    private List<LectureDto> getRandomLectures(List<LectureDto> lectures, int count) {
        Collections.shuffle(lectures);
        return lectures.stream().limit(count).collect(Collectors.toList());
    }

    // 💡 키워드 기반 강의 필터링 메서드
    private List<LectureDto> filterLecturesByKeyword(String userMessage, List<LectureDto> lectures) {
        String[] keywords = extractKeywords(userMessage);
        return lectures.stream()
                .filter(lec -> containsAnyKeyword(lec.getTitle().toLowerCase(), keywords))
                .collect(Collectors.toList());
    }

    // 💡 사용자 입력에서 키워드 추출
    private String[] extractKeywords(String userMessage) {
        return userMessage.toLowerCase().split("\\s+");
    }

    // 💡 강의 제목에 키워드가 포함되어 있는지 확인
    private boolean containsAnyKeyword(String lectureTitle, String[] keywords) {
        for (String keyword : keywords) {
            if (lectureTitle.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    boolean isSiteIntroductionRequest(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();
        return lowerMessage.contains("사이트 소개") || lowerMessage.contains("소개해줘") || lowerMessage.contains("사이트 안내");
    }

    private boolean isRandomRecommendationRequest(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();
        return lowerMessage.contains("임의로") || lowerMessage.contains("아무거나")
                || lowerMessage.contains("주제는 모르겠고") || lowerMessage.contains("아무 강의");
    }

    private boolean isRecommendationRequest(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();
        return lowerMessage.contains("추천") || lowerMessage.contains("강의 추천") || lowerMessage.contains("추천 강의");
    }
}







