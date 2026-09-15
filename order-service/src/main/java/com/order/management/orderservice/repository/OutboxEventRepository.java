package com.order.management.orderservice.repository;

import com.order.management.orderservice.model.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, UUID> {
    List<OutboxEvent> findTop100ByPublishedAtIsNullOrderByCreatedAtAsc();
}
