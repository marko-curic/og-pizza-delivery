package og.ca.pizzadeliveryservice.order.controller;

import lombok.AllArgsConstructor;
import og.ca.pizzadeliveryservice.order.model.OrderDTO;
import og.ca.pizzadeliveryservice.order.model.OrderDraftRequest;
import og.ca.pizzadeliveryservice.order.model.OrderStatus;
import og.ca.pizzadeliveryservice.order.service.OrderingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private final OrderingService orderingService;

    @GetMapping("/allOrders")
    public List<OrderDTO> getAll() {
        return orderingService.getAll();
    }

    @GetMapping("/sales")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<OrderDTO> getCompletedOrders() {
        return orderingService.getAll().stream()
                .filter(order -> order.status() == OrderStatus.COMPLETED).toList();
    }

    @GetMapping("/{username}/draft")
    public OrderDTO getDraftForUser(@PathVariable String username) {
        return orderingService.findDraftOrderForUser(username);
    }

    @PostMapping("/draft")
    public OrderDTO draft(@RequestBody OrderDraftRequest request) {
        return orderingService.createDraftOrder(request);
    }

    @PostMapping("/{id}/submit")
    public OrderDTO submit(@PathVariable Long id) {
        return orderingService.submitOrder(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderingService.deleteById(id);
        return ResponseEntity.ok("Order deleted successfully");
    }


    @PutMapping("/{id}/status/update")
    public void updateStatus(@PathVariable Long id, @RequestBody OrderStatus status) {
        orderingService.updateOrderStatus(id, status);
    }
}
