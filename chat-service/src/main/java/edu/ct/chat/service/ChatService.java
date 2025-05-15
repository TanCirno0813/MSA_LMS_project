package edu.ct.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ct.chat.dto.ChatMessageDto;
import edu.ct.chat.dto.Sender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private static final int MAX_MESSAGES = 50;
    private static final String REDIS_KEY_PREFIX = "chat:";

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final AiClient aiClient;
    private final LectureRecommendationService lectureRecommendationService;

    public List<ChatMessageDto> getRecentMessages(String userId) {
        if (userId == null) return List.of();

        String redisKey = generateRedisKey(userId);
        List<String> jsonMessages = redisTemplate.opsForList().range(redisKey, 0, MAX_MESSAGES - 1);
        
        // 채팅 기록이 없는 경우 AI 인사 메시지 추가
        if (jsonMessages == null || jsonMessages.isEmpty()) {
            String welcomeMessage = "안녕하세요! 저는 LMS 교육 추천 봇입니다. 관심 있는 강의를 추천해드릴 수 있어요. 어떤 분야에 관심이 있으신가요?";
            saveMessageToRedis(userId, createMessage(welcomeMessage, Sender.AI));
            return List.of(createMessage(welcomeMessage, Sender.AI));
        }

        return jsonMessages.stream()
                .map(this::deserializeMessage)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void saveMessageWithAiResponse(String userId, ChatMessageDto userMessage) {
        if (userId == null || isInvalidMessage(userMessage)) return;

        // 사용자 메시지 저장
        saveMessageToRedis(userId, createMessage(userMessage.getMessage(), Sender.USER));

        // AI 응답 생성
        String systemPrompt = buildDynamicPrompt(userMessage.getMessage());
        String aiResponse = aiClient.ask(userMessage.getMessage(), systemPrompt);

        // AI 응답 메시지 저장
        saveMessageToRedis(userId, createMessage(aiResponse, Sender.AI));
    }

    public String buildDynamicPrompt(String userMessage) {
        StringBuilder sb = new StringBuilder();
        
        // 1. 기본 소개
        sb.append("당신은 LMS 사이트의 교육 추천 봇입니다. 다음 규칙을 엄격히 따르세요:\n\n");

        // 2. 기본 응답 규칙
        appendBasicRules(sb);
        
        // 3. 카테고리 정보
        appendCategoryInfo(sb);
        
        // 4. 강의 목록
        appendLectureList(sb);
        
        // 5. 상세 규칙
        appendDetailedRules(sb);

        return sb.toString();
    }

    private void appendBasicRules(StringBuilder sb) {
        sb.append("1. 기본 응답 규칙:\n");
        sb.append("- 사이트 소개 관련 질문: 사이트의 목적과 기능만 설명하고, 강의 추천은 하지 않습니다.\n");
        sb.append("- 봇에 대한 질문: 교육 추천 봇이라는 점을 간단히 소개합니다.\n");
        sb.append("- 일반 대화: 자연스럽게 대화를 이어갑니다.\n");
        sb.append("- 강의 추천 요청: 먼저 카테고리 목록을 보여주고, 사용자가 선택한 카테고리의 강의를 추천합니다.\n\n");
    }

    private void appendCategoryInfo(StringBuilder sb) {
        List<String> categories = lectureRecommendationService.getAllCategories();
        if (!categories.isEmpty()) {
            sb.append("2. 강의 카테고리:\n");
            categories.forEach(category -> sb.append("- ").append(category).append("\n"));
            sb.append("\n");
        }
    }

    private void appendLectureList(StringBuilder sb) {
        sb.append("3. 추천 가능한 강의 목록:\n");
        List<String> lectures = lectureRecommendationService.getAllLectureTitles();
        if (lectures.isEmpty()) {
            sb.append("- 현재 추천 가능한 강의가 없습니다.\n");
        } else {
            lectures.forEach(lecture -> sb.append("- ").append(lecture).append("\n"));
        }
        sb.append("\n");
    }

    private void appendDetailedRules(StringBuilder sb) {
        sb.append("4. 상세 규칙:\n");
        
        // 카테고리 선택 관련 규칙
        sb.append("A. 카테고리 선택 규칙:\n");
        sb.append("- 강의 추천 요청 시: '다음 카테고리 중 관심 있는 분야를 선택해주세요:'라고 말하고 카테고리 목록을 보여주세요.\n");
        sb.append("- 카테고리 선택 인식:\n");
        sb.append("  1. 숫자로 선택 (예: '1', '2번'): 해당 번호의 카테고리를 인식하고 바로 강의를 추천하세요.\n");
        sb.append("  2. 카테고리명으로 선택: 띄어쓰기나 철자가 다르더라도 유사한 의미라면 인식하세요.\n");
        sb.append("     예시:\n");
        sb.append("     - '공통필수' = '공통 필수'\n");
        sb.append("     - '신입' = '신입사원'\n");
        sb.append("     - '사무기획' = '사무 기획'\n");
        sb.append("     - '리더십' = '리더십/관리자'\n");
        sb.append("     - '자기개발' = '자기 개발'\n");
        sb.append("     - '디지털' = '디지털 시대'\n");
        sb.append("  3. 번호와 이름 함께 선택 (예: '1. 공통 필수'): 해당 카테고리를 인식하고 바로 강의를 추천하세요.\n");
        sb.append("- 선택 후 응답 형식:\n");
        sb.append("  1. '선택하신 [카테고리] 분야의 강의를 추천해드리겠습니다.'\n");
        sb.append("  2. 해당 카테고리의 강의 2-3개를 나열\n");
        sb.append("  3. '다른 강의도 추천해드릴까요?' 또는 '다른 카테고리의 강의도 살펴보시겠어요?'라고 물어보세요.\n\n");

        // 강의 선택 관련 규칙
        sb.append("B. 강의 선택 응답 규칙:\n");
        sb.append("- 사용자가 강의명을 언급하면 (예: '비즈니스 매너', '보고서 작성법'):\n");
        sb.append("  1. 절대 다시 카테고리 목록을 보여주지 마세요.\n");
        sb.append("  2. 해당 강의에 대한 자세한 설명을 제공하세요.\n");
        sb.append("  3. 마지막 문장은 다음 중 하나로 마무리하세요:\n");
        sb.append("     - '다른 강의도 추천해드릴까요?'\n");
        sb.append("     - '다른 카테고리의 강의도 살펴보시겠어요?'\n");
        sb.append("- 사용자가 '다른 강의 추천해줘'라고 하면:\n");
        sb.append("  1. 현재 카테고리에서 다른 강의를 추천하세요.\n");
        sb.append("  2. '다른 카테고리의 강의를 보고 싶으신가요?'라고 물어보세요.\n");
        sb.append("- 사용자가 긍정적인 응답을 하면 (예: '응', '네', '좋아요', '추천해줘'):\n");
        sb.append("  1. 바로 다른 강의를 2-3개 추천하세요.\n");
        sb.append("  2. 추천 후 '이 강의들은 어떠신가요?'라고 물어보세요.\n\n");

        // 추가 추천 관련 규칙
        sb.append("C. 추가 추천 규칙:\n");
        sb.append("- 다른 강의 추천 요청: 전체 목록을 보여주지 말고, 다른 카테고리의 강의를 2-3개 추천하세요.\n");
        sb.append("- '더 추천해줘' 요청: 이전에 추천하지 않은 강의를 2-3개 더 추천하세요.\n");
        sb.append("- 카테고리 선택 후에는 반드시 해당 카테고리의 강의를 추천하세요. 다시 카테고리 목록을 보여주지 마세요.\n");
        sb.append("- 사용자가 카테고리를 선택했는데 다시 카테고리 목록을 보여주지 마세요.\n");
        sb.append("- 사용자가 '다른 카테고리'라고 하면, 바로 '어떤 카테고리가 궁금하신가요?'라고 물어보고, 사용자가 카테고리명을 말하면 바로 해당 카테고리의 강의를 추천하세요.\n\n");

        // 응답 스타일 규칙
        sb.append("D. 응답 스타일 규칙:\n");
        sb.append("- 모든 응답은 간결하고 명확해야 합니다.\n");
        sb.append("- 강의 추천 시 항상 다른 표현과 문장 구조를 사용하세요.\n");
        sb.append("- 같은 강의를 추천할 때도 매번 다른 설명과 장점을 강조하세요.\n");
        sb.append("- 추천 시 '이 강의는 어떠신가요?', '이 과정을 추천드립니다', '이런 강의는 어떠실까요?' 등 다양한 표현을 사용하세요.\n");
        sb.append("- 절대 이전 대화와 동일한 문장을 반복하지 마세요.\n");
        sb.append("- 절대 전체 강의 목록을 한 번에 보여주지 마세요.\n");
        sb.append("- 카테고리 선택 후에는 반드시 해당 카테고리의 강의를 추천하세요.\n");
        sb.append("- 사용자가 카테고리를 선택했는데 다시 카테고리 목록을 보여주지 마세요.\n");
    }

    private void saveMessageToRedis(String userId, ChatMessageDto message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            String redisKey = generateRedisKey(userId);
            redisTemplate.opsForList().leftPush(redisKey, jsonMessage);
            redisTemplate.opsForList().trim(redisKey, 0, MAX_MESSAGES - 1);
            log.debug("Redis에 메시지 저장 완료: key={}, message={}", redisKey, message.getMessage());
        } catch (JsonProcessingException e) {
            log.error("메시지 직렬화 실패: {}", e.getMessage());
            throw new RuntimeException("메시지 저장에 실패했습니다.", e);
        } catch (RedisConnectionFailureException e) {
            log.error("Redis 연결 실패: {}", e.getMessage());
            throw new RuntimeException("채팅 서비스 연결에 실패했습니다.", e);
        }
    }

    private String generateRedisKey(String userId) {
        return REDIS_KEY_PREFIX + userId;
    }

    private ChatMessageDto deserializeMessage(String json) {
        try {
            return objectMapper.readValue(json, ChatMessageDto.class);
        } catch (JsonProcessingException e) {
            log.error("메시지 역직렬화 실패: {}", e.getMessage());
            return null;
        }
    }

    private boolean isInvalidMessage(ChatMessageDto message) {
        if (message == null) {
            log.warn("메시지가 null입니다.");
            return true;
        }
        if (message.getMessage() == null || message.getMessage().trim().isEmpty()) {
            log.warn("메시지 내용이 비어있습니다.");
            return true;
        }
        return false;
    }

    private ChatMessageDto createMessage(String content, Sender sender) {
        return new ChatMessageDto(UUID.randomUUID().toString(), content, sender, LocalDateTime.now());
    }
}

