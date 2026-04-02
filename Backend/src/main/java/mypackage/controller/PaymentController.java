package mypackage.controller;

import mypackage.dto.ApiResponse;
import mypackage.entity.Order;
import mypackage.entity.User;
import mypackage.services.OrderServices;
import mypackage.services.PaymentServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT,RequestMethod.DELETE},allowedHeaders = "*")
public class PaymentController {

    @Autowired
    PaymentServices paymentServices;

    @Autowired
    OrderServices orderServices;

    @PostMapping("/create-session/{orderId}")
    public ResponseEntity<ApiResponse> CreatePaymentSession(
            @PathVariable int orderId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        Order order = orderServices.GetOrderById(orderId);
        Map<String, String> session = paymentServices.CreatePaymentSession(order);
        return ResponseEntity.ok(new ApiResponse(true, "Payment session created.", session));
    }

    @PostMapping("/success/{orderId}")
    public ResponseEntity<ApiResponse> PaymentSuccess(
            @PathVariable int orderId,
            @RequestParam String paymentIntentId
    ) {
        Order order = orderServices.UpdatePaymentStatus(orderId, paymentIntentId);
        return ResponseEntity.ok(new ApiResponse(true, "Payment successful. Order confirmed.", order));
    }

    @PostMapping("/failure/{orderId}")
    public ResponseEntity<ApiResponse> PaymentFailure(@PathVariable int orderId) {
        Order order = orderServices.GetOrderById(orderId);
        return ResponseEntity.ok(new ApiResponse(false, "Payment failed. Please try again.", order));
    }
}
