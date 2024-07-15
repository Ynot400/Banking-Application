package com.joshualukelacsamana.banking.Transactions;

import lombok.*;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class TransactionNonCreditRequest {
    private final String accountNumber;
    private final double amount;
}
