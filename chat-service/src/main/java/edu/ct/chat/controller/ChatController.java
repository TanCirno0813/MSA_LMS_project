package edu.ct.chat.controller;

import edu.ct.chat.dto.ChatMessageDto;
import edu.ct.chat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;
    public ChatController(ChatService chatservice){
        this.chatService = chatservice;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@PathVariable String userId) {
        return ResponseEntity.ok(chatService.getRecentMessages(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Void> sendMessage(@PathVariable String userId, @RequestBody ChatMessageDto dto) {
        if (dto.getMessage() == null || dto.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (dto.getId() == null) dto.setId(UUID.randomUUID().toString());
        if (dto.getTimestamp() == null) dto.setTimestamp(LocalDateTime.now());

        chatService.saveMessageWithAiResponse(userId, dto);
        return ResponseEntity.ok().build();
    }
}
