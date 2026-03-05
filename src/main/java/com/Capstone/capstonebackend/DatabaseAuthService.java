package com.Capstone.capstonebackend;

import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;


    @Component
    public class DatabaseAuthService {
    private static final String ADMIN_LOGIN_SQL =
        "SELECT COUNT(*) FROM admins WHERE username = ? AND password = ?";
    private static final String STUDENT_LOGIN_SQL =
        "SELECT COUNT(*) FROM students WHERE username = ? AND password = ?";

    private final JdbcTemplate jdbcTemplate;

    public DatabaseAuthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<String> authenticate(String username, String password) {
        if (isBlank(username) || isBlank(password)) return Optional.empty();

        String u = username.trim();
        String p = password.trim();

        if (exists(ADMIN_LOGIN_SQL, u, p)) return Optional.of("admin");
        if (exists(STUDENT_LOGIN_SQL, u, p)) return Optional.of("student");

        return Optional.empty();
    }

    private boolean exists(String sql, String u, String p) {
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, u, p);
        return count != null && count > 0;
    }

    private boolean isBlank(String v) {
        return v == null || v.trim().isEmpty();
    }
}
