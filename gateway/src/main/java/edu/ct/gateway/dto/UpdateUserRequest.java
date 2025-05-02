package edu.ct.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String birthDate;
    private String currentPassword;
    private String newPassword;
}
