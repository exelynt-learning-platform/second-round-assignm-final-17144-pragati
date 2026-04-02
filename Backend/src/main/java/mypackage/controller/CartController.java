package mypackage.controller;

import mypackage.dto.ApiResponse;
import mypackage.dto.CartItemRequest;
import mypackage.entity.CartItem;
import mypackage.entity.User;
import mypackage.services.CartServices;
import mypackage.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT,RequestMethod.DELETE},allowedHeaders = "*")
public class CartController {

    @Autowired
    CartServices cartServices;

    @Autowired
    UserServices userServices;

    @GetMapping
    public ResponseEntity<ApiResponse> GetCart(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CartItem> cartItems = cartServices.GetUserCart(user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart fetched successfully.", cartItems));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> AddToCart(@RequestBody CartItemRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CartItem cartItem = cartServices.AddToCart(user, request);
        return ResponseEntity.ok(new ApiResponse(true, "Product added to cart.", cartItem));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ApiResponse> UpdateCartItem(
            @PathVariable int cartItemId,
            @RequestParam int quantity,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        CartItem cartItem = cartServices.UpdateCartItem(user, cartItemId, quantity);
        return ResponseEntity.ok(new ApiResponse(true, "Cart item updated.", cartItem));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse> RemoveFromCart(@PathVariable int cartItemId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        cartServices.RemoveFromCart(user, cartItemId);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart.", null));
    }
}
