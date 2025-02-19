package og.ca.pizzadeliveryservice.model;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDTO(
        Long id,
        String customerName,
        String address,
        OrderStatus status,
        List<Pizza> pizzas,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public OrderDTO fromOrder(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getCustomerName(),
                order.getAddress(),
                order.getStatus(),
                order.getPizzas(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
