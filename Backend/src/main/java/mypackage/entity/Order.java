package mypackage.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblorder")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int order_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private double total_amount;

    @Enumerated(EnumType.STRING)
    private OrderStatus order_status;

    @Enumerated(EnumType.STRING)
    private PaymentStatus payment_status;

    private String payment_intent_id;

    private LocalDateTime order_date;

    private String shipping_address;

    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    }

    public enum PaymentStatus {
        PENDING, PAID, FAILED
    }

    public Order() {
        super();
    }

    public Order(int order_id, User user, double total_amount, OrderStatus order_status,
                 PaymentStatus payment_status, String payment_intent_id,
                 LocalDateTime order_date, String shipping_address) {
        super();
        this.order_id = order_id;
        this.user = user;
        this.total_amount = total_amount;
        this.order_status = order_status;
        this.payment_status = payment_status;
        this.payment_intent_id = payment_intent_id;
        this.order_date = order_date;
        this.shipping_address = shipping_address;
    }

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getTotal_amount() {
        return total_amount;
    }

    public void setTotal_amount(double total_amount) {
        this.total_amount = total_amount;
    }

    public OrderStatus getOrder_status() {
        return order_status;
    }

    public void setOrder_status(OrderStatus order_status) {
        this.order_status = order_status;
    }

    public PaymentStatus getPayment_status() {
        return payment_status;
    }

    public void setPayment_status(PaymentStatus payment_status) {
        this.payment_status = payment_status;
    }

    public String getPayment_intent_id() {
        return payment_intent_id;
    }

    public void setPayment_intent_id(String payment_intent_id) {
        this.payment_intent_id = payment_intent_id;
    }

    public LocalDateTime getOrder_date() {
        return order_date;
    }

    public void setOrder_date(LocalDateTime order_date) {
        this.order_date = order_date;
    }

    public String getShipping_address() {
        return shipping_address;
    }

    public void setShipping_address(String shipping_address) {
        this.shipping_address = shipping_address;
    }
}
