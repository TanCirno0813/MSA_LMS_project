package edu.ct.repository;

import edu.ct.entity.LectureNotice;
import edu.ct.entity.LectureReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureReviewRepository extends JpaRepository<LectureReview, Long> {
    List<LectureReview> findByLectureIdOrderByCreatedAtDesc(Long lectureId);
}