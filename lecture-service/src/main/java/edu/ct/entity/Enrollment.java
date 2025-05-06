package edu.ct.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long lectureId;
    private String userId;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;

    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;
}