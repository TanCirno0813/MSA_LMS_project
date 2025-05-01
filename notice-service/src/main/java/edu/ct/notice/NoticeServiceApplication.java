package edu.ct.notice;

import edu.ct.notice.entity.Notice;
import edu.ct.notice.repository.NoticeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class NoticeServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NoticeServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(NoticeRepository noticeRepository) {
        return args -> {
            if (noticeRepository.count() == 0) {
                Notice notice1 = new Notice();
                notice1.setTitle("시스템 점검 안내");
                notice1.setContent("4월 20일(토) 23시 ~ 24시 시스템 점검이 진행됩니다.");
                notice1.setWriter("admin");
                notice1.setCreatedAt(LocalDateTime.now());

                Notice notice2 = new Notice();
                notice2.setTitle("공지사항 예시");
                notice2.setContent("공지사항 더미 데이터를 테스트로 넣습니다.");
                notice2.setWriter("admin");
                notice2.setCreatedAt(LocalDateTime.now().minusDays(1));

                noticeRepository.save(notice1);
                noticeRepository.save(notice2);
            }
        };
    }
}
