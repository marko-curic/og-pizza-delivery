package og.ca.pizzadeliveryservice.user.model;

public record UserRegisterRequest(
        String username,
        String password,
        String firstName,
        String lastName,
        String address
) {
}
