package og.ca.pizzadeliveryservice.service;

import lombok.AllArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class KafkaConsumer {
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "admin-topic", groupId = "delivery-service")
    public void listenNewOrder(String message) {
        messagingTemplate.convertAndSend("/topic/admin", message);
    }

    @KafkaListener(topics = "customer-topic", groupId = "delivery-service")
    public void listenOrderStatusUpdate(String message) {
        messagingTemplate.convertAndSend("/topic/customer", message);
    }
}
