package mypackage.controller;

import mypackage.dto.ApiResponse;
import mypackage.dto.OrderRequest;
import mypackage.entity.Order;
import mypackage.entity.OrderItem;
import mypackage.entity.User;
import mypackage.services.OrderServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT,RequestMethod.DELETE},allowedHeaders = "*")
public class OrderController {

    @Autowired
    OrderServices orderServices;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> CreateOrder(@RequestBody OrderRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Order order = orderServices.CreateOrderFromCart(user, request);
        return ResponseEntity.ok(new ApiResponse(true, "Order placed successfully.", order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse> GetMyOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Order> orders = orderServices.GetUserOrders(user);
        return ResponseEntity.ok(new ApiResponse(true, "Orders fetched successfully.", orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse> GetOrderById(@PathVariable int orderId) {
        Order order = orderServices.GetOrderById(orderId);
        return ResponseEntity.ok(new ApiResponse(true, "Order fetched successfully.", order));
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<ApiResponse> GetOrderItems(@PathVariable int orderId) {
        List<OrderItem> items = orderServices.GetOrderItems(orderId);
        return ResponseEntity.ok(new ApiResponse(true, "Order items fetched.", items));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> GetAllOrders() {
        List<Order> orders = orderServices.GetAllOrders();
        return ResponseEntity.ok(new ApiResponse(true, "All orders fetched.", orders));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse> UpdateOrderStatus(@PathVariable int orderId, @RequestParam String status) {
        Order order = orderServices.UpdateOrderStatus(orderId, status);
        return ResponseEntity.ok(new ApiResponse(true, "Order status updated.", order));
    }
}
