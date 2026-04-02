package mypackage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mypackage.entity.Order;
import mypackage.entity.OrderItem;
import java.util.List;

public interface IOrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(Order order);
}
