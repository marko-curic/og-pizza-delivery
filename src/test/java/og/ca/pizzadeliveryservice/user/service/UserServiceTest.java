package og.ca.pizzadeliveryservice.user.service;

import og.ca.pizzadeliveryservice.TestBase;
import og.ca.pizzadeliveryservice.user.model.User;
import og.ca.pizzadeliveryservice.user.model.UserRegisterRequest;
import og.ca.pizzadeliveryservice.user.model.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static og.ca.pizzadeliveryservice.helper.CommonsHelper.*;
import static org.assertj.core.api.BDDAssertions.then;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class UserServiceTest extends TestBase {

    @Test
    void should_register_user() {
        //given
        when(passwordEncoder.encode(anyString())).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(givenUser());

        //when
        userService.register(givenUserRegisterRequest());

        //then
        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode(PASSWORD);
    }

    @Test
    void should_find_user_by_username() {
        //given
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(givenUser()));

        //when
        var foundUser = userService.findByUsername(USERNAME);

        //then
        then(foundUser).isNotNull();
        then(foundUser.getUsername()).isEqualTo(USERNAME);
        verify(userRepository, times(1)).findByUsername(USERNAME);
    }

    @Test
    void should_throw_when_no_user_found() {
        //given
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.empty());

        //then
        var exception = assertThrows(IllegalArgumentException.class, () -> userService.findByUsername(USERNAME));
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void should_find_user_details_by_username() {
        //given
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(givenUser()));

        //when
        var userDetails = userService.loadUserByUsername("john_doe");

        //then
        then(userDetails).isNotNull();
        then(userDetails.getUsername()).isEqualTo(USERNAME);
        verify(userRepository, times(1)).findByUsername(USERNAME);
    }

    @Test
    void should_throw_when_no_user_details_found() {
        //given
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.empty());

        //then
        var exception = assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername(USERNAME));
        assertEquals("User not found", exception.getMessage());
    }

    private UserRegisterRequest givenUserRegisterRequest() {
        return new UserRegisterRequest(USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, ADDRESS);
    }

    private User givenUser() {
        var user = new User();
        user.setUsername(USERNAME);
        user.setPassword(ENCODED_PASSWORD);
        user.setRole(UserRole.CUSTOMER);
        user.setFirstName(FIRST_NAME);
        user.setLastName(LAST_NAME);
        user.setAddress(ADDRESS);

        return user;
    }
}
