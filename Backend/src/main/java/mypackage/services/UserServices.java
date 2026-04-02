package mypackage.services;

import mypackage.config.JwtUtil;
import mypackage.dto.AuthResponse;
import mypackage.dto.LoginRequest;
import mypackage.dto.RegisterRequest;
import mypackage.entity.Cart;
import mypackage.entity.User;
import mypackage.exception.BadRequestException;
import mypackage.exception.ResourceNotFoundException;
import mypackage.repository.ICartRepository;
import mypackage.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServices {

    @Autowired
    private IUserRepository iUserRepository;

    @Autowired
    private ICartRepository iCartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse RegisterUser(RegisterRequest request) {
        if (iUserRepository.existsByEmailAddress(request.getEmail_address())) {
            throw new BadRequestException("Email already registered. Please login.");
        }

        User user = new User();
        user.setUser_name(request.getUser_name());
        user.setEmail_address(request.getEmail_address());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile_no(request.getMobile_no());
        user.setRole(User.Role.USER);

        User savedUser = iUserRepository.save(user);

        // Create cart for the user
        Cart cart = new Cart();
        cart.setUser(savedUser);
        iCartRepository.save(cart);

        String token = jwtUtil.generateToken(savedUser.getEmail_address(), savedUser.getRole().name());
        return new AuthResponse(token, savedUser.getUser_id(), savedUser.getUser_name(),
                savedUser.getEmail_address(), savedUser.getRole().name());
    }

    public AuthResponse LoginUser(LoginRequest request) {
        User user = iUserRepository.findByEmailAddress(request.getEmail_address());

        if (user == null) {
            throw new ResourceNotFoundException("No account found with this email.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(user.getEmail_address(), user.getRole().name());
        return new AuthResponse(token, user.getUser_id(), user.getUser_name(),
                user.getEmail_address(), user.getRole().name());
    }

    public User GetCurrentUser(String email) {
        User user = iUserRepository.findByEmailAddress(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found.");
        }
        return user;
    }
}
