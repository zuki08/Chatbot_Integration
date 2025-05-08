package com.springreactchatbot.integration.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@AllArgsConstructor
public class MessageRequest {
    private java.util.LinkedList<MSGContent> messages;
    private String model;
    private boolean stream;
    @Data
    public static class MSGContent {
        private String role;
        private String content;
        public MSGContent(String r, String c) {
            role = r;
            content = c;
        }
    }
    @Data
    @EqualsAndHashCode(callSuper=false)
    public static class FBMSGContent extends MSGContent {
        private String model;
        public FBMSGContent (String r, String c, String m) {
            super(r, c);
            model = m;
        }
    }
}
