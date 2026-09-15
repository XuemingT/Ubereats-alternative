package com.order.management.deliveryservice.repository;
import com.order.management.deliveryservice.model.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface DeliveryRepository extends JpaRepository<Delivery, UUID>{ Optional<Delivery> findByOrderId(UUID orderId); List<Delivery> findByStatus(DeliveryStatus status); }
