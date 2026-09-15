package com.order.management.paymentservice.repository;
import com.order.management.paymentservice.model.PaymentTransaction; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,UUID>{ Optional<PaymentTransaction> findByIdempotencyKey(String idempotencyKey); }
