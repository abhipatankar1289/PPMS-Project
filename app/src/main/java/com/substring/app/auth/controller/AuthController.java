package com.substring.app.auth.controller;

import com.substring.app.auth.entity.User;
import com.substring.app.auth.service.UserService;
import com.substring.app.auth.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService service;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {

        try {

            // default role USER
            if(user.getRole() == null || user.getRole().isEmpty()){
                user.setRole("USER");
            }

            service.register(user);

            return ResponseEntity.ok("Registration Successful");

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred");
        }
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginRequest) {

        try {

            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            if (email == null || password == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Email and password are required");
            }

            User user = service.login(email, password);

            // generate token
            String token = jwtUtil.generateToken(user.getEmail());

            // response object
            Map<String, Object> response = new HashMap<>();

            response.put("token", token);
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            response.put("name", user.getName());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}