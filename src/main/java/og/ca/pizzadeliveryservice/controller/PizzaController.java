package og.ca.pizzadeliveryservice.controller;

import lombok.AllArgsConstructor;
import og.ca.pizzadeliveryservice.model.PizzaCreateRequest;
import og.ca.pizzadeliveryservice.model.PizzaDTO;
import og.ca.pizzadeliveryservice.model.Type;
import og.ca.pizzadeliveryservice.service.PizzaService;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/api/pizza")
public class PizzaController {

    private final PizzaService pizzaService;

    @GetMapping("/menu")
    public Set<Type> getAll() {
        return pizzaService.findAll().stream().map(PizzaDTO::type).collect(Collectors.toSet());
    }

    @GetMapping("/{id}")
    public PizzaDTO getPizzaById(@PathVariable Long id) {
        return pizzaService.findById(id);
    }

    @PostMapping("/create")
    public PizzaDTO create(@RequestBody PizzaCreateRequest request) {
        return pizzaService.create(request);
    }

    @PutMapping("/{id}")
    public PizzaDTO update(@PathVariable Long id, @RequestBody PizzaCreateRequest request) {
        return pizzaService.update(id, request);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id) {
        pizzaService.deleteById(id);
    }
}
