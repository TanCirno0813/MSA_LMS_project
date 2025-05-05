package edu.ct.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private String id;
    private String message;
    private Sender sender;
    private LocalDateTime timestamp;
}
