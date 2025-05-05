package com.springreactchatbot.integration.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageRequest {
    private java.util.LinkedList<MSGContent> messages;
    private String model;
    private boolean stream;
    
    @Data
    @AllArgsConstructor
    public static class MSGContent {
        private String role;
        private String content;
    }
}
