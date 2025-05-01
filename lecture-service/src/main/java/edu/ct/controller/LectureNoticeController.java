package edu.ct.controller;

import edu.ct.entity.LectureNotice;
import edu.ct.repository.LectureNoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/lectures/{lectureId}/notices")
@RequiredArgsConstructor
public class LectureNoticeController {

    private final LectureNoticeRepository noticeRepository;

    // ✅ 공지사항 목록 조회
    @GetMapping
    public List<LectureNotice> getNotices(@PathVariable Long lectureId) {
        return noticeRepository.findByLectureIdOrderByCreatedAtDesc(lectureId);
    }

    // ✅ 공지사항 등록 (관리자만)
    @PostMapping
    public LectureNotice createNotice(@PathVariable Long lectureId, @RequestBody LectureNotice notice) {
        notice.setLectureId(lectureId);
        notice.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    // ✅ 공지사항 삭제
    @DeleteMapping("/{noticeId}")
    public void deleteNotice(@PathVariable Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }
    //수정
    @PutMapping("/{noticeId}")
    public LectureNotice updateNotice(@PathVariable Long noticeId, @RequestBody LectureNotice updatedNotice) {
        LectureNotice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 존재하지 않습니다."));

        notice.setTitle(updatedNotice.getTitle());
        notice.setContent(updatedNotice.getContent());
        notice.setCreatedAt(LocalDateTime.now()); // 수정 시각 갱신

        return noticeRepository.save(notice);
    }
}