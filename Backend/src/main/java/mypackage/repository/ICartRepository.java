package mypackage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mypackage.entity.Cart;
import mypackage.entity.User;
import java.util.Optional;

public interface ICartRepository extends JpaRepository<Cart, Integer> {

    Optional<Cart> findByUser(User user);
}
