package com.order.management.orderservice.service;

import com.order.management.orderservice.model.OutboxEvent;
import com.order.management.orderservice.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OutboxPublisher {
    private final OutboxEventRepository events;
    private final RabbitTemplate rabbit;
    /** Unpublished rows remain durable and are retried after a broker outage. */
    @Scheduled(fixedDelayString = "${outbox.publish-interval-ms:500}")
    @Transactional
    public void publish() {
        for (OutboxEvent event : events.findTop100ByPublishedAtIsNullOrderByCreatedAtAsc()) {
            rabbit.convertAndSend(event.getExchangeName(), event.getRoutingKey(), event.getPayload(), message -> { message.getMessageProperties().setMessageId(event.getId().toString()); message.getMessageProperties().setHeader("eventType", event.getEventType()); return message; });
            event.markPublished();
        }
    }
}
