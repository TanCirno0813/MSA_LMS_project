package edu.ct.repository;

import edu.ct.entity.Enrollment;
import edu.ct.entity.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByLectureIdAndUserIdAndStatus(Long lectureId, String userId, EnrollmentStatus status);
}