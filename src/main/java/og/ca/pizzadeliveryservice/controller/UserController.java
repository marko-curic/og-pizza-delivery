package og.ca.pizzadeliveryservice.controller;

import lombok.AllArgsConstructor;
import og.ca.pizzadeliveryservice.model.UserDTO;
import og.ca.pizzadeliveryservice.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {
    private UserService userService;

    @GetMapping("/{username}")
    public UserDTO findById(@PathVariable String username) {
        try {
            return userService.findByUsername(username).mapToDTO();
        } catch (Exception e) {
            throw new IllegalArgumentException("User with username " + username + " not found.");
        }
    }
}
