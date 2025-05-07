package com.springreactchatbot.integration.backend.service;

import java.util.LinkedList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
        if(res != null) return;
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
        .bodyToFlux(String.class)
        .concatMap(chunk -> Mono.just(chunk + "\n")).cache();
        // saveMessage();
        // res.subscribe(s -> System.out.println(s), errr -> System.err.println(errr));
        // return res;
    }
    
    public Flux<MSGContent> getMsg() {
        if(res == null) return null;
        saveMessage();
        return res.map(chunk -> {
            if(chunk.equals("[DONE]")) return new MessageRequest.MSGContent("assistant", "");
            return new MessageRequest.MSGContent(parseResponse(chunk, true), parseResponse(chunk, false));
        });
    }

    public Flux<MSGContent> getTestMsg() {
        String[] messages = {
            "Voyager", " 1,", " launched", " in", " 1977,", " is", " the", " farthest", " human-made", " object", " from", " Earth.", 
            " It", " carries", " a", " Golden", " Record", " containing", " sounds", " and", " images", " representing", " life", 
            " and", " culture", " on", " Earth,", " intended", " for", " any", " extraterrestrial", " life", " that", " might", 
            " find", " it.", " Despite", " being", " over", " 14", " billion", " miles", " away,", " Voyager", " 1", " still", 
            " communicates", " with", " NASA", " using", " the", " Deep", " Space", " Network.", " The", " spacecraft", 
            " runs", " on", " a", " radioisotope", " thermoelectric", " generator", " and", " has", " enough", " power", 
            " to", " send", " data", " until", " around", " 2025.", " Its", " journey", " has", " provided", " invaluable", 
            " information", " about", " the", " outer", " planets", " and", " the", " interstellar", " medium."
        };
        Flux<String> fsString = Flux.fromArray(messages);
        return fsString.map(s -> new MessageRequest.MSGContent("assistant", s));
    }

    private void saveMessage() {
        StringBuilder sb = new StringBuilder();
        res
        .map(s -> parseResponse(s, false))
        .subscribe(s -> sb.append(s), errr -> System.err.println(errr));
        msgs.add(new MSGContent("assistant", sb.toString()));
    }

    public void flushList() {
        msgs.clear();
    }

    private String parseResponse(String res, boolean role) {
        try {
            if (res.startsWith("data: ")) {
                res = res.substring(6);
            }
            System.out.println(res);
            if(res.contains("[DONE]") || res.contains("OPENROUTER")) return "";
            JsonNode root = objMapper.readTree(res);
            JsonNode choices = root.path("choices");
            if(choices.isArray()  && choices.size() > 0) {
                JsonNode msg = choices.get(0).path("delta");
                return role? msg.get("role").asText() : msg.get("content").asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
