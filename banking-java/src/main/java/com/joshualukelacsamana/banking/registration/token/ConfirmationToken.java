package com.joshualukelacsamana.banking.registration.token;
import com.joshualukelacsamana.banking.appuser.AppUser;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "Token")
public class ConfirmationToken {
    @Id
    private String id; // Changed to String to handle UUIDs

    @Field(name = "token")
    private String token;

    @Field(name = "created_at")
    private LocalDateTime createdAt;

    @Field(name = "expires_at")
    private LocalDateTime expiredAt;

    @Field(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    private AppUser appUser;

    public ConfirmationToken(String token, LocalDateTime createdAt, LocalDateTime expiredAt, AppUser appUser) {
        this.token = token;
        this.createdAt = createdAt;
        this.expiredAt = expiredAt;
        this.appUser = appUser;
    }

    // Method to generate a new token
    public static ConfirmationToken generateToken(AppUser appUser) {
        String token = UUID.randomUUID().toString(); // UUID stands for Universally Unique Identifier
        LocalDateTime now = LocalDateTime.now(); // retrieve the local date and time
        LocalDateTime expiry = now.plusMinutes(15); // Token valid for 15 minutes

        return new ConfirmationToken(token, now, expiry, appUser);
    }

    // Method to check if the token is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiredAt);
    }

    // Method to check if the token is confirmed
    public boolean isConfirmed() {
        return this.confirmedAt != null;
    }

    // Method to confirm the token
    public void confirm() {
        this.confirmedAt = LocalDateTime.now();
    }
}
