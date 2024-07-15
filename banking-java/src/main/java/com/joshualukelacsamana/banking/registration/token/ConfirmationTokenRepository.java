package com.joshualukelacsamana.banking.registration.token;

import com.joshualukelacsamana.banking.appuser.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface ConfirmationTokenRepository extends MongoRepository<ConfirmationToken, String> {

    Optional<ConfirmationToken> findByToken(String token);
    List<ConfirmationToken> findByAppUser(AppUser appUser);
}
