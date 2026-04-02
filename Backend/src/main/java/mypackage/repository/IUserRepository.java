package mypackage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mypackage.entity.User;

public interface IUserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT u FROM User u WHERE LOWER(u.email_address) = LOWER(:email)")
    User findByEmailAddress(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(u.email_address) = LOWER(:email)")
    boolean existsByEmailAddress(@Param("email") String email);
}
