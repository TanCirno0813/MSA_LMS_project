package edu.ct.util;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEF"; // gateway와 동일한 secret

    public Long extractUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())   // 동일한 secret key로 서명 검증
                .build()
                .parseClaimsJws(token)                 // JWT를 파싱
                .getBody()
                .get("userId", Long.class);           // userId claim 꺼내오기
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


}
