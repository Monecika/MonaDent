package com.monadent.application.controller;

import com.monadent.application.events.PatientDataChangeNotifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/events")
public class PatientEventsController {
    private final PatientDataChangeNotifier notifier;

    @GetMapping(value = "/patients", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeToPatientChanges() {
        return notifier.subscribe();
    }
}
