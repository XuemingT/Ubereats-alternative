package com.order.management.deliveryservice.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="processed_message") public class ProcessedMessage { @Id private String eventId; private Instant processedAt=Instant.now(); protected ProcessedMessage(){} public ProcessedMessage(String eventId){this.eventId=eventId;} }
