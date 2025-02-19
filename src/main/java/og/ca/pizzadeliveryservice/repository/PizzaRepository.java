package og.ca.pizzadeliveryservice.repository;

import og.ca.pizzadeliveryservice.model.Pizza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PizzaRepository extends JpaRepository<Pizza,Long> {

    @Query("SELECT p FROM Pizza p WHERE p.order.id = :orderId")
    List<Pizza> findByOrderId(Long orderId);
}
