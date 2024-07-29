package com.joshualukelacsamana.banking.appuser;

import com.joshualukelacsamana.banking.AccountData.AccountData;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
// This is the main class that represents the user of the application
// AccountData, CreditCard, and Transactions will reference this class through DBRef in MongoDB to establish a relationship
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Document(collection = "User_Info")
public class AppUser implements UserDetails, Serializable {

    @Id
    private String id;

    private String name;
    private String username;
    private String email;
    private String password;
    private String role;
    private Boolean locked;
    private Boolean enabled;
    private Boolean isLogged;

    // Reference to the AccountData
    @DBRef
    private List<AccountData> accountDataList;

    public AppUser(String name, String username, String email, String password, String role, Boolean locked, Boolean enabled) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.locked = locked;
        this.enabled = enabled;
    }



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }


}
