package edu.ct.repository;

import edu.ct.entity.LectureNotice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureNoticeRepository extends JpaRepository<LectureNotice, Long> {
    List<LectureNotice> findByLectureIdOrderByCreatedAtDesc(Long lectureId);
}