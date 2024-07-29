package com.joshualukelacsamana.banking.appuser;

import com.joshualukelacsamana.banking.registration.RegistrationRequestLogin;
import com.joshualukelacsamana.banking.registration.token.ConfirmationToken;
import com.joshualukelacsamana.banking.registration.token.ConfirmationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@AllArgsConstructor
public class AppUserService implements UserDetailsService {
        private final static String USER_NOT_FOUND_MSG = "user with email %s not found";

    @Autowired
    private ConfirmationTokenService confirmationTokenService;

    private final AppUserRepository appUserRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            Optional<AppUser> user = appUserRepository.findByEmail(email);
            if (user.isPresent()) {
                var userObj = user.get();

                return User.builder()
                        .username(userObj.getUsername())
                        .password(userObj.getPassword())
                        .roles("USER")
                        .build();
            }
            else {
                throw new UsernameNotFoundException(USER_NOT_FOUND_MSG);
            }


    }



    public String signUpUser(AppUser appUser) {
        // create booleans that will be true if the email or username of a profile is found
        boolean emailExists = appUserRepository.findByEmail(appUser.getEmail()).isPresent();
        boolean usernameExists = appUserRepository.findByUsername(appUser.getUsername()).isPresent();
        // throw an illegalstateexception if booleans are true
        if (emailExists) {
            throw new IllegalStateException("Email has already been taken");
        } else if (usernameExists) {
            throw new IllegalStateException("Username has already been taken");
        }
        String encodedPassword = bCryptPasswordEncoder.encode(appUser.getPassword());
        appUser.setPassword(encodedPassword);
        appUserRepository.save(appUser);
        // create the confirmation token
        ConfirmationToken token = confirmationTokenService.createToken(appUser);
        return "One last step!, Verify your email to confirm your account! An email will be sent to you if the email is valid.";
    }

    public AppUser loginUser(RegistrationRequestLogin request) {
        // Check if the email exists
        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("Invalid Credentials"));

        // Check if the password matches the one in the database
        if (!bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalStateException("Invalid Credentials");
        }

        user.setIsLogged(true);
        appUserRepository.save(user);

        // If everything is successful
        return user;
    }
}
