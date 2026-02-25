package com.Capstone.capstonebackend;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AppstateAuthProvider {
    private static final Map<String, String> SCHOOL_EMAIL_DOMAINS = Map.of(
            "appstate", "@appstate.edu",
            "unc", "@unc.edu",
            "ncsu", "@ncsu.edu",
            "duke", "@duke.edu",
            "ecu", "@ecu.edu");

    public boolean isValidAppStateUser(String username) {
        if (username == null) {
            return false;
        }

        return username.trim().toLowerCase().endsWith("@appstate.edu");
    }

    public boolean isValidSchoolUser(String username, String schoolKey) {
        if (username == null || schoolKey == null) {
            return false;
        }

        String expectedDomain = SCHOOL_EMAIL_DOMAINS.get(schoolKey.trim().toLowerCase());
        if (expectedDomain == null) {
            return false;
        }

        return username.trim().toLowerCase().endsWith(expectedDomain);
    }
}
