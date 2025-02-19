package og.ca.pizzadeliveryservice.model;

import java.util.List;

public record OrderDraftRequest(
        String username,
        String address,
        List<Pizza> pizzas
) {
}
