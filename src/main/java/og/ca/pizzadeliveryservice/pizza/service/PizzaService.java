package og.ca.pizzadeliveryservice.pizza.service;


import lombok.AllArgsConstructor;
import og.ca.pizzadeliveryservice.pizza.model.Pizza;
import og.ca.pizzadeliveryservice.pizza.model.PizzaCreateRequest;
import og.ca.pizzadeliveryservice.pizza.model.PizzaDTO;
import og.ca.pizzadeliveryservice.pizza.persistance.PizzaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PizzaService {

    private final PizzaRepository pizzaRepository;

    public List<PizzaDTO> findAll() {
        return pizzaRepository.findAll().stream().map(Pizza::mapToDTO).toList();
    }

    public PizzaDTO create(PizzaCreateRequest request) {
        var pizza = new Pizza();
        pizza.setType(request.type());
        pizza.setSize(request.size());
        pizza.setToppings(request.toppings());
        pizza.setExtras(request.extras());
        pizza.setOrder(request.order());
        pizza.setQuantity(request.quantity());
        try {
            return pizzaRepository.save(pizza).mapToDTO();
        } catch (Exception e) {
            throw new RuntimeException("There was a problem creating your pizza.");
        }
    }

    public PizzaDTO findById(Long id) {
        return pizzaRepository.findById(id)
                .map(Pizza::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Pizza not found with id: " + id));
    }

    public PizzaDTO update(Long id, PizzaCreateRequest request) {
        var pizza = pizzaRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Pizza not found with id: " + id));
        pizza.setSize(request.size());
        pizza.setQuantity(request.quantity());
        pizza.setToppings(request.toppings());
        pizza.setExtras(request.extras());
        try {
            return pizzaRepository.save(pizza).mapToDTO();
        } catch (Exception e) {
            throw new RuntimeException("There was a problem updating your pizza.");
        }
    }

    public void deleteById(Long id) {
        pizzaRepository.deleteById(id);
    }

}
