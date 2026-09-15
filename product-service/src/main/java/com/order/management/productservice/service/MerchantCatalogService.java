package com.order.management.productservice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.order.management.productservice.model.Merchant;
import com.order.management.productservice.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.List;

/** Cache-aside: database remains source of truth; writes invalidate the menu/catalog key. */
@Service @RequiredArgsConstructor
public class MerchantCatalogService {
    private static final String CACHE_KEY = "merchant:active:v1";
    private final MerchantRepository merchants; private final StringRedisTemplate redis; private final ObjectMapper json;
    public List<Merchant> activeMerchants() {
        String cached = redis.opsForValue().get(CACHE_KEY);
        try { if (cached != null) return json.readValue(cached, new TypeReference<>() {}); } catch (Exception ignored) { redis.delete(CACHE_KEY); }
        List<Merchant> result = merchants.findByActiveTrueOrderByNameAsc();
        try { redis.opsForValue().set(CACHE_KEY, json.writeValueAsString(result), Duration.ofMinutes(5)); } catch (Exception ignored) { /* cache is optional */ }
        return result;
    }
    public Merchant create(String name) { Merchant result = merchants.save(new Merchant(name)); redis.delete(CACHE_KEY); return result; }
    public boolean deactivate(java.util.UUID id) { return merchants.findById(id).map(m -> { m.deactivate(); merchants.save(m); redis.delete(CACHE_KEY); return true; }).orElse(false); }
}
