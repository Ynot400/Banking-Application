package com.joshualukelacsamana.banking.AccountData;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;


@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class AccountDataRequest {
    private final String AccountName;
    private final String AccountType;
    private final double Balance;
    private final String Currency;


}


