package com.joshualukelacsamana.banking.registration.token;
import com.joshualukelacsamana.banking.appuser.AppUser;
import com.joshualukelacsamana.banking.appuser.AppUserRepository;
import com.joshualukelacsamana.banking.registration.EmailVerification.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConfirmationTokenService {

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AppUserRepository appUserRepository;


    // calls the generateToken function in the ConfirmationToken class and saves it to the mongo repository
    public ConfirmationToken createToken(AppUser appUser) {
        // create the token
        ConfirmationToken token = ConfirmationToken.generateToken(appUser);
        // send the email with the attached token!
        String baseUrl = "http://localhost:3000/verify?token=%s";
        String tokenValue = token.getToken();
        String text = String.format("Please verify your email by clicking on the following link: \"%s\"", String.format(baseUrl, tokenValue));
        emailService.sendTokenEmail(text, appUser.getEmail());
        return confirmationTokenRepository.save(token);
    }
    // calls the repository function to grab the token
    public Optional<ConfirmationToken> findByToken(String token) {
        return confirmationTokenRepository.findByToken(token);
    }
    // calls the repository function to grab the user
    public List<ConfirmationToken> findTokensByUser(AppUser appUser) {
        return confirmationTokenRepository.findByAppUser(appUser);
    }
    // confirm the token matches what is in the database
    public boolean confirmToken(String token) {
        Optional<ConfirmationToken> optionalToken = findByToken(token);
        // there is a token match!
        if (optionalToken.isPresent()) {
            // check the cases if the token can stil be used
            ConfirmationToken confirmationToken = optionalToken.get();
            // if it is expired
            if (confirmationToken.isExpired()) {
                try {
                    // Delete the associated AppUser
                    AppUser appUser = confirmationToken.getAppUser();
                    appUserRepository.delete(appUser);
                }
                catch (Throwable t){
                    // This means that the appuser has already been deleted and the user clicked on the verification link again for some reason
                    // just ignore
                }
                // the token is now useless, delete it
                confirmationTokenRepository.delete(confirmationToken);
                throw new IllegalStateException("Your email verification link has expired. Please sign up again.");
            }
            // if the token was already used
            if (confirmationToken.isConfirmed()) {
                throw new IllegalStateException("Your email was already confirmed! Start Banking by clicking on the Log In button!");
            }
            // validate the token
            confirmationToken.confirm();
            confirmationTokenRepository.save(confirmationToken);

            // Get the associated AppUser and update the fields
            AppUser appUser = confirmationToken.getAppUser();
            appUser.setLocked(false);
            appUser.setEnabled(true);
            appUserRepository.save(appUser);
            return true;
        } else {
            // the token was not found
            throw new IllegalStateException("This verification link is no longer valid. Please sign up again.");
        }
    }

    // Delete older tokens, call this function every so often
    public void cleanUpExpiredTokens() {
        List<ConfirmationToken> tokens = confirmationTokenRepository.findAll();
        tokens.stream()
                .filter(ConfirmationToken::isExpired)
                .forEach(confirmationTokenRepository::delete);
    }
}
