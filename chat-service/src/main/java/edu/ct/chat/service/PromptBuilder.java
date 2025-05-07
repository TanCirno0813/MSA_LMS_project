package edu.ct.chat.service;

import org.springframework.stereotype.Component;

import edu.ct.chat.dto.ExamResultDto;
import edu.ct.chat.dto.LectureDto;

import java.util.List;

@Component
public class PromptBuilder {

    public String build(String userMessage, List<LectureDto> lectures, List<ExamResultDto> results) {
        StringBuilder sb = new StringBuilder();

        sb.append("사용자 질문: ").append(userMessage).append("\n\n");
        sb.append("아래는 사용자가 수강한 강의 목록이야. 반드시 이 강의 목록 안에서 추천해줘.\n\n");

        sb.append("이전 수강 강의:\n");
        if (lectures.isEmpty()) {
            sb.append("- 없음\n");
        } else {
            for (LectureDto lec : lectures) {
                sb.append("- ").append(lec.getTitle()).append("\n");
            }
        }

        sb.append("\n시험 결과:\n");
        if (results.isEmpty()) {
            sb.append("- 없음\n");
        } else {
            for (ExamResultDto exam : results) {
                sb.append("- ").append(exam.getExamTitle()).append(": 점수 ").append(exam.getScore()).append("\n");
            }
        }

        sb.append("\n이 정보를 참고해서 수강 이력이 없더라도 AI가 판단해 적절한 강의를 추천하거나 도움을 줘. 단, 강의 목록에만 있는 것들에 한해서 추천하는거야");

        return sb.toString();
    }
}



