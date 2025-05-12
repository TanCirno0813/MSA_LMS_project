package edu.ct.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private String id;
    private String message;
    private Sender sender;
    private LocalDateTime timestamp;

    public ChatMessageDto(String message, Sender sender) {
        this.id = UUID.randomUUID().toString();
        this.message = message;
        this.sender = sender;
        this.timestamp = LocalDateTime.now();
    }
}

