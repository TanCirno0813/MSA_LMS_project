package edu.ct.examservice.repository;

import edu.ct.examservice.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
}
