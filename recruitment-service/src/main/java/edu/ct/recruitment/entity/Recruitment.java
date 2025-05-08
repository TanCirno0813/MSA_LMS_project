package edu.ct.recruitment.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recruitment {
    @Id
    private String wantedAuthNo;

    private String recrutPbancTtl;
    private String instNm;
    private String recrutSe;
    private String hireTypeLst;
    private String detailUrl;
}
