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
import java.util.*;
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
     * [POST] 실시간 이수율 저장 또는 갱신
     */
    @PostMapping
    public CompletionHistory saveCompletion(@RequestHeader("Authorization") String authorizationHeader,
                                            @RequestBody CompletionRequest request) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);

        Long userId = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        Optional<CompletionHistory> existing = completionRepository
                .findByUserIdAndLectureIdAndContentTitle(userId, request.getLectureId(), request.getContentTitle());

        CompletionHistory history;
        if (existing.isPresent()) {
            history = existing.get();
            history.setWatchedTime(request.getWatchedTime());
            history.setTotalDuration(request.getTotalDuration());
            history.setCompletedAt(LocalDate.now()); // 마지막 갱신일자도 업데이트
        } else {
            history = new CompletionHistory();
            history.setUserId(userId);
            history.setLectureId(request.getLectureId());
            history.setContentTitle(request.getContentTitle());
            history.setWatchedTime(request.getWatchedTime());
            history.setTotalDuration(request.getTotalDuration());
            history.setCompletedAt(LocalDate.now());
        }

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
        Map<Long, String> lectureTitleCache = new HashMap<>();

        return completions.stream().map(completion -> {
            Map<String, Object> response = new HashMap<>();
            response.put("id", completion.getId());
            response.put("lectureId", completion.getLectureId());
            response.put("contentTitle", completion.getContentTitle());
            response.put("completedAt", completion.getCompletedAt());
            response.put("watchedTime", completion.getWatchedTime());
            response.put("totalDuration", completion.getTotalDuration());

            if (!lectureTitleCache.containsKey(completion.getLectureId())) {
                try {
                    String lectureServiceUrl = "http://localhost:9696/api/lectures/" + completion.getLectureId();
                    ResponseEntity<Map> res = restTemplate.getForEntity(lectureServiceUrl, Map.class);
                    Map<String, Object> lectureInfo = res.getBody();
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
    }

    // 나머지 관리자용 조회 API 그대로 유지 ----------------------

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserCompletions(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long userId
    ) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);

        User requestingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"ADMIN".equals(requestingUser.getRole())) {
            return ResponseEntity.status(403).body("관리자만 접근할 수 있습니다.");
        }

        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }

        List<CompletionHistory> completions = completionRepository.findByUserId(userId);
        Map<Long, String> lectureTitleCache = new HashMap<>();

        List<Map<String, Object>> result = completions.stream().map(completion -> {
            Map<String, Object> response = new HashMap<>();
            response.put("id", completion.getId());
            response.put("userId", completion.getUserId());
            response.put("lectureId", completion.getLectureId());
            response.put("contentTitle", completion.getContentTitle());
            response.put("completedAt", completion.getCompletedAt());
            response.put("watchedTime", completion.getWatchedTime());
            response.put("totalDuration", completion.getTotalDuration());

            if (!lectureTitleCache.containsKey(completion.getLectureId())) {
                try {
                    String lectureServiceUrl = "http://localhost:9696/api/lectures/" + completion.getLectureId();
                    ResponseEntity<Map> res = restTemplate.getForEntity(lectureServiceUrl, Map.class);
                    Map<String, Object> lectureInfo = res.getBody();
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

    @GetMapping("/admin/summary")
    public ResponseEntity<?> getAllUserCompletionsSummary(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);

        User requestingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"ADMIN".equals(requestingUser.getRole())) {
            return ResponseEntity.status(403).body("관리자만 접근할 수 있습니다.");
        }

        List<User> allUsers = userRepository.findAll();
        List<CompletionHistory> allCompletions = completionRepository.findAll();
        Map<Long, List<CompletionHistory>> userCompletions = allCompletions.stream()
                .collect(Collectors.groupingBy(CompletionHistory::getUserId));
        Map<Long, String> lectureTitleCache = new HashMap<>();

        List<Map<String, Object>> result = allUsers.stream().map(user -> {
            Map<String, Object> userSummary = new HashMap<>();
            userSummary.put("userId", user.getId());
            userSummary.put("username", user.getUsername());
            userSummary.put("name", user.getName());
            userSummary.put("email", user.getEmail());

            List<CompletionHistory> userList = userCompletions.getOrDefault(user.getId(), List.of());
            userSummary.put("totalCompletions", userList.size());

            if (!userList.isEmpty()) {
                CompletionHistory latest = userList.stream()
                        .max(Comparator.comparing(CompletionHistory::getCompletedAt))
                        .orElse(null);
                if (latest != null) {
                    Map<String, Object> latestInfo = new HashMap<>();
                    latestInfo.put("contentTitle", latest.getContentTitle());
                    latestInfo.put("completedAt", latest.getCompletedAt());
                    latestInfo.put("watchedTime", latest.getWatchedTime());
                    latestInfo.put("totalDuration", latest.getTotalDuration());

                    Long lectureId = latest.getLectureId();
                    if (!lectureTitleCache.containsKey(lectureId)) {
                        try {
                            String url = "http://localhost:9696/api/lectures/" + lectureId;
                            ResponseEntity<Map> res = restTemplate.getForEntity(url, Map.class);
                            Map<String, Object> lectureInfo = res.getBody();
                            lectureTitleCache.put(lectureId,
                                    (lectureInfo != null && lectureInfo.containsKey("title"))
                                            ? (String) lectureInfo.get("title")
                                            : "강의 " + lectureId
                            );
                        } catch (Exception e) {
                            lectureTitleCache.put(lectureId, "강의 " + lectureId);
                        }
                    }

                    latestInfo.put("lectureId", lectureId);
                    latestInfo.put("lectureTitle", lectureTitleCache.get(lectureId));
                    userSummary.put("latestCompletion", latestInfo);
                }
            }

            return userSummary;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/debug/all")
    public List<CompletionHistory> debugAll() {
        return completionRepository.findAll();
    }
}
