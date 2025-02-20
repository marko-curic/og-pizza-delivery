package og.ca.pizzadeliveryservice.order.service;

import og.ca.pizzadeliveryservice.kafka.service.KafkaProducer;
import og.ca.pizzadeliveryservice.order.model.Order;
import og.ca.pizzadeliveryservice.order.model.OrderDraftRequest;
import og.ca.pizzadeliveryservice.order.model.OrderStatus;
import og.ca.pizzadeliveryservice.order.persistance.OrdersRepository;
import og.ca.pizzadeliveryservice.pizza.model.Pizza;
import og.ca.pizzadeliveryservice.pizza.persistance.PizzaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static og.ca.pizzadeliveryservice.helper.CommonsHelper.*;
import static org.assertj.core.api.BDDAssertions.then;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderingServiceTest {

    @Mock
    private PizzaRepository pizzaRepository;

    @Mock
    private OrdersRepository ordersRepository;

    @Mock
    private KafkaProducer kafkaProducer;

    @InjectMocks
    private OrderingService orderingService;

    @Test
    void should_return_all_orders() {
        //given
        var order = givenOrder();
        when(ordersRepository.findAll()).thenReturn(List.of(order));
        when(pizzaRepository.findByOrderId(ORDER_ID)).thenReturn(order.getPizzas());

        //when
        var result = orderingService.getAll();

        //then
        then(result).hasSize(1);
        verify(ordersRepository, times(1)).findAll();
    }

    @Test
    void should_return_existing_order() {
        //given
        var order = givenOrder();
        when(ordersRepository.findDraftByUsername(USERNAME)).thenReturn(order);
        when(pizzaRepository.findByOrderId(ORDER_ID)).thenReturn(order.getPizzas());
        when(ordersRepository.save(any(Order.class))).thenReturn(order);

        //when
        var result = orderingService.createDraftOrder(givenDraftRequest());

        //then
        then(result).isNotNull();
        then(result.customerName()).isEqualTo(USERNAME);
        verify(ordersRepository, times(1)).findDraftByUsername(USERNAME);
    }

    @Test
    void should_create_new_order_when_draft_does_not_exist() {
        //given
        var order = givenOrder();
        when(ordersRepository.findDraftByUsername(USERNAME)).thenReturn(null);
        when(ordersRepository.save(any(Order.class))).thenReturn(order);

        //when
        var result = orderingService.createDraftOrder(givenDraftRequest());

        //then
        then(result).isNotNull();
        then(result.customerName()).isEqualTo(USERNAME);
        verify(ordersRepository, times(1)).save(any(Order.class));
    }

    @Test
    void should_return_draft_order_for_user() {
        //given
        var order = givenOrder();
        when(ordersRepository.findDraftByUsername(USERNAME)).thenReturn(order);
        when(pizzaRepository.findByOrderId(ORDER_ID)).thenReturn(order.getPizzas());

        //when
        var result = orderingService.findDraftOrderForUser(USERNAME);

        //then
        then(result).isNotNull();
        then(result.customerName()).isEqualTo(USERNAME);
        then(result.status()).isEqualTo(OrderStatus.DRAFT);
    }

    @Test
    void should_return_null_when_no_draft_exists() {
        //given
        when(ordersRepository.findDraftByUsername(USERNAME)).thenReturn(null);

        //when
        var result = orderingService.findDraftOrderForUser(USERNAME);

        //then
        then(result).isNull();
    }

    @Test
    void should_send_notification_when_new_order_submitted() {
        //given
        var order = givenOrder();
        when(ordersRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(ordersRepository.save(any(Order.class))).thenReturn(order);

        //when
        orderingService.submitOrder(ORDER_ID);

        //then
        then(order.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(kafkaProducer, times(1)).sendNewOrderNotification(anyString());
        verify(ordersRepository, times(1)).save(order);
    }

    @Test
    void should_throw_exception_when_no_order_found() {
        //given
        when(ordersRepository.findById(ORDER_ID)).thenReturn(Optional.empty());

        //then
        var exception = assertThrows(RuntimeException.class, () -> orderingService.submitOrder(ORDER_ID));
        assertEquals("There was a problem submitting your order.", exception.getMessage());
    }

    @Test
    void should_update_status_and_send_notification() {
        //given
        var order = givenOrder();
        when(ordersRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));

        //when
        orderingService.updateOrderStatus(ORDER_ID, OrderStatus.COMPLETED);

        //then
        then(order.getStatus()).isEqualTo(OrderStatus.COMPLETED);
        verify(kafkaProducer, times(1)).sendOrderStatusUpdate(anyString());
        verify(ordersRepository, times(1)).save(order);
    }

    @Test
    void should_throw_exception_when_order_not_found() {
        //given
        when(ordersRepository.findById(ORDER_ID)).thenReturn(Optional.empty());

        //then
        var exception = assertThrows(IllegalArgumentException.class, () -> orderingService.updateOrderStatus(ORDER_ID, OrderStatus.COMPLETED));
        assertEquals("Order with id 1 not found.", exception.getMessage());
    }

    @Test
    void should_delete_order() {
        //given
        when(ordersRepository.existsById(ORDER_ID)).thenReturn(true);
        doNothing().when(ordersRepository).deleteById(ORDER_ID);

        //when
        orderingService.deleteById(ORDER_ID);

        //then
        verify(ordersRepository, times(1)).deleteById(ORDER_ID);
    }

    @Test
    void should_throw_when_order_not_found() {
        //given
        when(ordersRepository.existsById(ORDER_ID)).thenReturn(false);

        //then
        var exception = assertThrows(IllegalArgumentException.class, () -> orderingService.deleteById(ORDER_ID));
        assertEquals("Can not delete order with id 1.Order with id 1 not found.", exception.getMessage());
    }

    private OrderDraftRequest givenDraftRequest() {
        return new OrderDraftRequest(USERNAME, ADDRESS, List.of());
    }

    private Order givenOrder() {
        var order = new Order();
        order.setId(ORDER_ID);
        order.setCustomerName(USERNAME);
        order.setAddress(ADDRESS);
        order.setStatus(OrderStatus.DRAFT);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPizzas(new ArrayList<>(List.of(new Pizza())));

        return order;
    }
}
