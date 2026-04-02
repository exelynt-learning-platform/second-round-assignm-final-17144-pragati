package mypackage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mypackage.entity.Order;
import mypackage.entity.User;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IOrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE o.user = :user ORDER BY o.order_date DESC")
    List<Order> findByUserOrderByOrderDateDesc(@Param("user") User user);
}
