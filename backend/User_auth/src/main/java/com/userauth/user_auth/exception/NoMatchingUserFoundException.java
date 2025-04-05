package com.userauth.user_auth.exception;

public class NoMatchingUserFoundException extends RuntimeException {

    public NoMatchingUserFoundException(String username) {
        super("No user found with email matching {} " + username);
    }
}
