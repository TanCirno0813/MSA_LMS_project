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

    public String buildRecommendationResponse(List<String> lectures) {
        if (lectures.isEmpty()) {
            return "추천할 수 있는 강의가 없습니다.";
        }
        return "추천 강의 목록:\n" + lectures.stream()
                .map(title -> "- " + title)
                .collect(Collectors.joining("\n"));
    }
}








