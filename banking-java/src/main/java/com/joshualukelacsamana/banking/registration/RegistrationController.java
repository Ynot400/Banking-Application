package com.joshualukelacsamana.banking.registration;

import com.joshualukelacsamana.banking.appuser.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    private final RegistrationService registrationService;

    @Autowired
    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }
    // whenever a post request is sent to this link, createUser will be called.
    // Cross origin allows a request from a different port to be accessed
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/v1/registration/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        try {
            String response = registrationService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/v1/registration/login")
    public ResponseEntity<?> login(@RequestBody RegistrationRequestLogin request) {
        try {
            AppUser response = registrationService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Credentials");
        }
    }
}