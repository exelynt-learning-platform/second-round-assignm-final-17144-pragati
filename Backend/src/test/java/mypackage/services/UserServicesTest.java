package mypackage.services;

import mypackage.config.JwtUtil;
import mypackage.dto.AuthResponse;
import mypackage.dto.LoginRequest;
import mypackage.dto.RegisterRequest;
import mypackage.entity.User;
import mypackage.exception.BadRequestException;
import mypackage.repository.ICartRepository;
import mypackage.repository.IUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServicesTest {

    @InjectMocks
    private UserServices userServices;

    @Mock
    private IUserRepository userRepository;

    @Mock
    private ICartRepository cartRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        RegisterRequest request = new RegisterRequest("Test User", "test@test.com", "password", "1234567890");

        when(userRepository.existsByEmailAddress("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setUser_id(1);
        savedUser.setEmail_address("test@test.com");
        savedUser.setRole(User.Role.USER);
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken("test@test.com", "USER")).thenReturn("jwt-token");

        AuthResponse response = userServices.RegisterUser(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("Test User", "test@test.com", "password", "123456");

        when(userRepository.existsByEmailAddress("test@test.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userServices.RegisterUser(request));
    }

    @Test
    void testLoginUser_Success() {
        LoginRequest request = new LoginRequest("test@test.com", "password");

        User user = new User();
        user.setEmail_address("test@test.com");
        user.setRole(User.Role.USER);

        when(userRepository.findByEmailAddress("test@test.com")).thenReturn(user);
        when(jwtUtil.generateToken("test@test.com", "USER")).thenReturn("jwt-token");

        AuthResponse response = userServices.LoginUser(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
    }
}
