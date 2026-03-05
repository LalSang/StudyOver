package com.Capstone.capstonebackend;

import org.springframework.stereotype.Component;

@Component
public class AppstateAuthProvider {
    public boolean isValidAppStateUser(String username) {
        if (username == null) {
            return false;
        }

        return username.trim().toLowerCase().endsWith("@appstate.edu");
    }
}
