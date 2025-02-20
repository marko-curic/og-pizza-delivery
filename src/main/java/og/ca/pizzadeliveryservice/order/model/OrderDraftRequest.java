package og.ca.pizzadeliveryservice.order.model;

import og.ca.pizzadeliveryservice.pizza.model.Pizza;

import java.util.List;

public record OrderDraftRequest(
        String username,
        String address,
        List<Pizza> pizzas
) {
}
