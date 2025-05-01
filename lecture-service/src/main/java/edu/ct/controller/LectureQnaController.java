package edu.ct.controller;

import edu.ct.entity.LectureQna;
import edu.ct.repository.LectureQnaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/lectures/{lectureId}/qna")
@RequiredArgsConstructor
public class LectureQnaController {

    private final LectureQnaRepository qnaRepository;

    @GetMapping
    public List<LectureQna> getQnas(@PathVariable Long lectureId) {
        return qnaRepository.findByLectureIdOrderByCreatedAtDesc(lectureId);
    }

    @PostMapping
    public LectureQna createQuestion(@PathVariable Long lectureId, @RequestBody LectureQna qna) {
        qna.setLectureId(lectureId);
        qna.setCreatedAt(LocalDateTime.now());
        return qnaRepository.save(qna);
    }

    @PutMapping("/{qnaId}/answer")
    public LectureQna answerQna(@PathVariable Long qnaId, @RequestBody String answer) {
        LectureQna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 질문이 존재하지 않습니다."));
        qna.setAnswer(answer);
        qna.setAnsweredAt(LocalDateTime.now());
        return qnaRepository.save(qna);
    }

    @DeleteMapping("/{qnaId}")
    public void deleteQna(@PathVariable Long qnaId) {
        qnaRepository.deleteById(qnaId);
    }
}
