package mypackage.services;

import mypackage.dto.OrderRequest;
import mypackage.entity.*;
import mypackage.exception.BadRequestException;
import mypackage.exception.ResourceNotFoundException;
import mypackage.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServices {

    @Autowired
    private IOrderRepository iOrderRepository;

    @Autowired
    private IOrderItemRepository iOrderItemRepository;

    @Autowired
    private ICartRepository iCartRepository;

    @Autowired
    private ICartItemRepository iCartItemRepository;

    @Autowired
    private IProductRepository iProductRepository;

    @Transactional
    public Order CreateOrderFromCart(User user, OrderRequest request) {
        Cart cart = iCartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user."));

        List<CartItem> cartItems = iCartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty. Add products before placing an order.");
        }

        for (CartItem item : cartItems) {
            if (item.getProduct().getStock_quantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + item.getProduct().getProduct_name());
            }
        }

        Order order = new Order();
        order.setUser(user);
        
        // Calculate total amount
        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        
        if (totalAmount < 50.0) {
            throw new BadRequestException("Payment session creation failed: Minimum order value for payment is ₹50. Please add more items to your cart.");
        }
        
        order.setTotal_amount(totalAmount);
        order.setOrder_status(Order.OrderStatus.PENDING);
        order.setPayment_status(Order.PaymentStatus.PENDING);
        order.setOrder_date(LocalDateTime.now());
        order.setShipping_address(request.getShipping_address());
        Order savedOrder = iOrderRepository.save(order);

        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice_at_purchase(item.getProduct().getPrice());
            iOrderItemRepository.save(orderItem);

            // Deduct stock
            Product product = item.getProduct();
            product.setStock_quantity(product.getStock_quantity() - item.getQuantity());
            iProductRepository.save(product);
        }

        // Clear cart after order
        iCartItemRepository.deleteByCart(cart);

        return savedOrder;
    }

    public List<Order> GetUserOrders(User user) {
        return iOrderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public List<Order> GetAllOrders() {
        return iOrderRepository.findAll();
    }

    public Order GetOrderById(int orderId) {
        return iOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
    }

    public List<OrderItem> GetOrderItems(int orderId) {
        Order order = GetOrderById(orderId);
        return iOrderItemRepository.findByOrder(order);
    }

    public Order UpdatePaymentStatus(int orderId, String paymentIntentId) {
        Order order = GetOrderById(orderId);
        order.setPayment_status(Order.PaymentStatus.PAID);
        order.setOrder_status(Order.OrderStatus.CONFIRMED);
        order.setPayment_intent_id(paymentIntentId);
        return iOrderRepository.save(order);
    }

    public Order UpdateOrderStatus(int orderId, String status) {
        Order order = GetOrderById(orderId);
        try {
            order.setOrder_status(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }
        return iOrderRepository.save(order);
    }
}
