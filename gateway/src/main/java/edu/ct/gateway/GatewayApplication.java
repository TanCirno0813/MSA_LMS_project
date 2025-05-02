package edu.ct.gateway;


import edu.ct.gateway.entity.User;

import edu.ct.gateway.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            // 초기 사용자 데이터
            User user1 = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .name("관리자")
                    .address("남포동")
                    .phone("010-1111-2222")
                    .birthDate(LocalDate.parse("2001-01-01"))
                    .email("user1@example.com")
                    .role("ADMIN")
                    .build();

            User user2 = User.builder()
                    .username("user2")
                    .password(passwordEncoder.encode("password2"))
                    .name("김철수")
                    .address("노원구")
                    .phone("010-1111-1111")
                    .birthDate(LocalDate.parse("2001-02-02"))
                    .email("user2@example.com")
                    .role("USER")
                    .build();

            User user3 = User.builder()
                    .username("fubuki")
                    .password(passwordEncoder.encode("gnqnzl123"))
                    .name("후부키")
                    .address("인창동")
                    .phone("010-3333-3333")
                    .birthDate(LocalDate.parse("2001-03-04"))
                    .email("user3@example.com")
                    .role("USER")
                    .build();

            userRepository.save(user1);
            userRepository.save(user2);
            userRepository.save(user3);


        };
    }
} 