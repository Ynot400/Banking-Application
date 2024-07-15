package com.joshualukelacsamana.banking.creditCard;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class CreditCardRequest {
    private final String fullName;
    private final String billingAddress;
    private final String selectedAccountNumber;
}





