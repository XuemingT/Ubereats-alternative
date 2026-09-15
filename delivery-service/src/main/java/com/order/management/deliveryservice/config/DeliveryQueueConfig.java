package com.order.management.deliveryservice.config;
import org.springframework.amqp.core.*; import org.springframework.context.annotation.*;
@Configuration public class DeliveryQueueConfig { @Bean Declarables deliverySchema(){ DirectExchange exchange=new DirectExchange("x.delivery",true,false); Queue queue=QueueBuilder.durable("q.delivery.order-created").build(); return new Declarables(exchange,queue,BindingBuilder.bind(queue).to(exchange).with("order.created")); } }
