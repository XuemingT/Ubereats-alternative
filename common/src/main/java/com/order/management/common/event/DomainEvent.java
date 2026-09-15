package com.order.management.common.event;

import java.time.Instant;
import java.util.UUID;

/** Stable envelope for cross-service messages. eventId is the idempotency key. */
public record DomainEvent(UUID eventId, String type, UUID aggregateId, Instant occurredAt, String payload) {
}
