package mypackage.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String product_name;

    private String description;

    @NotNull(message = "Price is required")
    private double price;

    @Min(value = 0, message = "Stock cannot be negative")
    private int stock_quantity;

    private String category;

    public ProductRequest() {
        super();
    }

    public ProductRequest(String product_name, String description, double price, int stock_quantity, String category) {
        super();
        this.product_name = product_name;
        this.description = description;
        this.price = price;
        this.stock_quantity = stock_quantity;
        this.category = category;
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
}
