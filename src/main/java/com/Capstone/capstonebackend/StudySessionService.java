package com.Capstone.capstonebackend;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class StudySessionService {
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final CopyOnWriteArrayList<StudySession> sessions = new CopyOnWriteArrayList<>();

    public StudySession create(CreateStudySessionRequest request, String ownerUsername) {
        StudySession session = new StudySession(
                idGenerator.getAndIncrement(),
                ownerUsername,
                request.getUserName(),
                request.getTopic(),
                request.getCourseCode(),
                request.getSessionTitle(),
                request.getSessionDate(),
                request.getSessionTime(),
                request.getSessionLocation(),
                request.getMaxParticipants(),
                request.getDifficultyLevel(),
                request.getSessionDescription());

        sessions.add(session);
        return session;
    }

    public List<StudySession> getAll() {
        List<StudySession> copy = new ArrayList<>(sessions);
        copy.sort(Comparator.comparingLong(StudySession::getId).reversed());
        return copy;
    }

    public Optional<StudySession> findById(long id) {
        return sessions.stream().filter(session -> session.getId() == id).findFirst();
    }

    public boolean deleteById(long id) {
        return sessions.removeIf(session -> session.getId() == id);
    }
}
