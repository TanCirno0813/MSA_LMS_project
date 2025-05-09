package edu.ct.chat.service;

import edu.ct.chat.dto.LectureDto;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ResponseFilter {

    public boolean isValidRecommendation(String aiResponse, List<LectureDto> lectures) {
        List<String> lectureTitles = lectures.stream()
                .map(lec -> lec.getTitle().toLowerCase())
                .collect(Collectors.toList());

        return Arrays.stream(aiResponse.split("\n"))
                .filter(line -> line.startsWith("- "))
                .map(line -> line.substring(2).trim().toLowerCase())
                .allMatch(lectureTitles::contains);
    }
}

