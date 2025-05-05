package com.springreactchatbot.integration.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springreactchatbot.integration.backend.model.MessageRequest;
import com.springreactchatbot.integration.backend.service.MessageService;

import reactor.core.publisher.Flux;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class MessageController {
    @Autowired
    private MessageService msgService;
    
    @PostMapping(value = "/message", produces = MediaType.TEXT_PLAIN_VALUE)
    public Flux<String> handleMessage(@RequestBody MessageRequest.MSGContent msgReq) {
        msgService.getResponse(msgReq);
        return msgService.saveAndReturn();
    }

    @GetMapping("/flush")
    public void handleFlush() {
        msgService.flushList();
    }
}
