package edu.ct.chat.controller;

import edu.ct.chat.dto.ChatMessageDto;
import edu.ct.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@PathVariable String userId) {
        List<ChatMessageDto> messages = chatService.getRecentMessages(userId);
        if (messages.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Void> sendMessage(@PathVariable String userId, @RequestBody ChatMessageDto dto) {
        if (isInvalidMessage(dto)) {
            return ResponseEntity.badRequest().build();
        }

        chatService.saveMessageWithAiResponse(userId, dto);
        return ResponseEntity.ok().build();
    }

    private boolean isInvalidMessage(ChatMessageDto dto) {
        return dto == null || dto.getMessage() == null || dto.getMessage().trim().isEmpty();
    }
}

