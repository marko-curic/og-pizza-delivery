package og.ca.pizzadeliveryservice.model;

public record UserRegisterRequest(
        String username,
        String password,
        String firstName,
        String lastName,
        String address
) {
}
