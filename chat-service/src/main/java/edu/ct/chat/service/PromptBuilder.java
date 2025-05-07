package edu.ct.chat.service;

import org.springframework.stereotype.Component;
import edu.ct.chat.dto.LectureDto;

import java.util.List;

@Component
public class PromptBuilder {

    public String build(String userMessage, List<LectureDto> lectures) {
        StringBuilder sb = new StringBuilder();

        sb.append("사용자 질문: ").append(userMessage).append("\n\n");

        // 강의 목록을 AI에게 전달
        sb.append("아래는 추천할 수 있는 강의 목록이야. 반드시 이 강의 목록 안에서 추천해줘.\n\n");
        sb.append("강의 목록:\n");
        if (lectures.isEmpty()) {
            sb.append("- 강의가 없습니다.\n");
        } else {
            for (LectureDto lec : lectures) {
                sb.append("- ").append(lec.getTitle()).append("\n");
            }
        }

        sb.append("\n주의: 반드시 위의 강의 목록에서만 추천해줘. 목록에 없는 강의는 추천하지 마.\n");

        System.out.println("Generated Prompt: " + sb.toString());

        return sb.toString();
    }
}

