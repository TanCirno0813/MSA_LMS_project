package edu.ct.gateway.controller;

import edu.ct.gateway.dto.SmsRequest;
import edu.ct.gateway.dto.VerifyRequest;
import edu.ct.gateway.service.SmsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
public class SmsController {
    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendSms(@RequestBody SmsRequest smsRequest) {
        smsService.sendSms(smsRequest.getPhone());
        return ResponseEntity.ok("인증번호 전송 완료");
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody VerifyRequest request) {
        boolean isValid = smsService.verifyCode(request.getPhone(), request.getCode());
        Map<String, Object> response = new HashMap<>();
        response.put("success", isValid);
        return ResponseEntity.ok(response);
    }
}
