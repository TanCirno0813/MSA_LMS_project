package edu.ct.chat.service;

import edu.ct.chat.dto.LectureDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ResponseFilter {

    // 잘못된 추천 여부 확인 메서드
    private boolean hasInvalidRecommendation(String aiResponse, List<String> lectureTitles) {
        for (String line : aiResponse.split("\n")) {
            if (line.startsWith("- ")) {
                String recommendedTitle = line.substring(2).trim().toLowerCase();
                if (!lectureTitles.contains(recommendedTitle)) {
                    return true;  // 잘못된 추천이 있음
                }
            }
        }
        return false;
    }

    // 올바른 추천 여부 확인 메서드
    public boolean isValidRecommendation(String aiResponse, List<LectureDto> lectures) {
        List<String> lectureTitles = lectures.stream()
                .map(lec -> lec.getTitle().toLowerCase())
                .toList();
        return !hasInvalidRecommendation(aiResponse, lectureTitles);
    }

    // 올바르지 않을 경우 기본 메시지 제공
    public String generateFallbackResponse(List<LectureDto> lectures) {
        StringBuilder sb = new StringBuilder();
        sb.append("추천 강의 목록입니다:\n");
        for (LectureDto lec : lectures) {
            sb.append("- ").append(lec.getTitle()).append("\n");
        }
        return sb.toString();
    }
}

