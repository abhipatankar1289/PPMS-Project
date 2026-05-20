package com.substring.app.auth.service;

import com.substring.app.auth.entity.User;
import com.substring.app.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    public User register(User user) {
        // 1. Check if email already exists in DB
        Optional<User> existingUser = repo.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("You already have an account. Please login.");
        }

        // 2. Encode the raw password before saving
        user.setPassword(encoder.encode(user.getPassword()));

        // 3. Ensure a default role exists if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        return repo.save(user);
    }

    public User login(String email, String password) {
        // 1. Find user by email
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // 2. The Match check using PasswordEncoder.matches()
        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}