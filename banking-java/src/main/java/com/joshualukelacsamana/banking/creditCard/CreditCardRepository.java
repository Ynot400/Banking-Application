package com.joshualukelacsamana.banking.creditCard;

import com.joshualukelacsamana.banking.AccountData.AccountData;
import com.joshualukelacsamana.banking.appuser.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CreditCardRepository extends MongoRepository<CreditCard, String> {
    List<CreditCard> findByAppUser(AppUser appUser);
    List<CreditCard> findByAccountData(AccountData accountData);
}
