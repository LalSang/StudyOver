package com.Capstone.capstonebackend;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    private final AppstateAuthProvider authProvider;
    private final DatabaseAuthService databaseAuthService;
    private final StudySessionService studySessionService;

    public HomeController(
            AppstateAuthProvider authProvider,
            DatabaseAuthService databaseAuthService,
            StudySessionService studySessionService) {
        this.authProvider = authProvider;
        this.databaseAuthService = databaseAuthService;
        this.studySessionService = studySessionService;
    }

    // landing page
    @GetMapping("/")
    public String index() {
        return "redirect:/SO_SignOnPage.html";
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session) {
        if (isBlank(username) || isBlank(password)) {
            return "redirect:/SO_SignOnPage.html?error=missing";
        }

        Optional<String> userRole = databaseAuthService.authenticate(username, password);
        if (userRole.isEmpty()) {
            return "redirect:/SO_SignOnPage.html?error=invalid";
        }

        session.setAttribute("authenticated", true);
        session.setAttribute("userEmail", username.trim());
        session.setAttribute("userRole", userRole.get());
        return "redirect:/SO_DashBoard.html";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return "redirect:/SO_SignOnPage.html";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "redirect:/SO_SignUpPage.html";
    }

    @PostMapping("/signup")
    public String signup(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String status,
            @RequestParam String gradYear,
            @RequestParam String birthday,
            @RequestParam String gender,
            @RequestParam String confirmPassword) {
        if (isBlank(firstName)
                || isBlank(lastName)
                || isBlank(status)
                || isBlank(gradYear)
                || isBlank(birthday)
                || isBlank(gender)) {
            return "redirect:/SO_SignUpPage.html?error=missing";
        }

        if (password == null || password.isBlank() || confirmPassword == null || confirmPassword.isBlank()) {
            return "redirect:/SO_SignUpPage.html?error=missing";
        }

        if (!password.equals(confirmPassword)) {
            return "redirect:/SO_SignUpPage.html?error=mismatch";
        }

        if (!authProvider.isValidAppStateUser(email)) {
            return "redirect:/SO_SignUpPage.html?error=domain";
        }

        return "redirect:/SO_SignOnPage.html?signup=success";
    }

    @GetMapping("/join-session")
    public String joinSession() {
        return "redirect:/SO_RSVPConfrimation.html";
    }

    @GetMapping("/create-post")
    public String createPost() {
        return "redirect:/SO_CreateNewPost.html";
    }

    @GetMapping("/browse-sessions")
    public String browseSessions() {
        return "redirect:/SO_BrowseSessions.html";
    }

    @GetMapping(path = "/api/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<StudySession> getSessions() {
        return studySessionService.getAll();
    }

    @PostMapping(path = "/api/sessions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> createSession(@RequestBody CreateStudySessionRequest request) {
        String validationError = validateSessionRequest(request);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(Map.of("error", validationError));
        }

        StudySession createdSession = studySessionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSession);
    }

    @DeleteMapping(path = "/api/sessions/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteSession(@PathVariable long id) {
        boolean deleted = studySessionService.deleteById(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    private String validateSessionRequest(CreateStudySessionRequest request) {
        if (isBlank(request.getUserName())) {
            return "Name is required.";
        }
        if (isBlank(request.getTopic())) {
            return "Topic is required.";
        }
        if (isBlank(request.getCourseCode())) {
            return "Course code is required.";
        }
        if (isBlank(request.getSessionTitle())) {
            return "Session title is required.";
        }
        if (isBlank(request.getSessionDate())) {
            return "Session date is required.";
        }
        if (isBlank(request.getSessionTime())) {
            return "Session time is required.";
        }
        if (isBlank(request.getSessionLocation())) {
            return "Meeting location is required.";
        }
        if (isBlank(request.getMaxParticipants())) {
            return "Max participants is required.";
        }
        if (isBlank(request.getDifficultyLevel())) {
            return "Difficulty level is required.";
        }
        if (isBlank(request.getSessionDescription())) {
            return "Additional information is required.";
        }
        if (request.getSessionDescription().trim().length() < 50) {
            return "Additional information must be at least 50 characters.";
        }

        return null;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}
