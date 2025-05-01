package edu.ct.notice.controller;

import edu.ct.notice.entity.Notice;
import edu.ct.notice.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    @GetMapping
    public List<Notice> getAll() {
        return noticeRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PostMapping //추가
    public ResponseEntity<?> createNotice(@RequestBody Notice notice) {
        notice.setCreatedAt(LocalDateTime.now());
        noticeRepository.save(notice);
        return ResponseEntity.ok("등록 완료");
    }

    @GetMapping("/{id}") //상세보기
    public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
        return noticeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}") //수정
    public ResponseEntity<?> updateNotice(@PathVariable Long id, @RequestBody Notice updatedNotice) {
        Optional<Notice> noticeOpt = noticeRepository.findById(id);
        if (noticeOpt.isPresent()) {
            Notice notice = noticeOpt.get();
            notice.setTitle(updatedNotice.getTitle());
            notice.setContent(updatedNotice.getContent());
            noticeRepository.save(notice);
            return ResponseEntity.ok("수정 완료");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 공지 없음");
        }
    }

    @DeleteMapping("/{id}") //삭제
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        noticeRepository.deleteById(id);
        return ResponseEntity.ok("삭제 완료");
    }
    // 상세, 수정, 삭제 추가 예정
}
