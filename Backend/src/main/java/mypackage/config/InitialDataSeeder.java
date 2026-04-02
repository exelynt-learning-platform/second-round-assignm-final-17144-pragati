package mypackage.config;

import mypackage.entity.User;
import mypackage.repository.ICartRepository;
import mypackage.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class InitialDataSeeder implements CommandLineRunner {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ICartRepository cartRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Admin
            User admin = new User();
            admin.setUser_name("Admin User");
            admin.setEmail_address("admin@shopease.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setMobile_no("9876543210");
            userRepository.save(admin);

            // Create Test User
            User user = new User();
            user.setUser_name("Test User");
            user.setEmail_address("user@shopease.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(User.Role.USER);
            user.setMobile_no("9123456780");
            userRepository.save(user);

            System.out.println("Default users seeded: admin@shopease.com / user@shopease.com");
        }
    }
}
