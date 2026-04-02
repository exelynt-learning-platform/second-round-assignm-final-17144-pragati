package mypackage.dto;

public class OrderRequest {

    private String shipping_address;

    public OrderRequest() {
        super();
    }

    public OrderRequest(String shipping_address) {
        super();
        this.shipping_address = shipping_address;
    }

    public String getShipping_address() {
        return shipping_address;
    }

    public void setShipping_address(String shipping_address) {
        this.shipping_address = shipping_address;
    }
}
