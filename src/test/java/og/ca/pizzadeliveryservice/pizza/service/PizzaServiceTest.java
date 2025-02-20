package og.ca.pizzadeliveryservice.pizza.service;

import og.ca.pizzadeliveryservice.TestBase;
import og.ca.pizzadeliveryservice.order.model.Order;
import og.ca.pizzadeliveryservice.order.model.OrderStatus;
import og.ca.pizzadeliveryservice.pizza.model.*;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static og.ca.pizzadeliveryservice.helper.CommonsHelper.*;
import static org.assertj.core.api.BDDAssertions.then;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class PizzaServiceTest extends TestBase {

    @Test
    void should_return_all_pizzas() {
        //given
        var pizzas = List.of(givenPizza());
        when(pizzaRepository.findAll()).thenReturn(pizzas);

        //when
        var pizzaDTOs = pizzaService.findAll();

        //then
        then(pizzaDTOs).isNotEmpty();
        then(pizzaDTOs).hasSize(1);
        verify(pizzaRepository, times(1)).findAll();
    }

    @Test
    void should_create_pizza() {
        //given
        when(pizzaRepository.save(any(Pizza.class))).thenReturn(givenPizza());

        //when
        var pizzaDTO = pizzaService.create(givenPizzaCreateRequest());

        //then
        then(pizzaDTO).isNotNull();
        then(pizzaDTO.type().name()).isEqualTo(MARGHERITA);
        then(pizzaDTO.size().name()).isEqualTo(LARGE);
        verify(pizzaRepository, times(1)).save(any(Pizza.class));
    }

    @Test
    void should_find_pizza_if_exists() {
        //given
        when(pizzaRepository.findById(PIZZA_ID)).thenReturn(Optional.of(givenPizza()));

        //when
        var pizzaDTO = pizzaService.findById(PIZZA_ID);

        //then
        then(pizzaDTO).isNotNull();
        then(pizzaDTO.id()).isEqualTo(PIZZA_ID);
        verify(pizzaRepository, times(1)).findById(PIZZA_ID);
    }

    @Test
    void should_update_pizza() {
        //given
        when(pizzaRepository.findById(PIZZA_ID)).thenReturn(Optional.of(givenPizza()));
        when(pizzaRepository.save(any(Pizza.class))).thenReturn(givenUpdatedPizza());

        //when
        var pizzaDTO = pizzaService.update(PIZZA_ID, givenPizzaUpdateRequest());

        //then
        then(pizzaDTO).isNotNull();
        then(pizzaDTO.type().name()).isEqualTo(MARGHERITA);
        then(pizzaDTO.size().name()).isEqualTo(MEDIUM);
        verify(pizzaRepository, times(1)).findById(PIZZA_ID);
        verify(pizzaRepository, times(1)).save(any(Pizza.class));
    }

    @Test
    void should_delete_pizza() {
        //given
        doNothing().when(pizzaRepository).deleteById(PIZZA_ID);

        //when
        pizzaService.deleteById(PIZZA_ID);

        //then
        verify(pizzaRepository, times(1)).deleteById(PIZZA_ID);
    }

    @Test
    void should_throw_if_db_connection_lost() {
        //given
        when(pizzaRepository.save(any(Pizza.class))).thenThrow(new RuntimeException("Database error"));

        //then
        var exception = assertThrows(RuntimeException.class, () -> pizzaService.create(givenPizzaCreateRequest()));
        then(exception.getMessage()).isEqualTo("There was a problem creating your pizza.");
    }

    @Test
    void should_throw_if_pizza_not_found() {
        //given
        when(pizzaRepository.findById(PIZZA_ID)).thenReturn(Optional.empty());

        //then
        var exception = assertThrows(RuntimeException.class, () -> pizzaService.findById(PIZZA_ID));
        then(exception.getMessage()).isEqualTo("Pizza not found with id: 1");
    }

    @Test
    void should_throw_if_pizza_to_update_not_found() {
        //given
        when(pizzaRepository.findById(PIZZA_ID)).thenReturn(Optional.empty());

        //then
        var exception = assertThrows(IllegalArgumentException.class, () -> pizzaService.update(PIZZA_ID, givenPizzaCreateRequest()));
        then(exception.getMessage()).isEqualTo("Pizza not found with id: " + PIZZA_ID);
    }

    private Order givenEmptyOrder() {
        var order = new Order();
        order.setCustomerName("John Doe");
        order.setAddress("F. Račkog 199");
        order.setStatus(OrderStatus.PENDING);
        order.setPizzas(List.of());

        return order;
    }

    private Pizza givenPizza() {
        var pizza = new Pizza();
        pizza.setId(PIZZA_ID);
        pizza.setType(Type.MARGHERITA);
        pizza.setSize(Size.LARGE);
        pizza.setToppings(List.of(Topping.CHEESE, Topping.PEPPER));
        pizza.setExtras(List.of(Extras.CHEESE));
        pizza.setQuantity(1);
        pizza.setOrder(givenEmptyOrder());

        return pizza;
    }

    private Pizza givenUpdatedPizza() {
        var pizza = givenPizza();
        pizza.setSize(Size.MEDIUM);
        pizza.setToppings(List.of());
        pizza.setExtras(List.of());
        pizza.setQuantity(5);

        return pizza;
    }

    private PizzaCreateRequest givenPizzaCreateRequest() {
        return new PizzaCreateRequest(
                Type.MARGHERITA,
                Size.LARGE,
                List.of(Topping.CHEESE, Topping.PEPPER),
                List.of(Extras.CHEESE),
                1,
                givenEmptyOrder());
    }

    private PizzaCreateRequest givenPizzaUpdateRequest() {
        return new PizzaCreateRequest(
                Type.MARGHERITA,
                Size.MEDIUM,
                List.of(),
                List.of(),
                5,
                givenEmptyOrder()
        );
    }
}
