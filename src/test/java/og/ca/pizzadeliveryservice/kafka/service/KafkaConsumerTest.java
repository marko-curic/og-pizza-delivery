package og.ca.pizzadeliveryservice.kafka.service;

import og.ca.pizzadeliveryservice.TestBase;
import org.junit.jupiter.api.Test;

import static og.ca.pizzadeliveryservice.helper.CommonsHelper.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class KafkaConsumerTest extends TestBase {

    @Test
    void listenNewOrder_shouldSendMessageToAdminTopic() {
        //when
        kafkaConsumer.listenNewOrder(MESSAGE);

        //then
        verify(messagingTemplate, times(1)).convertAndSend(ADMIN_TOPIC_DEST, MESSAGE);
    }

    @Test
    void listenOrderStatusUpdate_shouldSendMessageToCustomerTopic() {
        //when
        kafkaConsumer.listenOrderStatusUpdate(MESSAGE);

        //then
        verify(messagingTemplate, times(1)).convertAndSend(CUSTOMER_TOPIC_DEST, MESSAGE);
    }
}
