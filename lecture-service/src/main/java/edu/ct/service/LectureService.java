package edu.ct.service;

import edu.ct.dto.LectureDto;
import edu.ct.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import edu.ct.entity.Lecture;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LectureService {

    private final LectureRepository lectureRepository;

    public String getTitleById(Long lectureId) {
        return lectureRepository.findById(lectureId)
                .map(Lecture::getTitle)
                .orElseThrow(() -> new IllegalArgumentException("Lecture not found: " + lectureId));
    }

    public List<LectureDto> getLecturesByUser(Long userId) {
        List<Lecture> all = lectureRepository.findAll();
        return all.stream()
                .map(lec -> new LectureDto(lec.getId(), lec.getTitle()))
                .collect(Collectors.toList());
    }


}