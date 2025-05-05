package com.springreactchatbot.integration.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springreactchatbot.integration.backend.model.MessageRequest;
import com.springreactchatbot.integration.backend.service.MessageService;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api")
public class MessageController {
    @Autowired
    private MessageService msgService;
    
    @PostMapping("/message")
    public Flux<String> handleMessage(@RequestBody MessageRequest msgReq) {
        msgService.getResponse(msgReq);
        return msgService.saveAndReturn();
    }
}
