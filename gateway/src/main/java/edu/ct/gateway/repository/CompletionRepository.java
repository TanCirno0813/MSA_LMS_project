package edu.ct.gateway.repository;

import edu.ct.gateway.entity.CompletionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompletionRepository extends JpaRepository<CompletionHistory, Long> {
    List<CompletionHistory> findByUserId(Long userId);
    
    Optional<CompletionHistory> findByUserIdAndLectureIdAndContentTitle(Long userId, Long lectureId, String contentTitle);
}

