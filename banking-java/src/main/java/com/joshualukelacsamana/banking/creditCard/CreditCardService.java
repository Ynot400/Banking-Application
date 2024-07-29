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


    public float getCreditCardBalance(String accountNumber) {
        float creditCardBalance = 0;
        Optional<AccountData> accountData = accountDataRepository.findByAccountNumber(accountNumber);
        if (accountData.isPresent()) {
            List<CreditCard> creditCards = creditCardRepository.findByAccountData(accountData.get());
            for (CreditCard creditCard : creditCards) {
                creditCardBalance += (float) creditCard.getCreditBalance();
            }
            return creditCardBalance;
        }
        else {
            return 0;
        }
    }

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
                    continue;
                }
            }
            if (sentAccount == null) {
                return "Account not found";
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







