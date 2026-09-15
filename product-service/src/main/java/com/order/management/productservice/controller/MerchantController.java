package com.order.management.productservice.controller;

import com.order.management.productservice.model.Merchant;
import com.order.management.productservice.service.MerchantCatalogService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/merchants") @RequiredArgsConstructor
public class MerchantController {
    private final MerchantCatalogService merchants;
    public record CreateMerchantRequest(@NotBlank String name) {}
    @GetMapping public List<Merchant> list() { return merchants.activeMerchants(); }
    @PostMapping public ResponseEntity<Merchant> create(@RequestBody CreateMerchantRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(merchants.create(request.name())); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> deactivate(@PathVariable UUID id) { return merchants.deactivate(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build(); }
}
