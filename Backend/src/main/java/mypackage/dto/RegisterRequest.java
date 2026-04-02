package mypackage.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String user_name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email_address;

    @NotBlank(message = "Password is required")
    private String password;

    private String mobile_no;

    public RegisterRequest() {
        super();
    }

    public RegisterRequest(String user_name, String email_address, String password, String mobile_no) {
        super();
        this.user_name = user_name;
        this.email_address = email_address;
        this.password = password;
        this.mobile_no = mobile_no;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getEmail_address() {
        return email_address;
    }

    public void setEmail_address(String email_address) {
        this.email_address = email_address;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMobile_no() {
        return mobile_no;
    }

    public void setMobile_no(String mobile_no) {
        this.mobile_no = mobile_no;
    }
}
