package edu.ct.examservice.scheduler;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ExamResultCleanupScheduler {

    @PersistenceContext
    private final EntityManager entityManager;

    @Scheduled(cron = "0 0 3 * * *") // 매일 새벽 3시
    @Transactional
    public void deleteOldExamResults() {
        String deleteQuery = """
            DELETE FROM exam_result
            WHERE id NOT IN (
                SELECT max_id FROM (
                    SELECT MAX(id) AS max_id
                    FROM exam_result
                    GROUP BY user_id, exam_id
                ) latest
            )
        """;

        entityManager.createNativeQuery(deleteQuery).executeUpdate();
    }
}
