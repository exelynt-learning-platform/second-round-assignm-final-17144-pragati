package mypackage.controller;

import jakarta.validation.Valid;
import mypackage.dto.AuthResponse;
import mypackage.dto.LoginRequest;
import mypackage.dto.RegisterRequest;
import mypackage.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*" ,methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT,RequestMethod.DELETE},allowedHeaders = "*")
public class AuthController {

    @Autowired
    UserServices userServices;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> Register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userServices.RegisterUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> Login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userServices.LoginUser(request);
        return ResponseEntity.ok(response);
    }
}
