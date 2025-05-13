package edu.ct.chat.service;

import edu.ct.chat.client.LectureClient;
import edu.ct.chat.dto.LectureDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LectureRecommendationService {

    @Autowired
    private LectureClient lectureClient;

    public List<String> extractKeywords() {
        return lectureClient.getAllLectures().stream()
                .map(LectureDto::getTitle)
                .flatMap(title -> Arrays.stream(title.toLowerCase().split("\\s+")))
                .distinct()
                .collect(Collectors.toList());
    }

    // 모든 강의 목록 가져오기
    public List<String> getAllLectureTitles() {
        return lectureClient.getAllLectures().stream()
                .map(LectureDto::getTitle)
                .collect(Collectors.toList());
    }
}

