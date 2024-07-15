package com.joshualukelacsamana.banking.Login;


import com.joshualukelacsamana.banking.appuser.AppUser;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoginResponse {

    private AppUser appUser;
    private String message;
    private String token;

    public LoginResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

}
