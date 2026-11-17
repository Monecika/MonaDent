package com.monadent.application.events;

import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PatientDataChangeNotifier {
    private static final long CONNECTION_TIMEOUT_MILLIS = 10 * 60 * 1000L;
    private final Set<SseEmitter> subscribers = ConcurrentHashMap.newKeySet();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(CONNECTION_TIMEOUT_MILLIS);
        subscribers.add(emitter);
        emitter.onCompletion(() -> subscribers.remove(emitter));
        emitter.onTimeout(() -> subscribers.remove(emitter));
        emitter.onError(error -> subscribers.remove(emitter));
        try {
            emitter.send(SseEmitter.event().name("patient-changed").data("connected"));
        } catch (IOException | IllegalStateException error) {
            subscribers.remove(emitter);
            emitter.completeWithError(error);
        }
        return emitter;
    }

    public void patientDataChanged() {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    notifySubscribers();
                }
            });
            return;
        }

        notifySubscribers();
    }

    private void notifySubscribers() {
        for (SseEmitter emitter : subscribers) {
            try {
                synchronized (emitter) {
                    emitter.send(SseEmitter.event().name("patient-changed").data("changed"));
                }
            } catch (IOException | IllegalStateException error) {
                subscribers.remove(emitter);
                emitter.completeWithError(error);
            }
        }
    }

    @PreDestroy
    void closeSubscribers() {
        subscribers.forEach(SseEmitter::complete);
        subscribers.clear();
    }
}
