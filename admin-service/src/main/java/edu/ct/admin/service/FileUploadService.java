package edu.ct.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {

    @Value("${file.upload-dir:lecture_image}")
    private String uploadDir;
    
    //file.base-url을 통해 9595포트로 접근 함 없으면 8080포트로 접근 함
    @Value("${file.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * 파일을 저장하고 URL을 반환합니다.
     * 
     * @param file 업로드된 파일
     * @return 저장된 파일의 URL
     * @throws IOException 파일 저장 중 오류 발생 시
     */
    public String storeFile(MultipartFile file) throws IOException {
        // 파일 이름에서 확장자 추출
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        
        // 중복 방지를 위한 고유 파일명 생성 (UUID + 원본 확장자)
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // 저장 디렉토리 생성
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Created directory: {}", uploadPath);
        }
        
        // 파일 저장
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        log.info("Stored file: {} at {}", originalFilename, filePath);
        
        // 파일 URL 생성 및 반환
        return baseUrl + "/api/images/" + uniqueFilename;
    }
} 