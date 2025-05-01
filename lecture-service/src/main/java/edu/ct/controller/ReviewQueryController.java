package edu.ct.controller;

import edu.ct.entity.Lecture;
import edu.ct.entity.LectureReview;
import edu.ct.repository.LectureRepository;
import edu.ct.repository.LectureReviewRepository;
import edu.ct.dto.ReviewWithLectureTitleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewQueryController {

    private final LectureReviewRepository reviewRepository;
    private final LectureRepository lectureRepository;

    // 전체 리뷰 조회 (lectureTitle 포함)
    @GetMapping
    public List<ReviewWithLectureTitleDTO> getAllReviews() {
        List<LectureReview> reviews = reviewRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return reviews.stream()
                .map(review -> {
                    String lectureTitle = lectureRepository.findById(review.getLectureId())
                            .map(Lecture::getTitle)
                            .orElse("제목 없음");

                    return new ReviewWithLectureTitleDTO(
                            review.getId(),
                            review.getTitle(),
                            review.getContent(),
                            review.getAuthor(),
                            review.getCreatedAt(),
                            lectureTitle
                    );
                })
                .toList();
    }
}
