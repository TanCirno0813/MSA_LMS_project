package edu.ct.gateway.controller;

import edu.ct.gateway.dto.CompletionRequest;
import edu.ct.gateway.entity.CompletionHistory;
import edu.ct.gateway.entity.User;
import edu.ct.gateway.repository.CompletionRepository;
import edu.ct.gateway.repository.UserRepository;
import edu.ct.gateway.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/completions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompletionController {

    private final CompletionRepository completionRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    /**
     * [POST] 이수율 등록 (영상 시청 완료 시 호출)
     */
    @PostMapping
    public CompletionHistory saveCompletion(@RequestHeader("Authorization") String authorizationHeader,
                                            @RequestBody CompletionRequest request) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);

        Long userId = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        double watchRatio = (double) request.getWatchedTime() / request.getTotalDuration();
        if (watchRatio < 0.9) {
            throw new IllegalArgumentException("Not enough watch time to complete.");
        }

        // 같은 콘텐츠를 이미 이수했는지 확인 (Repository 메서드 사용)
        Optional<CompletionHistory> existingCompletion = completionRepository
                .findByUserIdAndLectureIdAndContentTitle(userId, request.getLectureId(), request.getContentTitle());

        // 이미 이수한 콘텐츠라면 기존 기록 반환
        if (existingCompletion.isPresent()) {
            return existingCompletion.get();
        }

        // 새 이수 기록 생성
        CompletionHistory history = new CompletionHistory();
        history.setUserId(userId);
        history.setLectureId(request.getLectureId());
        history.setContentTitle(request.getContentTitle());
        history.setCompletedAt(LocalDate.now());

        return completionRepository.save(history);
    }

    /**
     * [GET] 로그인한 사용자의 이수 이력 조회
     */
    @GetMapping("/me")
    public List<Map<String, Object>> getMyCompletions(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);

        Long userId = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        List<CompletionHistory> completions = completionRepository.findByUserId(userId);
        
        // 조회된 강의 ID별 강의 제목 캐시 (같은 강의 정보를 반복해서 조회하지 않기 위함)
        Map<Long, String> lectureTitleCache = new HashMap<>();
        
        // 강의 정보 및 콘텐츠 제목 포함하여 응답
        return completions.stream().map(completion -> {
            // Map.of() 대신 HashMap 사용 (Map.of()는 불변 맵이라 put 메서드 사용 불가)
            HashMap<String, Object> response = new HashMap<>();
            response.put("id", completion.getId());
            response.put("lectureId", completion.getLectureId());
            response.put("contentTitle", completion.getContentTitle());
            response.put("completedAt", completion.getCompletedAt());
            
            // 캐시에 없는 경우에만 강의 정보 조회
            if (!lectureTitleCache.containsKey(completion.getLectureId())) {
                try {
                    // 강의 서비스에서 강의 정보 조회
                    String lectureServiceUrl = "http://localhost:9696/api/lectures/" + completion.getLectureId();
                    log.info("강의 정보 조회 요청: {}", lectureServiceUrl);
                    
                    ResponseEntity<Map> response1 = restTemplate.getForEntity(lectureServiceUrl, Map.class);
                    Map<String, Object> lectureInfo = response1.getBody();
                    
                    if (lectureInfo != null && lectureInfo.containsKey("title")) {
                        // 캐시에 저장
                        String title = (String) lectureInfo.get("title");
                        lectureTitleCache.put(completion.getLectureId(), title);
                        log.info("강의 제목 조회 성공: [ID:{}] {}", completion.getLectureId(), title);
                    } else {
                        // 기본값 설정
                        lectureTitleCache.put(completion.getLectureId(), "강의 " + completion.getLectureId());
                        log.warn("강의 제목 정보 없음: {}", completion.getLectureId());
                    }
                } catch (Exception e) {
                    // 오류 발생 시 기본값 설정
                    lectureTitleCache.put(completion.getLectureId(), "강의 " + completion.getLectureId());
                    log.error("강의 정보 조회 실패: {}", e.getMessage());
                }
            }
            
            // 캐시된 강의 제목 사용
            response.put("lectureTitle", lectureTitleCache.get(completion.getLectureId()));
            
            return response;
        }).collect(Collectors.toList());
    }

    /**
     * [GET] 특정 사용자의 이수 이력을 조회 (관리자용)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserCompletions(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long userId
    ) {
        // 권한 검증 (관리자만 접근 가능)
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        
        User requestingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!"ADMIN".equals(requestingUser.getRole())) {
            return ResponseEntity.status(403).body("관리자만 접근할 수 있습니다.");
        }
        
        // 사용자 존재 여부 확인
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        
        // 사용자 이수 기록 조회
        List<CompletionHistory> completions = completionRepository.findByUserId(userId);
        
        // 강의 제목 캐시
        Map<Long, String> lectureTitleCache = new HashMap<>();
        
        // 결과 변환
        List<Map<String, Object>> result = completions.stream().map(completion -> {
            HashMap<String, Object> response = new HashMap<>();
            response.put("id", completion.getId());
            response.put("userId", completion.getUserId());
            response.put("lectureId", completion.getLectureId());
            response.put("contentTitle", completion.getContentTitle());
            response.put("completedAt", completion.getCompletedAt());
            
            // 캐시에 없는 경우에만 강의 정보 조회
            if (!lectureTitleCache.containsKey(completion.getLectureId())) {
                try {
                    String lectureServiceUrl = "http://localhost:9696/api/lectures/" + completion.getLectureId();
                    ResponseEntity<Map> response1 = restTemplate.getForEntity(lectureServiceUrl, Map.class);
                    Map<String, Object> lectureInfo = response1.getBody();
                    
                    if (lectureInfo != null && lectureInfo.containsKey("title")) {
                        lectureTitleCache.put(completion.getLectureId(), (String) lectureInfo.get("title"));
                    } else {
                        lectureTitleCache.put(completion.getLectureId(), "강의 " + completion.getLectureId());
                    }
                } catch (Exception e) {
                    lectureTitleCache.put(completion.getLectureId(), "강의 " + completion.getLectureId());
                }
            }
            
            response.put("lectureTitle", lectureTitleCache.get(completion.getLectureId()));
            
            return response;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    /**
     * [GET] 전체 사용자의 이수 이력 요약 정보 (관리자용)
     * 각 사용자별로 총 이수 건수와 최신 이수 정보를 포함
     */
    @GetMapping("/admin/summary")
    public ResponseEntity<?> getAllUserCompletionsSummary(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        // 권한 검증 (관리자만 접근 가능)
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        
        User requestingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!"ADMIN".equals(requestingUser.getRole())) {
            return ResponseEntity.status(403).body("관리자만 접근할 수 있습니다.");
        }
        
        // 전체 사용자 목록 조회
        List<User> allUsers = userRepository.findAll();
        
        // 전체 이수 기록 조회
        List<CompletionHistory> allCompletions = completionRepository.findAll();
        
        // 사용자별로 이수 기록 그룹화
        Map<Long, List<CompletionHistory>> userCompletions = allCompletions.stream()
                .collect(Collectors.groupingBy(CompletionHistory::getUserId));
        
        // 강의 ID별 제목 캐시
        Map<Long, String> lectureTitleCache = new HashMap<>();
        
        // 각 사용자별 이수 요약 정보 생성
        List<Map<String, Object>> result = allUsers.stream().map(user -> {
            HashMap<String, Object> userSummary = new HashMap<>();
            userSummary.put("userId", user.getId());
            userSummary.put("username", user.getUsername());
            userSummary.put("name", user.getName());
            userSummary.put("email", user.getEmail());
            
            List<CompletionHistory> userCompletionsList = userCompletions.getOrDefault(user.getId(), List.of());
            userSummary.put("totalCompletions", userCompletionsList.size());
            
            // 최근 이수 정보
            if (!userCompletionsList.isEmpty()) {
                CompletionHistory latestCompletion = userCompletionsList.stream()
                        .sorted((a, b) -> b.getCompletedAt().compareTo(a.getCompletedAt()))
                        .findFirst().orElse(null);
                
                if (latestCompletion != null) {
                    Map<String, Object> latestInfo = new HashMap<>();
                    latestInfo.put("contentTitle", latestCompletion.getContentTitle());
                    latestInfo.put("completedAt", latestCompletion.getCompletedAt());
                    
                    // 강의 제목 조회
                    Long lectureId = latestCompletion.getLectureId();
                    if (!lectureTitleCache.containsKey(lectureId)) {
                        try {
                            String lectureServiceUrl = "http://localhost:9696/api/lectures/" + lectureId;
                            ResponseEntity<Map> response = restTemplate.getForEntity(lectureServiceUrl, Map.class);
                            Map<String, Object> lectureInfo = response.getBody();
                            
                            if (lectureInfo != null && lectureInfo.containsKey("title")) {
                                lectureTitleCache.put(lectureId, (String) lectureInfo.get("title"));
                            } else {
                                lectureTitleCache.put(lectureId, "강의 " + lectureId);
                            }
                        } catch (Exception e) {
                            lectureTitleCache.put(lectureId, "강의 " + lectureId);
                        }
                    }
                    
                    latestInfo.put("lectureTitle", lectureTitleCache.get(lectureId));
                    latestInfo.put("lectureId", lectureId);
                    
                    userSummary.put("latestCompletion", latestInfo);
                }
            }
            
            return userSummary;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    /**
     * [임시용] 전체 이수 이력 디버그 조회 (선택)
     */
    @GetMapping("/debug/all")
    public List<CompletionHistory> debugAll() {
        return completionRepository.findAll();
    }
}
