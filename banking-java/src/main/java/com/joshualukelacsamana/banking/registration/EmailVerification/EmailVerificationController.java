package com.joshualukelacsamana.banking.registration.EmailVerification;

import com.joshualukelacsamana.banking.registration.RegistrationRequestLogin;
import com.joshualukelacsamana.banking.registration.token.ConfirmationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emailcheck")
public class EmailVerificationController {

    @Autowired
    private ConfirmationTokenService confirmationTokenService;

    @Autowired
    private EmailService emailService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestParam("token") String token) {
        try {
            boolean isConfirmed = confirmationTokenService.confirmToken(token);
            if (isConfirmed) {
                String response = "Email has been verified successfully. Feel free to login!";
                return ResponseEntity.ok(response);
            } else {
                String response = "Something happened on our end, we apologize.";
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}


