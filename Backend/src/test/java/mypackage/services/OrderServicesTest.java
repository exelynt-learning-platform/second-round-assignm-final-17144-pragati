package mypackage.services;

import mypackage.dto.OrderRequest;
import mypackage.entity.Cart;
import mypackage.entity.CartItem;
import mypackage.entity.Order;
import mypackage.entity.Product;
import mypackage.entity.User;
import mypackage.exception.BadRequestException;
import mypackage.repository.ICartItemRepository;
import mypackage.repository.ICartRepository;
import mypackage.repository.IOrderItemRepository;
import mypackage.repository.IOrderRepository;
import mypackage.repository.IProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServicesTest {

    @InjectMocks
    private OrderServices orderServices;

    @Mock
    private IOrderRepository orderRepository;

    @Mock
    private IOrderItemRepository orderItemRepository;

    @Mock
    private ICartRepository cartRepository;

    @Mock
    private ICartItemRepository cartItemRepository;

    @Mock
    private IProductRepository productRepository;

    private User testUser;
    private Cart testCart;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setUser_id(1);

        testCart = new Cart();
        testCart.setCart_id(1);
        testCart.setUser(testUser);

        testProduct = new Product();
        testProduct.setProduct_id(101);
        testProduct.setPrice(100.0);
        testProduct.setStock_quantity(5);
    }

    @Test
    void testCreateOrderFromCart_EmptyCart() {
        OrderRequest request = new OrderRequest("123 Main St");

        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCart(testCart)).thenReturn(new ArrayList<>());

        assertThrows(BadRequestException.class, () -> orderServices.CreateOrderFromCart(testUser, request));
    }

    @Test
    void testCreateOrderFromCart_Success() {
        OrderRequest request = new OrderRequest("123 Main St");

        CartItem item = new CartItem(1, testCart, testProduct, 2);
        List<CartItem> cartItems = Arrays.asList(item);

        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCart(testCart)).thenReturn(cartItems);

        Order savedOrder = new Order();
        savedOrder.setOrder_id(50);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);
        
        Order result = orderServices.CreateOrderFromCart(testUser, request);

        assertNotNull(result);
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(cartItemRepository, times(1)).deleteByCart(testCart);
        assertEquals(3, item.getProduct().getStock_quantity()); // 5 - 2 = 3
    }
}
