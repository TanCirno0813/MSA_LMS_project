package edu.ct.chat.service;

import edu.ct.chat.client.LectureClient;
import edu.ct.chat.dto.LectureDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LectureRecommendationService {

    private final LectureClient lectureClient;

    public List<String> getAllLectureTitles() {
        return lectureClient.getAllLectures().stream()
                .map(LectureDto::getTitle)
                .filter(title -> title != null && !title.trim().isEmpty())
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return lectureClient.getAllLectures().stream()
                .map(LectureDto::getCategory)
                .filter(category -> category != null && !category.trim().isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }
}

