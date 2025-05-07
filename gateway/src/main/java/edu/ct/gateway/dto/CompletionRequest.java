package edu.ct.gateway.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompletionRequest {
    private Long lectureId;      // 강의 ID
    private String lectureTitle; // 강의 제목
    private Long watchedTime;    // 시청한 시간 (초 단위)
    private Long totalDuration;  // 영상 전체 길이 (초 단위)
    private String contentTitle; // 콘텐츠 제목

    private Long resumeTime;

}
