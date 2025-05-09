package edu.ct.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentDto {
    private String recrutPblntSn;  // 공고번호
    private String recrutPbancTtl; // 채용공고제목
    private String instNm;         // 기관명
    private String recrutSe;       // 채용구분
    private String hireTypeLst;    // 고용유형목록
    private String detailUrl;      // 상세보기 URL
}