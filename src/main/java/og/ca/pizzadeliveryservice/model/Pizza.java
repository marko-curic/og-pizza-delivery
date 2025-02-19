package og.ca.pizzadeliveryservice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "pizzas")
public class Pizza {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private Size size;

    @ElementCollection(targetClass = Topping.class)
    @CollectionTable(name = "pizza_toppings", joinColumns = @JoinColumn(name = "pizza_id"))
    @Enumerated(EnumType.STRING)
    private List<Topping> toppings = new ArrayList<>();

    @ElementCollection(targetClass = Extras.class)
    @CollectionTable(name = "pizza_extras", joinColumns = @JoinColumn(name = "pizza_id"))
    @Enumerated(EnumType.STRING)
    private List<Extras> extras = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    @JsonBackReference
    private Order order;

    private int quantity;

    public PizzaDTO mapToDTO() {
        return new PizzaDTO(
                this.getId(),
                this.getType(),
                this.getSize(),
                this.getToppings(),
                this.getExtras(),
                this.getOrder().getId(),
                this.getQuantity()
        );
    }
}
