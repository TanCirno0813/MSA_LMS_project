package edu.ct.repository;

import edu.ct.entity.LectureLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LectureLikeRepository extends JpaRepository<LectureLike, Long> {
    Optional<LectureLike> findByLectureIdAndUserId(Long lectureId, Long userId);
    long countByLectureId(Long lectureId);
}

