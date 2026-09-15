package com.order.management.paymentservice.controller;
import com.order.management.common.constant.PaymentType; import com.order.management.paymentservice.model.PaymentTransaction; import com.order.management.paymentservice.service.PaymentTransactionService;
import jakarta.validation.constraints.*; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.util.UUID;
@RestController @RequestMapping("/payments") @RequiredArgsConstructor public class PaymentController {
 private final PaymentTransactionService payments;
 public record ChargeRequest(@NotNull UUID orderId, @PositiveOrZero double amount, @NotNull PaymentType paymentType){}
 @PostMapping public ResponseEntity<PaymentTransaction> charge(@RequestHeader("Idempotency-Key") String key,@RequestBody ChargeRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(payments.charge(request.orderId(),request.amount(),request.paymentType(),key));}
}
