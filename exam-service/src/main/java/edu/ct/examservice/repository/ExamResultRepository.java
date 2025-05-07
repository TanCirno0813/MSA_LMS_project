package edu.ct.examservice.repository;

import edu.ct.examservice.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    @Query(value = """
        SELECT * FROM exam_result r
        WHERE r.id IN (
            SELECT MAX(id)
            FROM exam_result
            GROUP BY user_id, exam_id
        )
        """, nativeQuery = true)
    List<ExamResult> findLatestResults();

    List<ExamResult> findByUserId(Long userId);
}
