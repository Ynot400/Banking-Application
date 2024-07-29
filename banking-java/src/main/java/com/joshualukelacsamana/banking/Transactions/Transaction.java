package com.joshualukelacsamana.banking.Transactions;

import com.joshualukelacsamana.banking.appuser.AppUser;
import com.joshualukelacsamana.banking.creditCard.CreditCard;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "Transactions")
public class Transaction {

    @Id
    private String id;
    private String accountId;
    private String transactionType;
    private double amount;
    private String date;
    private String description;

    @DBRef
    private AppUser appUser;

    public Transaction(String accountId, String transactionType, double amount, String description, AppUser appUser) {
        this.accountId = accountId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.description = description;
        this.appUser = appUser;
        this.date = java.time.LocalDateTime.now().toString();
    }

    // Used during transaction testing
    @Override
    public String toString() {
        return "Transaction{" +
                "accountId='" + accountId + '\'' +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                ", appUser=" + appUser +
                '}';
    }

}
