package mypackage.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblcart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cart_id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    public Cart() {
        super();
    }

    public Cart(int cart_id, User user) {
        super();
        this.cart_id = cart_id;
        this.user = user;
    }

    public int getCart_id() {
        return cart_id;
    }

    public void setCart_id(int cart_id) {
        this.cart_id = cart_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
