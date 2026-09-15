package com.order.management.paymentservice.service;
import com.order.management.common.constant.OrderStatus; import com.order.management.common.constant.PaymentType; import com.order.management.paymentservice.dto.StatusUpdateDto; import com.order.management.paymentservice.model.*; import com.order.management.paymentservice.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor; import org.springframework.amqp.rabbit.core.RabbitTemplate; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.util.UUID;
@Service @RequiredArgsConstructor public class PaymentTransactionService {
 private final PaymentTransactionRepository payments; private final RabbitTemplate rabbit;
 @Value("${order.status.exchange}") private String statusExchange; @Value("${order.status.key}") private String statusKey;
 @Transactional public PaymentTransaction charge(UUID orderId,double amount,PaymentType type,String key){
  var existing=payments.findByIdempotencyKey(key); if(existing.isPresent()) return existing.get();
  var payment=payments.save(new PaymentTransaction(orderId,key,amount,type));
  // deterministic sandbox failure makes the compensating path testable without a provider.
  if(amount <= 0){ payment.fail(); publish(orderId,OrderStatus.PAYMENT_FAILED); } else { payment.succeed(); publish(orderId,OrderStatus.PAID); }
  return payment;
 }
 private void publish(UUID orderId,OrderStatus status){ var update=new StatusUpdateDto(); update.setOrderId(orderId); update.setStatus(status); rabbit.convertAndSend(statusExchange,statusKey,update); }
}
