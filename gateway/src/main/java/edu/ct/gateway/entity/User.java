    package edu.ct.gateway.entity;

    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDate;

    @Entity
    @Table(name = "users")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class User {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true)
        private String username;

        @Column(nullable = false)
        private String password;

        @Column(nullable = false)
        private String name;

        @Column(nullable = false)
        private String email;

        @Column(nullable = false)
        private String phone;

        @Column(nullable = false)
        private String address;

        @Column(nullable = false)
        private LocalDate birthDate; // 생년월일 필드 추가

        @Column(nullable = false)
        private String role = "USER"; // 기본값은 일반 사용자
    }