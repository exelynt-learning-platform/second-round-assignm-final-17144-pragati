package mypackage.services;

import mypackage.dto.CartItemRequest;
import mypackage.entity.Cart;
import mypackage.entity.CartItem;
import mypackage.entity.Product;
import mypackage.entity.User;
import mypackage.exception.BadRequestException;
import mypackage.repository.ICartItemRepository;
import mypackage.repository.ICartRepository;
import mypackage.repository.IProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CartServicesTest {

    @InjectMocks
    private CartServices cartServices;

    @Mock
    private ICartRepository cartRepository;

    @Mock
    private ICartItemRepository cartItemRepository;

    @Mock
    private IProductRepository productRepository;

    private User testUser;
    private Product testProduct;
    private Cart testCart;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUser = new User();
        testUser.setUser_id(1);

        testProduct = new Product();
        testProduct.setProduct_id(101);
        testProduct.setStock_quantity(10);
        testProduct.setPrice(50.0);

        testCart = new Cart();
        testCart.setCart_id(1);
        testCart.setUser(testUser);
    }

    @Test
    void testAddToCart_ProductNotFound() {
        CartItemRequest request = new CartItemRequest(999, 1);
        when(productRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(mypackage.exception.ResourceNotFoundException.class, () -> cartServices.AddToCart(testUser, request));
    }

    @Test
    void testAddToCart_InsufficientStock() {
        CartItemRequest request = new CartItemRequest(101, 15);
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));

        assertThrows(BadRequestException.class, () -> cartServices.AddToCart(testUser, request));
    }

    @Test
    void testAddToCart_SuccessNewItem() {
        CartItemRequest request = new CartItemRequest(101, 2);
        
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartAndProduct(testCart, testProduct)).thenReturn(Optional.empty());

        CartItem savedItem = new CartItem();
        savedItem.setCart(testCart);
        savedItem.setProduct(testProduct);
        savedItem.setQuantity(2);
        
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(savedItem);

        CartItem result = cartServices.AddToCart(testUser, request);

        assertNotNull(result);
        assertEquals(2, result.getQuantity());
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }
}
