package edu.ct.admin.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ct.admin.dto.ChatMessageDto;
import edu.ct.admin.dto.Sender;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final int MAX_MESSAGES = 50;

    public List<ChatMessageDto> getRecentMessages(String userId) {
        List<Object> raw = redisTemplate.opsForList().range("chat:" + userId, 0, MAX_MESSAGES - 1);
        return raw == null ? List.of() : raw.stream()
                .map(obj -> {
                    try {
                        String json = (String) obj;
                        return objectMapper.readValue(json, ChatMessageDto.class);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                })
                .filter(msg -> msg != null)
                .collect(Collectors.toList());
    }

    public void saveMessageWithAiResponse(String userId, ChatMessageDto dto) {
        ChatMessageDto userMsg = new ChatMessageDto(UUID.randomUUID().toString(), dto.getMessage(), Sender.USER, LocalDateTime.now());
        pushToRedis(userId, userMsg);

        ChatMessageDto aiMsg = new ChatMessageDto(UUID.randomUUID().toString(), generateAiResponse(dto.getMessage()), Sender.AI, LocalDateTime.now().plusSeconds(1));pushToRedis(userId, aiMsg);
    }

    private void pushToRedis(String userId, ChatMessageDto message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.opsForList().leftPush("chat:" + userId, json);
            redisTemplate.opsForList().trim("chat:" + userId, 0, MAX_MESSAGES - 1);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    private String generateAiResponse(String userInput) {
        if (userInput.contains("강의")) return "최근 인기 강의는 'AI 기초'와 '웹 개발 입문'입니다.";
        if (userInput.contains("수강 신청")) return "수강 신청은 [내 강의실] > [신청하기] 메뉴에서 가능합니다.";
        if (userInput.contains("문의")) return "문의사항은 고객센터 또는 1:1 상담 게시판을 이용해주세요.";
        return "도와드릴 수 있는 것이 있다면 말씀해주세요!";
    }
}
