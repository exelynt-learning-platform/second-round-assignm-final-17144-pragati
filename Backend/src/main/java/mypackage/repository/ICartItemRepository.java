package mypackage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mypackage.entity.Cart;
import mypackage.entity.CartItem;
import mypackage.entity.Product;
import java.util.List;
import java.util.Optional;

public interface ICartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByCart(Cart cart);

    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    void deleteByCart(Cart cart);
}
