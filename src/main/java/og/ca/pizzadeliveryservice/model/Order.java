package og.ca.pizzadeliveryservice.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String address;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Transient
    private List<Pizza> pizzas;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderDTO mapToDTO() {
        return new OrderDTO(
                this.id,
                this.customerName,
                this.address,
                this.status,
                this.pizzas,
                this.createdAt,
                this.updatedAt
        );
    }
}

