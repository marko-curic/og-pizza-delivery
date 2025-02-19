package og.ca.pizzadeliveryservice.service;

import lombok.AllArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendNewOrderNotification(String message) {
        kafkaTemplate.send("admin-topic", message);
    }

    public void sendOrderStatusUpdate(String message) {
        kafkaTemplate.send("customer-topic", message);
    }
}
