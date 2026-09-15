package com.order.management.orderservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "outbox_event", indexes = @Index(name = "idx_outbox_unpublished", columnList = "publishedAt,createdAt"))
public class OutboxEvent {
    @Id private UUID id = UUID.randomUUID();
    @Column(nullable = false) private UUID aggregateId;
    @Column(nullable = false, length = 80) private String eventType;
    @Column(nullable = false, length = 80) private String exchangeName;
    @Column(nullable = false, length = 80) private String routingKey;
    @Column(nullable = false, columnDefinition = "text") private String payload;
    @Column(nullable = false) private Instant createdAt = Instant.now();
    private Instant publishedAt;
    public OutboxEvent(UUID aggregateId, String eventType, String exchangeName, String routingKey, String payload) { this.aggregateId = aggregateId; this.eventType = eventType; this.exchangeName = exchangeName; this.routingKey = routingKey; this.payload = payload; }
    public void markPublished() { publishedAt = Instant.now(); }
}
