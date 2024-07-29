package com.joshualukelacsamana.banking.AccountData;

import com.joshualukelacsamana.banking.appuser.AppUser;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Random;

// This class represents the account data of a user
@Getter
@Setter
@Document(collection = "bankingInfo")
public class AccountData {
    @Id
    private String id;
    private String accountNumber;
    private String accountType;
    private String accountHolderName;
    private double balance;
    private String currency;
    private String creationDate;
    // Reference to the user who owns this account
    @DBRef
    private AppUser appUser;

    public AccountData(String accountType, String accountHolderName, double balance, String currency, AppUser appUser) {
        this.accountNumber = generateRandomAccountNumber();
        this.accountType = accountType;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
        this.currency = currency;
        this.appUser = appUser;
        this.creationDate = LocalDateTime.now().toString();
    }

    // A random account number generator that will be called in the constructor
    private String generateRandomAccountNumber() {
        // Generate a random 8-digit account number
        Random random = new Random();
        int min = 10000000; // 8 digits minimum
        int max = 99999999; // 8 digits maximum
        int randomNumber = random.nextInt(max - min + 1) + min;
        return Integer.toString(randomNumber);
    }
}
