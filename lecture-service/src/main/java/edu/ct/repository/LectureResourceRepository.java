package edu.ct.repository;

import edu.ct.entity.LectureResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureResourceRepository extends JpaRepository<LectureResource, Long> {
    List<LectureResource> findByLectureIdOrderByUploadedAtDesc(Long lectureId);
}