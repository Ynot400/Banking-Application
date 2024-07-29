package com.joshualukelacsamana.banking.AccountData;

import com.joshualukelacsamana.banking.appuser.AppUser;
import com.joshualukelacsamana.banking.appuser.AppUserRepository;
import com.joshualukelacsamana.banking.creditCard.CreditCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountDataService {

    @Autowired
    private AccountDataRepository accountDataRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private CreditCardService creditCardService;

    public List<AccountData> getAccountDataForUser(String username) {
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        return accountDataRepository.findByAppUser(user.get());
    }

    public Optional<AccountData> getOneAccountDataForUser(String username, String accountNumber) {
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        return accountDataRepository.findByAccountNumberAndAppUser(accountNumber, user.get());
    }

    public String addAccountDataToUser(String username, AccountDataRequest accountDataRequest) {
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        System.out.println("Should be account type, account name, balance, and then currency");
        System.out.println(accountDataRequest.getAccountType());
        System.out.println(accountDataRequest.getAccountName());
        System.out.println(accountDataRequest.getBalance());
        System.out.println(accountDataRequest.getCurrency());

        if (user.isPresent()) {
            AccountData newAccount = new AccountData(
                    accountDataRequest.getAccountType(),
                    accountDataRequest.getAccountName(),
                    accountDataRequest.getBalance(),
                    accountDataRequest.getCurrency(),
                    user.get()
            );
            //creditCardService.createCreditCardForUser(username,accountDataRequest.getBillingAddress());
            accountDataRepository.save(newAccount);
            return "Successful account creation!";
        } else {
            return "User not found!";
        }
    }
}
