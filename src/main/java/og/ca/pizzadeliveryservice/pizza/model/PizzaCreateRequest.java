package og.ca.pizzadeliveryservice.pizza.model;

import og.ca.pizzadeliveryservice.order.model.Order;

import java.util.List;

public record PizzaCreateRequest(
        Type type,
        Size size,
        List<Topping> toppings,
        List<Extras> extras,
        int quantity,
        Order order
) {}
