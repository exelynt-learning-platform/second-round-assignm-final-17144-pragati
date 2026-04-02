package mypackage.dto;

public class AuthResponse {

    private String token;
    private int user_id;
    private String user_name;
    private String email_address;
    private String role;

    public AuthResponse() {
        super();
    }

    public AuthResponse(String token, int user_id, String user_name, String email_address, String role) {
        super();
        this.token = token;
        this.user_id = user_id;
        this.user_name = user_name;
        this.email_address = email_address;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
