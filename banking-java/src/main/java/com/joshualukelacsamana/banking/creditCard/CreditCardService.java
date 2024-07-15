package com.joshualukelacsamana.banking.creditCard;

import com.joshualukelacsamana.banking.AccountData.AccountData;
import com.joshualukelacsamana.banking.AccountData.AccountDataRepository;
import com.joshualukelacsamana.banking.appuser.AppUser;
import com.joshualukelacsamana.banking.appuser.AppUserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class CreditCardService {

    @Autowired
    private CreditCardRepository creditCardRepository;

    @Autowired
    private AccountDataRepository accountDataRepository;


    @Autowired
    private AppUserRepository appUserRepository;
//
//    public String createCreditCardForUser(String username, String billingAddress) {
//        Optional<AppUser> user = appUserRepository.findByUsername(username);
//        if (user.isPresent()) {
//            CreditCard newCreditCard = new CreditCard(
//                    billingAddress,
//                    user.get()
//            );
//            creditCardRepository.save(newCreditCard);
//            return "Successful Credit card made";
//        } else {
//            return "Something went wrong";
//        }
//    }

    public String createCreditCards(String username, CreditCardRequest creditCardRequest) {
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        if (user.isPresent()) {
            AccountData sentAccount = null;
            List<AccountData> accountData = accountDataRepository.findByAppUser(user.get());
            for (AccountData account : accountData) {
                System.out.println("Account number: " + account.getAccountNumber());
                if (account.getAccountNumber().equals(creditCardRequest.getSelectedAccountNumber())) {
                    System.out.println("Creating credit card for user: " + username + " with selected account number: " + creditCardRequest.getSelectedAccountNumber());
                    sentAccount = account;
                    break;
                }
                else {
                    System.out.println("Account not found");
                    return "Account not found";
                }
            }
            CreditCard newCreditCard = new CreditCard(creditCardRequest, user.get(), sentAccount);
            creditCardRepository.save(newCreditCard);
            return "Successful new Credit card made!";
        }
        else {
            return "Something went wrong";
        }
    }

    public List<CreditCard> getCreditCard(String username){
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        return creditCardRepository.findByAppUser(user.get());
    }

}







