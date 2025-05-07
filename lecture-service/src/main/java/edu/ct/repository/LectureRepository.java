package edu.ct.repository;


import edu.ct.entity.Lecture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    Page<Lecture> findByCategoryAndTitleContainingIgnoreCase(String category, String keyword, Pageable pageable);

    Page<Lecture> findByCategory(String category, Pageable pageable);

    Page<Lecture> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
}

