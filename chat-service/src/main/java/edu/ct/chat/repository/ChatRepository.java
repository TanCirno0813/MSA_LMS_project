package edu.ct.chat.repository;

import edu.ct.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop50ByUserIdOrderByTimestampDesc(String userId);
}
