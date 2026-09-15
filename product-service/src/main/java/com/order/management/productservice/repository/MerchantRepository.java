package com.order.management.productservice.repository;
import com.order.management.productservice.model.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface MerchantRepository extends JpaRepository<Merchant, UUID> { List<Merchant> findByActiveTrueOrderByNameAsc(); }
