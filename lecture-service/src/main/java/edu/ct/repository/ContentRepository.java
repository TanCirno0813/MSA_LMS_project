package edu.ct.repository;

import edu.ct.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {
    int countByLectureId(Long lectureId);
    List<Content> findByLectureId(Long lectureId);
}