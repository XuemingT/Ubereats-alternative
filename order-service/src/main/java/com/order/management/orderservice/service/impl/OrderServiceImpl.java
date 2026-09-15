package com.order.management.orderservice.service.impl;

import com.order.management.common.constant.OrderStatus;
import com.order.management.orderservice.dto.order.OrderRecordDto;
import com.order.management.orderservice.dto.order.OrderRequestDto;
import com.order.management.orderservice.mapper.OrderMapper;
import com.order.management.orderservice.model.Order;
import com.order.management.orderservice.repository.OrderRepository;
import com.order.management.orderservice.repository.OutboxEventRepository;
import com.order.management.orderservice.model.OutboxEvent;
import com.order.management.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class OrderServiceImpl implements OrderService {
    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxEvents;

    @Override
    @Transactional
    public Order createOrderRequest(OrderRequestDto orderDto) {
        Order order = new Order();
        orderMapper.orderRequestDtoToOrder(order, orderDto);
        order.setStatus(OrderStatus.CREATED);
        orderRepository.save(order);
        // Written in the same PostgreSQL transaction as the order; never lose a delivery event on crash.
        outboxEvents.save(new OutboxEvent(order.getId(), "order.created", "x.delivery", "order.created", "{\"orderId\":\"" + order.getId() + "\"}"));
        return order;
    }

    @Override
    public OrderRecordDto getOrder(UUID orderId) {
        Optional<Order> optOrder = orderRepository.findById(orderId);
        if (optOrder.isPresent()) {
            Order order = optOrder.get();
            return orderMapper.orderToOrderRecordDto(order);
        }
        log.error("Order not found, orderId : {}", orderId);
        return null;
    }

    @Override
    public void updateOrderStatus(UUID orderId, OrderStatus status) {
        Optional<Order> optOrder = orderRepository.findById(orderId);
        if (optOrder.isPresent()) {
            Order order = optOrder.get();
            order.setStatus(status);
            orderRepository.save(order);
            log.error("Update order status with {}, orderId : {}", status.name(), orderId);
        } else {
            log.error("Order not found, orderId : {}", orderId);
        }
    }
}
