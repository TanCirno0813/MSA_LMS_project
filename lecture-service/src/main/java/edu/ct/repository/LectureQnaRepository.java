package edu.ct.repository;

import edu.ct.entity.LectureQna;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureQnaRepository extends JpaRepository<LectureQna, Long> {
    List<LectureQna> findByLectureIdOrderByCreatedAtDesc(Long lectureId);
}