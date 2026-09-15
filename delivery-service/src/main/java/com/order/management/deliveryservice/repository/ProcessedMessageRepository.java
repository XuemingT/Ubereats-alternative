package com.order.management.deliveryservice.repository;
import com.order.management.deliveryservice.model.ProcessedMessage; import org.springframework.data.jpa.repository.JpaRepository;
public interface ProcessedMessageRepository extends JpaRepository<ProcessedMessage,String>{}
