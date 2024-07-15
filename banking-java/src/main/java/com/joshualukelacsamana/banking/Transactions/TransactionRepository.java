package com.joshualukelacsamana.banking.Transactions;

import com.joshualukelacsamana.banking.appuser.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByAppUser(AppUser appUser);

    List<Transaction> findByTransactionTypeInAndAppUser(List<String> transactionTypes, AppUser appUser);

    List<Transaction> findByAccountIdAndAppUser(String accountId, AppUser appUser);
}

