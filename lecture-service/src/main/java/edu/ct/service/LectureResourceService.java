package edu.ct.service;

import edu.ct.dto.LectureResourceDto;
import edu.ct.entity.LectureResource;
import edu.ct.repository.LectureResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LectureResourceService {
    private final LectureResourceRepository repository;
    private final Path uploadPath = Paths.get("uploads");

    /**
     * 강의 자료 목록 조회
     */
    public List<LectureResourceDto> getResources(Long lectureId) {
        return repository.findByLectureIdOrderByUploadedAtDesc(lectureId).stream()
                .map(r -> new LectureResourceDto(
                        r.getId(), r.getFileName(), getDownloadUrl(r.getFileName()), r.getUploadedAt().toString(), r.getLectureId()
                )).collect(Collectors.toList());
    }

    /**
     * 강의 자료 업로드
     */
    public void upload(Long lectureId, MultipartFile file) throws IOException {
        // 디렉토리 없을 시 생성
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 파일명 검증 및 저장 경로 설정
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.trim().isEmpty()) {
            throw new IllegalArgumentException("파일명이 비어있습니다.");
        }

        // 저장 파일명 및 경로 생성 (타임스탬프 기반)
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String storedName = lectureId + "-" + timestamp + "-" + originalName;
        Path finalPath = uploadPath.resolve(storedName);

        // 파일 저장
        Files.copy(file.getInputStream(), finalPath, StandardCopyOption.REPLACE_EXISTING);

        // DB에 파일명 저장
        LectureResource saved = new LectureResource(originalName, "", lectureId);
        saved.setFileName(storedName);
        repository.save(saved);
    }

    /**
     * 강의 자료 삭제
     */
    public void delete(Long resourceId) throws IOException {
        LectureResource resource = repository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 자료를 찾을 수 없습니다."));
        Path filePath = uploadPath.resolve(resource.getFileName());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        repository.deleteById(resourceId);
    }

    /**
     * 다운로드 URL 생성
     */
    private String getDownloadUrl(String fileName) {
        return "/api/lectures/resources/download/" + fileName;
    }
}
