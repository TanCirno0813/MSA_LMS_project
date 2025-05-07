package edu.ct.chat.service;

import edu.ct.chat.client.LectureClient;
import edu.ct.chat.dto.LectureDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LectureRecommendationService {

    @Autowired
    private LectureClient lectureClient;

    // 강의 목록에서 키워드를 동적으로 추출
    public List<String> extractKeywords() {
        List<LectureDto> lectures = lectureClient.getAllLectures();
        return lectures.stream()
                .map(LectureDto::getTitle)
                .flatMap(title -> List.of(title.split("\\s+")).stream()) // 공백으로 분리
                .distinct()
                .map(String::toLowerCase)
                .collect(Collectors.toList());
    }

    // 키워드에 맞는 강의 목록 필터링
    public List<String> getFilteredLectures(String keyword) {
        List<LectureDto> lectures = lectureClient.getAllLectures();

        // 키워드가 없으면 전체 강의 반환
        if (keyword == null || keyword.isBlank()) {
            return lectures.stream()
                    .map(LectureDto::getTitle)
                    .collect(Collectors.toList());
        }

        // 키워드가 포함된 강의 필터링
        return lectures.stream()
                .filter(lec -> lec.getTitle().toLowerCase().contains(keyword.toLowerCase()))
                .map(LectureDto::getTitle)
                .collect(Collectors.toList());
    }
}

