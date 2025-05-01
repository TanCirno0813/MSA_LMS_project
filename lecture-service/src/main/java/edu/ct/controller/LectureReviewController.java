package edu.ct.controller;

import edu.ct.entity.LectureNotice;
import edu.ct.entity.LectureReview;
import edu.ct.repository.LectureNoticeRepository;
import edu.ct.repository.LectureReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/lectures/{lectureId}/reviews")
@RequiredArgsConstructor
public class LectureReviewController {

    private final LectureReviewRepository reviewRepository;

    // ✅ 리뷰 목록 조회
    @GetMapping
    public List<LectureReview> getReviews(@PathVariable Long lectureId) {
        return reviewRepository.findByLectureIdOrderByCreatedAtDesc(lectureId);
    }

    // ✅ 리뷰 등록
    @PostMapping
    public LectureReview createReview(@PathVariable Long lectureId, @RequestBody LectureReview review) {
        review.setLectureId(lectureId);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    // ✅ 리뷰 삭제 (리뷰를 생성한 사용자 또는 관리자만)
    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
    //수정  (리뷰를 생성한 사용자 또는 관리자만)
    @PutMapping("/{reviewId}")
    public LectureReview updateReview(@PathVariable Long reviewId, @RequestBody LectureReview updateReview) {
        LectureReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 존재하지 않습니다."));

        review.setTitle(updateReview.getTitle());
        review.setContent(updateReview.getContent());
        review.setCreatedAt(LocalDateTime.now()); // 수정 시각 갱신

        return reviewRepository.save(review);
    }
}