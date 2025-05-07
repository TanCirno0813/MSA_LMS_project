package edu.ct.chat.service;

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

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final AiClient aiClient;
    private final PromptBuilder promptBuilder;
    private final LectureClient lectureClient;
    private final LectureRecommendationService lectureRecommendationService;

    private static final int MAX_MESSAGES = 50;

    public List<ChatMessageDto> getRecentMessages(String userId) {
        if (userId == null) return List.of(); // 사용자 ID 없으면 메시지 없음
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
        if (userId != null && isFirstMessage(userId)) {
            pushToRedis(userId, createMessage("무엇을 도와드릴까요?", Sender.AI));
        }

        if (userId != null) {
            pushToRedis(userId, createMessage(dto.getMessage(), Sender.USER));
        }

        // 🔍 강의 키워드 추출
        String keyword = extractKeywordFromMessage(dto.getMessage());

        // 🔍 강의 목록 필터링 (LectureRecommendationService 사용)
        List<String> filteredLectures = lectureRecommendationService.getFilteredLectures(keyword);

        // 필터링 결과가 없으면 전체 목록 추천
        if (filteredLectures.isEmpty()) {
            filteredLectures = lectureRecommendationService.getFilteredLectures(null);
        }

        // 🔍 필터링된 강의 목록으로 프롬프트 생성
        String prompt = buildPrompt(dto.getMessage(), filteredLectures);
        String aiReply = aiClient.ask(prompt);

        // 사이트 소개 요청 우선 처리
        if (promptBuilder.isSiteIntroductionRequest(dto.getMessage())) {
            aiReply = "이 사이트는 다양한 강의를 추천하고 수강할 수 있는 학습 플랫폼입니다.\n" +
                    "주요 기능:\n" +
                    "- 강의 추천\n" +
                    "- 강의 검색\n" +
                    "- 강의 상세 보기\n" +
                    "다양한 주제의 강의를 제공하여 학습과 성장을 지원합니다.";
        }

        if (userId != null) {
            pushToRedis(userId, createMessage(aiReply, Sender.AI));
        }
    }

    // 💡 사용자 입력에서 DB 기반으로 키워드 추출
    private String extractKeywordFromMessage(String message) {
        String lowerMessage = message.toLowerCase();
        List<String> keywords = lectureRecommendationService.extractKeywords();

        for (String keyword : keywords) {
            if (lowerMessage.contains(keyword)) {
                return keyword;
            }
        }
        return ""; // 기본값으로 빈 키워드
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

    // 💡 강의 목록을 프롬프트로 변환
    private String buildPrompt(String message, List<String> lectures) {
        StringBuilder sb = new StringBuilder("아래는 추천할 수 있는 강의 목록입니다:\n");
        for (String lecture : lectures) {
            sb.append("- ").append(lecture).append("\n");
        }
        sb.append("위 강의 목록 중에서 추천해줘.");
        return sb.toString();
    }
}
