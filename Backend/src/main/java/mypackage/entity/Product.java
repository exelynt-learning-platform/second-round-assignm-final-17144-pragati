package mypackage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "tblproduct")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int product_id;

    @NotBlank(message = "Product name is required")
    private String product_name;

    private String description;

    @NotNull(message = "Price is required")
    private double price;

    @Min(value = 0, message = "Stock cannot be negative")
    private int stock_quantity;

    private String category;

    private String product_image;

    public Product() {
        super();
    }

    public Product(int product_id, String product_name, String description, double price,
                   int stock_quantity, String category, String product_image) {
        super();
        this.product_id = product_id;
        this.product_name = product_name;
        this.description = description;
        this.price = price;
        this.stock_quantity = stock_quantity;
        this.category = category;
        this.product_image = product_image;
    }

    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock_quantity() {
        return stock_quantity;
    }

    public void setStock_quantity(int stock_quantity) {
        this.stock_quantity = stock_quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProduct_image() {
        return product_image;
    }

    public void setProduct_image(String product_image) {
        this.product_image = product_image;
    }
}
