package com.joshualukelacsamana.banking;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;


@Document(collection = "bankingInfo")
public class AccountInfo {
    @Id
    private String id;
    private String accountNumber;
    private String accountType;
    private String accountHolderName;
    private double balance;
    private String currency;
    private String creationDate;
}








