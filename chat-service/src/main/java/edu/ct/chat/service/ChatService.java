package edu.ct.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ct.chat.client.LectureClient;
import edu.ct.chat.dto.ChatMessageDto;
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

    private static final int MAX_MESSAGES = 50;
    private static final String REDIS_KEY_PREFIX = "chat:";

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final AiClient aiClient;
    private final LectureRecommendationService lectureRecommendationService;

    /**
     * 최근 메시지 목록 조회
     */
    public List<ChatMessageDto> getRecentMessages(String userId) {
        if (userId == null) return List.of();

        List<String> jsonMessages = redisTemplate.opsForList().range(generateRedisKey(userId), 0, MAX_MESSAGES - 1);
        return jsonMessages.stream()
                .map(this::deserializeMessage)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * AI 응답을 포함한 메시지 저장
     */
    public void saveMessageWithAiResponse(String userId, ChatMessageDto userMessage) {
        if (userId == null || isInvalidMessage(userMessage)) return;

        // 사용자 메시지 저장
        saveMessageToRedis(userId, createMessage(userMessage.getMessage(), Sender.USER));

        // 강의 추천 키워드 추출
        String keyword = extractKeyword(userMessage.getMessage());

        // 강의 추천 목록 가져오기
        List<String> recommendedLectures = lectureRecommendationService.getFilteredLectures(keyword);

        // AI 응답 생성
        String prompt = buildPrompt(userMessage.getMessage(), recommendedLectures);
        String aiResponse = aiClient.ask(prompt);

        // AI 응답 메시지 저장
        saveMessageToRedis(userId, createMessage(aiResponse, Sender.AI));
    }

    /**
     * Redis에 메시지 저장
     */
    private void saveMessageToRedis(String userId, ChatMessageDto message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            String redisKey = generateRedisKey(userId);
            redisTemplate.opsForList().leftPush(redisKey, jsonMessage);
            redisTemplate.opsForList().trim(redisKey, 0, MAX_MESSAGES - 1);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    /**
     * Redis 캐시 키 생성
     */
    private String generateRedisKey(String userId) {
        return REDIS_KEY_PREFIX + userId;
    }

    /**
     * JSON 문자열을 ChatMessageDto로 변환
     */
    private ChatMessageDto deserializeMessage(String json) {
        try {
            return objectMapper.readValue(json, ChatMessageDto.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    /**
     * 키워드 추출
     */
    private String extractKeyword(String message) {
        List<String> keywords = lectureRecommendationService.extractKeywords();
        return keywords.stream()
                .filter(message.toLowerCase()::contains)
                .findFirst()
                .orElse("");
    }

    /**
     * 프롬프트 생성
     */
    private String buildPrompt(String userMessage, List<String> lectures) {
        StringBuilder sb = new StringBuilder("사용자 요청: ").append(userMessage).append("\n추천 강의 목록:\n");
        if (lectures.isEmpty()) {
            sb.append("- 추천할 강의가 없습니다.\n");
        } else {
            lectures.forEach(lecture -> sb.append("- ").append(lecture).append("\n"));
        }
        return sb.toString();
    }

    /**
     * 사용자 메시지 유효성 검사
     */
    private boolean isInvalidMessage(ChatMessageDto message) {
        return message == null || message.getMessage() == null || message.getMessage().trim().isEmpty();
    }

    /**
     * 사용자 메시지 객체 생성
     */
    private ChatMessageDto createMessage(String content, Sender sender) {
        return new ChatMessageDto(UUID.randomUUID().toString(), content, sender, LocalDateTime.now());
    }
}

