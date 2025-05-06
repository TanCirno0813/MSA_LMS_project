package edu.ct.config;

import edu.ct.entity.LectureResource;
import edu.ct.repository.LectureResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FileCleanupRunner implements ApplicationRunner {

    private final LectureResourceRepository resourceRepository;
    private final Path uploadPath = Paths.get("uploads");

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!Files.exists(uploadPath)) return;

        List<LectureResource> validResources = resourceRepository.findAll();

        try (DirectoryStream<Path> files = Files.newDirectoryStream(uploadPath)) {
            for (Path file : files) {
                String filename = file.getFileName().toString();
                String[] parts = filename.split("-", 3);
                if (parts.length < 3) {
                    Files.delete(file);
                    System.out.println("🧹 형식 불일치로 삭제된 파일: " + filename);
                    continue;
                }

                Long lectureId = Long.valueOf(parts[0]);
                Long resourceId = Long.valueOf(parts[1]);

                boolean exists = validResources.stream().anyMatch(r ->
                        r.getId().equals(resourceId) && r.getLectureId().equals(lectureId));

                if (!exists) {
                    Files.delete(file);
                    System.out.println("🧹 DB에 없는 파일 삭제: " + filename);
                }
            }
        }
    }
}
