package com.order.management.productservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity @Getter @Setter @NoArgsConstructor
@Table(name = "merchant", indexes = @Index(name = "idx_merchant_active_name", columnList = "active,name"))
public class Merchant {
    @Id private UUID id = UUID.randomUUID();
    @Column(nullable = false, length = 120) private String name;
    @Column(nullable = false) private boolean active = true;
    @Column(nullable = false) private Instant createdAt = Instant.now();
    public Merchant(String name) { this.name = name; }
    public void deactivate() { active = false; }
}
