package mypackage.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblorder_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int order_item_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    private double price_at_purchase;

    public OrderItem() {
        super();
    }

    public OrderItem(int order_item_id, Order order, Product product, int quantity, double price_at_purchase) {
        super();
        this.order_item_id = order_item_id;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.price_at_purchase = price_at_purchase;
    }

    public int getOrder_item_id() {
        return order_item_id;
    }

    public void setOrder_item_id(int order_item_id) {
        this.order_item_id = order_item_id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice_at_purchase() {
        return price_at_purchase;
    }

    public void setPrice_at_purchase(double price_at_purchase) {
        this.price_at_purchase = price_at_purchase;
    }
}
