package com.joshualukelacsamana.banking.registration.EmailVerification;

import org.springframework.stereotype.Service;

import java.util.function.Predicate;

@Service
public class EmailValidator implements Predicate<String> {
    @Override
    public boolean test(String s) {
        // TODO: Create regex to validate email
        return true;
    }
}
