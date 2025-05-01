package edu.ct.service;

import edu.ct.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import edu.ct.entity.Lecture;

@Service
@RequiredArgsConstructor
public class LectureService {

    private final LectureRepository lectureRepository;

    public String getTitleById(Long lectureId) {
        return lectureRepository.findById(lectureId)
                .map(Lecture::getTitle)
                .orElseThrow(() -> new IllegalArgumentException("Lecture not found: " + lectureId));
    }
}