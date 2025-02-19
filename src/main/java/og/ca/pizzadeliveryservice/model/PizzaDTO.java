package og.ca.pizzadeliveryservice.model;

import java.util.List;

public record PizzaDTO(
        Long id,
        Type type,
        Size size,
        List<Topping> toppings,
        List<Extras> extras,
        Long orderId,
        int quantity
) {

}
