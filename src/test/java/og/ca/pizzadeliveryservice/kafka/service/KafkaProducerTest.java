package og.ca.pizzadeliveryservice.kafka.service;

import og.ca.pizzadeliveryservice.TestBase;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class KafkaProducerTest extends TestBase {

    @Test
    void should_send_message_to_admin_topic() {
        //given
        var testMessage = "New Order Placed!";
        var topicCaptor = ArgumentCaptor.forClass(String.class);
        var messageCaptor = ArgumentCaptor.forClass(String.class);

        //when
        kafkaProducer.sendNewOrderNotification(testMessage);

        //then
        verify(kafkaTemplate, times(1)).send(topicCaptor.capture(), messageCaptor.capture());
        then(topicCaptor.getValue()).isEqualTo("admin-topic");
        then(messageCaptor.getValue()).isEqualTo(testMessage);
    }

    @Test
    void should_send_message_to_customer_topic() {
        //given
        var testMessage = "Order status updated!";
        var topicCaptor = ArgumentCaptor.forClass(String.class);
        var messageCaptor = ArgumentCaptor.forClass(String.class);

        //when
        kafkaProducer.sendOrderStatusUpdate(testMessage);

        //then
        verify(kafkaTemplate, times(1)).send(topicCaptor.capture(), messageCaptor.capture());
        then(topicCaptor.getValue()).isEqualTo("customer-topic");
        then(messageCaptor.getValue()).isEqualTo(testMessage);
    }
}
