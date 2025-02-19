package og.ca.pizzadeliveryservice.model;

public record UserDTO(
        Long id,
        String username,
        UserRole role,
        String firstName,
        String lastName,
        String address
) {
    public UserDTO fromUser(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName(),
                user.getAddress()
        );
    }
}
