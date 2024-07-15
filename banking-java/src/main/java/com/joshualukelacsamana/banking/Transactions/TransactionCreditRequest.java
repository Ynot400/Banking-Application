package com.joshualukelacsamana.banking.Transactions;

import lombok.*;


@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class TransactionCreditRequest {
    private final String creditCardNumber;
    private final double amount;
}
