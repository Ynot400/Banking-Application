package com.joshualukelacsamana.banking.creditCard;

import com.joshualukelacsamana.banking.AccountData.AccountData;
import com.joshualukelacsamana.banking.appuser.AppUser;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.security.SecureRandom;
import java.time.LocalDate;


@Getter
@Setter
@Document(collection = "creditCards")
public class CreditCard {
    @Id
    private String id;
    private String cardName;
    private String creditCardNumber;
    private String expirationDate;
    private String cvv;
    private String billingAddress;
    private double creditLimit;
    private double creditBalance;


    @DBRef
    private AppUser appUser;

    @DBRef
    private AccountData accountData;

    // No-argument constructor
    public CreditCard() {
    }

    public CreditCard(String billingAddress, AppUser appUser, AccountData accountData) {
        this.cardName = appUser.getName();
        this.billingAddress = billingAddress;
        this.creditLimit = 500.00;
        this.creditCardNumber = generateRandomCreditCardNumber();
        this.expirationDate = generateExpirationDate();
        this.cvv = generateCVV();
        this.appUser = appUser;
        this.accountData = accountData;
        this.creditBalance = 0;


    }

    public CreditCard(CreditCardRequest creditCardRequest, AppUser appUser, AccountData accountData) {
        this.cardName = creditCardRequest.getFullName();
        this.billingAddress = creditCardRequest.getBillingAddress();
        this.creditLimit = 500.00;
        this.creditCardNumber = generateRandomCreditCardNumber();
        this.expirationDate = generateExpirationDate();
        this.cvv = generateCVV();
        this.appUser = appUser;
        this.accountData = accountData;
        this.creditBalance = 0;
    }

    // generate random credit card number using Luhn algorithm
    private String generateRandomCreditCardNumber() {
        int[] cardNumber = new int[16];
        SecureRandom random = new SecureRandom();

        // Generate the first 15 digits randomly
        for (int i = 0; i < 15; i++) {
            cardNumber[i] = random.nextInt(10);
        }

        // Calculate the last digit (checksum) using Luhn algorithm
        int sum = 0;
        for (int i = 0; i < 15; i++) {
            int digit = cardNumber[i];
            if (i % 2 == 0) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
        cardNumber[15] = (10 - (sum % 10)) % 10;

        // Convert card number array to string
        StringBuilder cardNumberString = new StringBuilder();
        for (int digit : cardNumber) {
            cardNumberString.append(digit);
        }

        return cardNumberString.toString();
    }

    private String generateExpirationDate() {
        SecureRandom random = new SecureRandom();
        int month = random.nextInt(12) + 1;
        int year = LocalDate.now().getYear() + random.nextInt(5) + 1;

        return String.format("%02d/%02d", month, year % 100);
    }

    private String generateCVV() {
        SecureRandom random = new SecureRandom();
        int cvv = random.nextInt(900) + 100;
        return String.format("%03d", cvv);
    }
}
