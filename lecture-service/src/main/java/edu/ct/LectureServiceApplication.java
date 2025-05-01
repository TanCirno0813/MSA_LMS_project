package edu.ct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@EnableDiscoveryClient
@SpringBootApplication
public class LectureServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LectureServiceApplication.class, args);
    }

}
