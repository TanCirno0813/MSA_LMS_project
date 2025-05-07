package edu.ct.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ct.chat.client.ExamClient;
import edu.ct.chat.client.LectureClient;
import edu.ct.chat.dto.ChatMessageDto;
import edu.ct.chat.dto.ExamResultDto;
import edu.ct.chat.dto.LectureDto;
import edu.ct.chat.dto.Sender;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final AiClient aiClient;
    private final PromptBuilder promptBuilder;
    private final LectureClient lectureClient;
    private final ExamClient examClient;

    private static final int MAX_MESSAGES = 50;

    public List<ChatMessageDto> getRecentMessages(String userId) {
        return redisTemplate.opsForList().range(redisKey(userId), 0, MAX_MESSAGES - 1)
                .stream()
                .map(json -> {
                    try {
                        return objectMapper.readValue(json, ChatMessageDto.class);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void saveMessageWithAiResponse(String userId, ChatMessageDto dto) {
        if (isFirstMessage(userId)) {
            pushToRedis(userId, createMessage("무엇을 도와드릴까요?", Sender.AI));
        }

        pushToRedis(userId, createMessage(dto.getMessage(), Sender.USER));

        List<LectureDto> lectures = lectureClient.getLecturesByUser(Long.parseLong(userId));
        List<ExamResultDto> results = examClient.getResultsByUser(Long.parseLong(userId));

        String prompt = promptBuilder.build(dto.getMessage(), lectures, results);
        String aiReply = aiClient.ask(prompt);
        pushToRedis(userId, createMessage(aiReply, Sender.AI));
    }

    private boolean isFirstMessage(String userId) {
        Long size = redisTemplate.opsForList().size(redisKey(userId));
        return size == null || size == 0;
    }

    private void pushToRedis(String userId, ChatMessageDto message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.opsForList().leftPush(redisKey(userId), json);
            redisTemplate.opsForList().trim(redisKey(userId), 0, MAX_MESSAGES - 1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private ChatMessageDto createMessage(String content, Sender sender) {
        return new ChatMessageDto(UUID.randomUUID().toString(), content, sender, LocalDateTime.now());
    }

    private String redisKey(String userId) {
        return "chat:" + userId;
    }
}
