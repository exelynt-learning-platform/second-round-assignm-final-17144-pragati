package mypackage.services;

import mypackage.dto.CartItemRequest;
import mypackage.entity.Cart;
import mypackage.entity.CartItem;
import mypackage.entity.Product;
import mypackage.entity.User;
import mypackage.exception.BadRequestException;
import mypackage.exception.ResourceNotFoundException;
import mypackage.repository.ICartItemRepository;
import mypackage.repository.ICartRepository;
import mypackage.repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartServices {

    @Autowired
    private ICartRepository iCartRepository;

    @Autowired
    private ICartItemRepository iCartItemRepository;

    @Autowired
    private IProductRepository iProductRepository;

    public Cart GetOrCreateCart(User user) {
        Optional<Cart> existingCart = iCartRepository.findByUser(user);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        Cart cart = new Cart();
        cart.setUser(user);
        return iCartRepository.save(cart);
    }

    public CartItem AddToCart(User user, CartItemRequest request) {
        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be at least 1.");
        }

        Product product = iProductRepository.findById(request.getProduct_id())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProduct_id()));

        if (product.getStock_quantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock_quantity());
        }

        Cart cart = GetOrCreateCart(user);

        Optional<CartItem> existingItem = iCartItemRepository.findByCartAndProduct(cart, product);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return iCartItemRepository.save(item);
        }

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        return iCartItemRepository.save(cartItem);
    }

    public CartItem UpdateCartItem(User user, int cartItemId, int quantity) {
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be at least 1.");
        }

        CartItem cartItem = iCartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (cartItem.getCart().getUser().getUser_id() != user.getUser_id()) {
            throw new BadRequestException("Unauthorized action.");
        }

        if (cartItem.getProduct().getStock_quantity() < quantity) {
            throw new BadRequestException("Insufficient stock. Available: " + cartItem.getProduct().getStock_quantity());
        }

        cartItem.setQuantity(quantity);
        return iCartItemRepository.save(cartItem);
    }

    @Transactional
    public void RemoveFromCart(User user, int cartItemId) {
        CartItem cartItem = iCartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (cartItem.getCart().getUser().getUser_id() != user.getUser_id()) {
            throw new BadRequestException("Unauthorized action.");
        }

        iCartItemRepository.delete(cartItem);
    }

    public List<CartItem> GetUserCart(User user) {
        Cart cart = GetOrCreateCart(user);
        return iCartItemRepository.findByCart(cart);
    }
}
