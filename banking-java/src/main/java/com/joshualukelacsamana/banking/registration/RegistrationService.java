package com.joshualukelacsamana.banking.registration;

import com.joshualukelacsamana.banking.appuser.AppUser;
import com.joshualukelacsamana.banking.appuser.AppUserService;
import com.joshualukelacsamana.banking.registration.EmailVerification.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegistrationService {



    private final EmailValidator emailValidator;
    private final AppUserService appUserService;

    @Autowired
    public RegistrationService(EmailValidator emailValidator, AppUserService appUserService) {
        this.emailValidator = emailValidator;
        this.appUserService = appUserService;
    }

    public String register(RegistrationRequest request) {
        return appUserService.signUpUser(
                new AppUser(
                        request.getName(),
                        request.getUsername(),
                        request.getEmail(),
                        request.getPassword(),
                        request.getRole(),
                        true,
                        false

                )

        );



    }
    public AppUser login(RegistrationRequestLogin request) {
       return appUserService.loginUser(request);

    }
}


