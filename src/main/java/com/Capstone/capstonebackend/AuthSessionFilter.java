package com.Capstone.capstonebackend;

import java.io.IOException;
import java.util.Set;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AuthSessionFilter extends OncePerRequestFilter {
    private static final Set<String> PUBLIC_PATHS = Set.of(
            "/",
            "/login",
            "/signup",
            "/SO_SelectSchoolPage.html",
            "/SO_SignOnPage.html",
            "/SO_SignUpPage.html",
            "/actions.js",
            "/styles.css",
            "/error",
            "/favicon.ico");

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            return true;
        }

        if (PUBLIC_PATHS.contains(path)) {
            return true;
        }

        return path.startsWith("/images/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        boolean authenticated = session != null && Boolean.TRUE.equals(session.getAttribute("authenticated"));

        if (!authenticated) {
            response.sendRedirect("/SO_SelectSchoolPage.html?error=auth");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
