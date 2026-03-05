package com.Capstone.capstonebackend;

import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseAuthService {
    private static final String ADMIN_LOGIN_SQL   = "SELECT COUNT(*) FROM admins WHERE username = ? AND password = ?";
    private static final String STUDENT_LOGIN_SQL = "SELECT COUNT(*) FROM students WHERE username = ? AND password = ?";

    private static final String ADMIN_EXISTS_SQL  = "SELECT COUNT(*) FROM admins WHERE username = ?";
    private static final String STUDENT_EXISTS_SQL= "SELECT COUNT(*) FROM students WHERE username = ?";

    private static final String ADMIN_INSERT_SQL  = "INSERT INTO admins (username, password) VALUES (?, ?)";
    private static final String STUDENT_INSERT_SQL= "INSERT INTO students (username, password) VALUES (?, ?)";

    private final JdbcTemplate jdbcTemplate;

    public DatabaseAuthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<String> authenticate(String username, String password) {
        if (isBlank(username) || isBlank(password)) {
            return Optional.empty();
        }

        String normalizedUsername = username.trim();
        String normalizedPassword = password.trim();

        if (exists(ADMIN_LOGIN_SQL, normalizedUsername, normalizedPassword)) {
            return Optional.of("admin");
        }

        if (exists(STUDENT_LOGIN_SQL, normalizedUsername, normalizedPassword)) {
            return Optional.of("student");
        }

        return Optional.empty();
    }

    public void createUser(String role, String username, String password) {
        if (isBlank(role) || isBlank(username) || isBlank(password)) {
            throw new IllegalArgumentException("Role, username, and password are required.");
        }

        String normalizedRole = role.trim().toLowerCase();
        String normalizedUsername = username.trim();
        String normalizedPassword = password.trim();

        if (!normalizedRole.equals("admin") && !normalizedRole.equals("student")) {
            throw new IllegalArgumentException("Role must be either admin or student.");
        }

        if (userExists(normalizedUsername)) {
            throw new IllegalStateException("Username already exists.");
        }

        String insertSql = normalizedRole.equals("admin") ? ADMIN_INSERT_SQL : STUDENT_INSERT_SQL;
        jdbcTemplate.update(insertSql, normalizedUsername, normalizedPassword);
    }

    private boolean userExists(String username) {
        Integer adminCount = jdbcTemplate.queryForObject(ADMIN_EXISTS_SQL, Integer.class, username);
        Integer studentCount = jdbcTemplate.queryForObject(STUDENT_EXISTS_SQL, Integer.class, username);
        int totalCount = (adminCount == null ? 0 : adminCount) + (studentCount == null ? 0 : studentCount);
        return totalCount > 0;
    }

    private boolean exists(String sql, String username, String password) {
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username, password);
        return count != null && count > 0;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
