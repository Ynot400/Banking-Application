package com.joshualukelacsamana.banking.Transactions;

import com.joshualukelacsamana.banking.AccountData.AccountData;
import com.joshualukelacsamana.banking.AccountData.AccountDataRepository;
import com.joshualukelacsamana.banking.AccountData.AccountDataService;
import com.joshualukelacsamana.banking.appuser.AppUser;
import com.joshualukelacsamana.banking.appuser.AppUserRepository;
import com.joshualukelacsamana.banking.appuser.AppUserService;
import com.joshualukelacsamana.banking.creditCard.CreditCard;
import com.joshualukelacsamana.banking.creditCard.CreditCardRepository;
import com.joshualukelacsamana.banking.creditCard.CreditCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TransactionService {

    @Autowired
    private CreditCardService creditCardService;

    @Autowired
    private AccountDataService accountDataService;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CreditCardRepository creditCardRepository;

    @Autowired
    private AccountDataRepository accountDataRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    public List<Transaction> getTransactionsForUser(String username, String type) {
        Optional<AppUser> appUserOptional = appUserRepository.findByUsername(username);
        if (appUserOptional.isEmpty()) {
            return Collections.emptyList(); // Or throw an exception based on your error handling strategy
        }
        AppUser appUser = appUserOptional.get();

        if ("all".equals(type)) {
            return transactionRepository.findByAppUser(appUser);
        } else if ("creditCard".equals(type)) {
            return transactionRepository.findByTransactionTypeInAndAppUser(Arrays.asList("Payment", "Purchase"), appUser);
        } else if ("account".equals(type)) {
            return transactionRepository.findByTransactionTypeInAndAppUser(Arrays.asList("Withdraw", "Deposit"), appUser);
        } else {
            return Collections.emptyList(); // Or throw an exception if the type is not recognized
        }
    }

    public List<Transaction> getTransactionsByAccountNumber(String accountNumber, String username) {
        Optional<AppUser> appUserOptional = appUserRepository.findByUsername(username);
        if (appUserOptional.isEmpty()) {
            return Collections.emptyList();
        }
        AppUser appUser = appUserOptional.get();
        return transactionRepository.findByAccountIdAndAppUser(accountNumber, appUser);
    }

    public void depositTransaction(String username, TransactionNonCreditRequest request) {
        List<AccountData> accountData = accountDataService.getAccountDataForUser(username);
        double prevBalance = 0;
        for (AccountData account : accountData) {
            if (account.getAccountNumber().equals(request.getAccountNumber())) {
                prevBalance = account.getBalance();
                account.setBalance(account.getBalance() + request.getAmount());
                Transaction transaction = new Transaction(
                        account.getAccountNumber(),
                        "Deposit",
                        request.getAmount(),
                        String.format("Account holder has increased their balance from %.2f to %.2f by depositing %.2f into their account",
                                prevBalance, account.getBalance(), request.getAmount()),
                        account.getAppUser()
                );
                transactionRepository.save(transaction);
            }
        }
        accountDataRepository.saveAll(accountData);
    }



    public void withdrawTransaction(String username, TransactionNonCreditRequest request) {
        List<AccountData> accountData = accountDataService.getAccountDataForUser(username);
        double prevBalance = 0;
        for (AccountData account : accountData) {
            if (account.getAccountNumber().equals(request.getAccountNumber())) {
                if (account.getBalance() < request.getAmount()) {
                    throw new IllegalStateException("Withdrawal cannot be made. Insufficient funds");
                }
                prevBalance = account.getBalance();
                account.setBalance(account.getBalance() - request.getAmount());
                Transaction transaction = new Transaction(
                        account.getAccountNumber(),
                        "Withdraw",
                        request.getAmount(),
                        String.format("Account holder has decreased their balance from %.2f to %.2f by withdrawing %.2f from their account",
                                prevBalance, account.getBalance(), request.getAmount()),
                        account.getAppUser()
                );
                transactionRepository.save(transaction);
            }
        }
        accountDataRepository.saveAll(accountData);
    }


    public void cardPurchaseTransaction(String username, TransactionCreditRequest request) {
       List<CreditCard> creditCards = creditCardService.getCreditCard(username);
         for (CreditCard card : creditCards) {
              if (card.getCreditBalance() > card.getCreditLimit()) {
                  throw new IllegalStateException("Credit card purchase cannot be made. Credit limit exceeded");
              }
              else if (card.getCreditCardNumber().equals(request.getCreditCardNumber())) {
                card.setCreditBalance(card.getCreditBalance() + request.getAmount());
                Transaction transaction = new Transaction(
                        card.getCreditCardNumber(),
                        "Purchase",
                        request.getAmount(),
                        "Account holder has made a purchase of " + request.getAmount() + " using their credit card",
                        card.getAppUser()
                );
                transactionRepository.save(transaction);
              }
         }
         creditCardRepository.saveAll(creditCards);
    }

    public void cardPaymentTransaction(String username, TransactionCreditRequest request) {
        List<CreditCard> creditCards = creditCardService.getCreditCard(username);
        for (CreditCard card : creditCards) {
            if (card.getCreditCardNumber().equals(request.getCreditCardNumber())) {
                card.setCreditBalance(card.getCreditBalance() - request.getAmount());
                Transaction transaction = new Transaction(
                        card.getCreditCardNumber(),
                        "Payment",
                        request.getAmount(),
                        "Account holder has made a payment of " + request.getAmount() + " for their credit card balance of " + card.getCreditBalance(),
                        card.getAppUser()
                );
                transactionRepository.save(transaction);
            }
        }
        creditCardRepository.saveAll(creditCards);
    }


}
