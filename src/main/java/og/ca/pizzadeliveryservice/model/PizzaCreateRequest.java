package og.ca.pizzadeliveryservice.model;

import java.util.List;

public record PizzaCreateRequest(
        Type type,
        Size size,
        List<Topping> toppings,
        List<Extras> extras,
        int quantity,
        Order order
) {}
