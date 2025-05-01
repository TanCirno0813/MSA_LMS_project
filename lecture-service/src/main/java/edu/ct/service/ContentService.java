package edu.ct.service;

import edu.ct.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentRepository contentRepository;

    public int countByLectureId(Long lectureId) {
        return contentRepository.countByLectureId(lectureId);
    }
}