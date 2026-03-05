package com.Capstone.capstonebackend;

public class StudySession {
    private long id;
    private String ownerUsername;
    private String userName;
    private String topic;
    private String courseCode;
    private String sessionTitle;
    private String sessionDate;
    private String sessionTime;
    private String sessionLocation;
    private String maxParticipants;
    private String difficultyLevel;
    private String sessionDescription;

    public StudySession() {
    }

    public StudySession(
            long id,
            String ownerUsername,
            String userName,
            String topic,
            String courseCode,
            String sessionTitle,
            String sessionDate,
            String sessionTime,
            String sessionLocation,
            String maxParticipants,
            String difficultyLevel,
            String sessionDescription) {
        this.id = id;
        this.ownerUsername = ownerUsername;
        this.userName = userName;
        this.topic = topic;
        this.courseCode = courseCode;
        this.sessionTitle = sessionTitle;
        this.sessionDate = sessionDate;
        this.sessionTime = sessionTime;
        this.sessionLocation = sessionLocation;
        this.maxParticipants = maxParticipants;
        this.difficultyLevel = difficultyLevel;
        this.sessionDescription = sessionDescription;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(String sessionDate) {
        this.sessionDate = sessionDate;
    }

    public String getSessionTime() {
        return sessionTime;
    }

    public void setSessionTime(String sessionTime) {
        this.sessionTime = sessionTime;
    }

    public String getSessionLocation() {
        return sessionLocation;
    }

    public void setSessionLocation(String sessionLocation) {
        this.sessionLocation = sessionLocation;
    }

    public String getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(String maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getSessionDescription() {
        return sessionDescription;
    }

    public void setSessionDescription(String sessionDescription) {
        this.sessionDescription = sessionDescription;
    }
}
