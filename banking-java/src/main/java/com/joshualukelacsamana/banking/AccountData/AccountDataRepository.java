package com.joshualukelacsamana.banking.AccountData;

import com.joshualukelacsamana.banking.appuser.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AccountDataRepository extends MongoRepository<AccountData, String> {
    List<AccountData> findByAppUser(AppUser appUser);
    Optional<AccountData> findByAccountNumberAndAppUser(String accountNumber, AppUser appUser);
    Optional<AccountData> findByAccountNumber(String accountNumber);
}
