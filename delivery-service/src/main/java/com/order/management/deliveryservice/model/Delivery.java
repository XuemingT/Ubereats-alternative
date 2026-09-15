package com.order.management.deliveryservice.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Getter @NoArgsConstructor @Table(name="delivery", indexes={@Index(name="idx_delivery_available",columnList="status,createdAt"),@Index(name="idx_delivery_courier",columnList="courierId,status")}) public class Delivery { @Id private UUID id=UUID.randomUUID(); @Column(nullable=false,unique=true) private UUID orderId; private String courierId; @Enumerated(EnumType.STRING) @Column(nullable=false) private DeliveryStatus status=DeliveryStatus.READY_FOR_PICKUP; @Column(nullable=false) private Instant createdAt=Instant.now(); public Delivery(UUID orderId){this.orderId=orderId;} public void assign(String courier){if(status!=DeliveryStatus.READY_FOR_PICKUP) throw new IllegalStateException("delivery is not available");courierId=courier;status=DeliveryStatus.ACCEPTED;} public void advance(){status=switch(status){case ACCEPTED->DeliveryStatus.PICKED_UP;case PICKED_UP->DeliveryStatus.DELIVERING;case DELIVERING->DeliveryStatus.DELIVERED;default->throw new IllegalStateException("invalid delivery transition");};} }
