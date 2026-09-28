package com.deepfake.sentinel.dto.auth;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, String type, UserDto user, String message) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.user = user;
        this.message = message;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private String type = "Bearer";
        private UserDto user;
        private String message;

        public Builder token(String token) { this.token = token; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }
        public Builder message(String message) { this.message = message; return this; }

        public AuthResponse build() { return new AuthResponse(token, type, user, message); }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
