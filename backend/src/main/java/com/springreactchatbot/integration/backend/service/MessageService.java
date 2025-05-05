package com.springreactchatbot.integration.backend.service;

import java.util.LinkedList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springreactchatbot.integration.backend.model.MessageRequest;
import com.springreactchatbot.integration.backend.model.MessageRequest.MSGContent;

@Service
public class MessageService {
    @Autowired
    private WebClient.Builder wcBuilder;

    @Autowired
    private ObjectMapper objMapper;

    @Value("${API_KEY}")
    private String API_KEY;
    
    @Value("${API_URI}")
    private String API_URI;

    private Flux<String> res;
    private LinkedList<MSGContent> msgs;

    public MessageService() {
        res = null;
        msgs = new LinkedList<>();
    }

    public void getResponse(MessageRequest.MSGContent msgContent) {
        WebClient wc = wcBuilder.build();
        msgs.add(msgContent);
        System.out.println(msgContent.getRole() + " " + msgContent.getContent());
        for(MSGContent m : msgs){
            System.out.println(m.getRole() + " " + m.getContent());
        }
        res = wc
        .post()
        .uri(API_URI)
        .header("Authorization", "Bearer " + API_KEY)
        .bodyValue(new MessageRequest(msgs, "meta-llama/llama-3.1-8b-instruct:free", true))
        .retrieve()
        .bodyToFlux(String.class);

        // res.subscribe(s -> System.out.println(s), errr -> System.err.println(errr));
    }

    public Flux<String> saveAndReturn() {
        StringBuilder sb = new StringBuilder();
        res
        .map(s -> parseResponse(s))
        .subscribe(s -> sb.append(s), errr -> System.err.println(errr));
        msgs.add(new MSGContent("assistant", sb.toString()));
        return res;
    }

    public void flushList() {
        msgs.clear();
    }

    private String parseResponse(String res) {
        try {
            if(res.equals("[DONE]")) return "";
            JsonNode root = objMapper.readTree(res);
            JsonNode choices = root.path("choices");
            if(choices.isArray()  && choices.size() > 0) {
                JsonNode msg = choices.get(0).path("delta");
                return msg.get("content").asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
