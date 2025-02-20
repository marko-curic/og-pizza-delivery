package og.ca.pizzadeliveryservice.order.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import og.ca.pizzadeliveryservice.kafka.service.KafkaProducer;
import og.ca.pizzadeliveryservice.order.model.Order;
import og.ca.pizzadeliveryservice.order.model.OrderDTO;
import og.ca.pizzadeliveryservice.order.model.OrderDraftRequest;
import og.ca.pizzadeliveryservice.order.model.OrderStatus;
import og.ca.pizzadeliveryservice.order.persistance.OrdersRepository;
import og.ca.pizzadeliveryservice.pizza.model.Pizza;
import og.ca.pizzadeliveryservice.pizza.persistance.PizzaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OrderingService {

    private final OrdersRepository ordersRepository;
    private final PizzaRepository pizzaRepository;
    private final KafkaProducer kafkaProducer;

    @Transactional
    public List<OrderDTO> getAll() {
        try {
            return ordersRepository.findAll().stream().peek(order -> {
                var pizzas = pizzaRepository.findByOrderId(order.getId());
                order.setPizzas(pizzas);
            }).map(Order::mapToDTO).toList();
        } catch (Exception e) {
            throw new RuntimeException("Error getting all orders", e);
        }
    }

    public OrderDTO createDraftOrder(OrderDraftRequest request) {
        var existingOrder = ordersRepository.findDraftByUsername(request.username());

        if (existingOrder != null) {
            existingOrder.setPizzas(pizzaRepository.findByOrderId(existingOrder.getId()));
            return updateOrder(existingOrder, request.pizzas());
        }

        var newOrder = new Order();
        newOrder.setAddress(request.address());
        newOrder.setCustomerName(request.username());
        newOrder.setPizzas(request.pizzas());
        newOrder.setStatus(OrderStatus.DRAFT);
        newOrder.setCreatedAt(LocalDateTime.now());
        newOrder.setUpdatedAt(LocalDateTime.now());

        try {
            return ordersRepository.save(newOrder).mapToDTO();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create draft order. Please try again.", e);
        }
    }


    public OrderDTO findDraftOrderForUser(String username) {
        return Optional.ofNullable(ordersRepository.findDraftByUsername(username))
                .map(draft -> {
                    draft.setPizzas(pizzaRepository.findByOrderId(draft.getId()));
                    return draft.mapToDTO();
                })
                .orElse(null);
    }

    public OrderDTO submitOrder(Long id) {
        var order = ordersRepository.findById(id).orElse(null);
        if (order == null) {
            throw new RuntimeException("There was a problem submitting your order.");
        }
        try {
            order.setStatus(OrderStatus.PENDING);
            kafkaProducer.sendNewOrderNotification("Customer " + order.getCustomerName() + " has submitted an order.");
            return ordersRepository.save(order).mapToDTO();
        } catch (RuntimeException e) {
            throw new RuntimeException("There was a problem submitting your order.");
        }
    }

    public void updateOrderStatus(Long id, OrderStatus status) {
        var order = ordersRepository.findById(id);
        if (order.isEmpty()) {
            throw new IllegalArgumentException("Order with id " + id + " not found.");
        }
        try {
            order.get().setStatus(status);
            kafkaProducer.sendOrderStatusUpdate("Your order is now " + status.name());
            ordersRepository.save(order.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("There was a problem updating the order. Please try again soon.");
        }
    }

    public void deleteById(Long id) {
        try {
            if (ordersRepository.existsById(id)) {
                ordersRepository.deleteById(id);
            } else {
                throw new IllegalArgumentException("Order with id " + id + " not found.");
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Can not delete order with id " + id + ".Order with id " + id + " not found.");
        }
    }

    private OrderDTO updateOrder(Order order, List<Pizza> addedPizzas) {
        order.getPizzas().addAll(addedPizzas);
        order.setUpdatedAt(LocalDateTime.now());
        return ordersRepository.save(order).mapToDTO();
    }
}
