package com.order.management.deliveryservice.controller;
import com.order.management.deliveryservice.model.*;
import com.order.management.deliveryservice.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import org.springframework.transaction.annotation.Transactional;
import java.util.*;
@RestController @RequestMapping("/deliveries") @RequiredArgsConstructor public class DeliveryController {
 private final DeliveryRepository deliveries;
 @GetMapping("/available") public List<Delivery> available(){return deliveries.findByStatus(DeliveryStatus.READY_FOR_PICKUP);}
 @PostMapping("/{id}/accept") @Transactional public ResponseEntity<Delivery> accept(@PathVariable UUID id,@RequestHeader("X-Courier-Id") String courier){return deliveries.findById(id).map(d->{d.assign(courier);return ResponseEntity.ok(d);}).orElse(ResponseEntity.notFound().build());}
 @PostMapping("/{id}/advance") @Transactional public ResponseEntity<Delivery> advance(@PathVariable UUID id,@RequestHeader("X-Courier-Id") String courier){return deliveries.findById(id).filter(d->courier.equals(d.getCourierId())).map(d->{d.advance();return ResponseEntity.ok(d);}).orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());}
}
