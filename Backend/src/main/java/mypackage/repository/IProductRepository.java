package mypackage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mypackage.entity.Product;
import java.util.List;

public interface IProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category)")
    List<Product> findByCategory(@Param("category") String category);

    @Query("SELECT p FROM Product p WHERE LOWER(p.product_name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByProductNameContaining(@Param("name") String name);
}
