package edu.ct.admin.repository;

import edu.ct.admin.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop50ByUserIdOrderByTimestampDesc(String userId);
}
