package com.order.management.deliveryservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.order.management.deliveryservice.model.Delivery;
import com.order.management.deliveryservice.model.ProcessedMessage;
import com.order.management.deliveryservice.repository.DeliveryRepository;
import com.order.management.deliveryservice.repository.ProcessedMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class DeliveryEventConsumer {
    private final DeliveryRepository deliveries; private final ProcessedMessageRepository processed; private final ObjectMapper json;
    /** DB uniqueness makes duplicate redeliveries harmless, including after a consumer crash. */
    @RabbitListener(queues = "q.delivery.order-created") @Transactional
    public void orderCreated(String body, @Header(name = "amqp_messageId", required = false) String eventId) throws Exception {
        if (eventId == null || processed.existsById(eventId)) return;
        JsonNode message = json.readTree(body); UUID orderId = UUID.fromString(message.get("orderId").asText());
        if (deliveries.findByOrderId(orderId).isEmpty()) deliveries.save(new Delivery(orderId));
        processed.save(new ProcessedMessage(eventId));
    }
}
