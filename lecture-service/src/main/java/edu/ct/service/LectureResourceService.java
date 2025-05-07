package edu.ct.service;

import edu.ct.dto.LectureResourceDto;
import edu.ct.entity.Lecture;
import edu.ct.entity.LectureResource;
import edu.ct.repository.LectureRepository;
import edu.ct.repository.LectureResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LectureResourceService {
    private final LectureResourceRepository repository;
    private final Path uploadPath = Paths.get("uploads");

    public List<LectureResourceDto> getResources(Long lectureId) {
        return repository.findByLectureIdOrderByUploadedAtDesc(lectureId).stream()
                .map(r -> new LectureResourceDto(
                        r.getId(), r.getFileName(), r.getFileUrl(), r.getUploadedAt().toString(),r.getLectureId()
                )).collect(Collectors.toList());
    }

    private String resolveUniqueFilename(String originalName) {
        String baseName = originalName;
        String extension = "";

        int dotIndex = originalName.lastIndexOf(".");
        if (dotIndex != -1) {
            baseName = originalName.substring(0, dotIndex);
            extension = originalName.substring(dotIndex); // .pdf, .jpg 등 포함
        }

        String candidateName = originalName;
        int count = 1;

        while (Files.exists(uploadPath.resolve(candidateName))) {
            candidateName = baseName + "(" + count + ")" + extension;
            count++;
        }

        return candidateName;
    }

    public void upload(Long lectureId, MultipartFile file) throws IOException {
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.trim().isEmpty()) {
            throw new IllegalArgumentException("파일명이 비어있습니다.");
        }

        String tempName = UUID.randomUUID() + "_" + originalName;
        Path tempPath = uploadPath.resolve(tempName);
        Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);

        LectureResource saved = repository.save(new LectureResource(originalName, "", lectureId));
        String storedName = lectureId + "-" + saved.getId() + "-" + originalName;

        Path finalPath = uploadPath.resolve(storedName);
        Files.move(tempPath, finalPath, StandardCopyOption.REPLACE_EXISTING);

        String url = "http://localhost:9898/files/" + storedName;
        saved.setFileUrl(url);
        saved.setFileName(storedName); // DB에도 새 파일명 저장
        repository.save(saved);
    }


    public void delete(Long resourceId) throws IOException {
        LectureResource resource = repository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 자료를 찾을 수 없습니다."));
        Path filePath = uploadPath.resolve(resource.getFileName());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        repository.deleteById(resourceId);
    }
}
