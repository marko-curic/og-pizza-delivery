package og.ca.pizzadeliveryservice.repository;

import og.ca.pizzadeliveryservice.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdersRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE o.customerName = :username AND o.status = 'DRAFT'")
    Order findDraftByUsername(String username);
}
