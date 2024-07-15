package com.joshualukelacsamana.banking.creditCard;

import com.joshualukelacsamana.banking.AccountData.AccountData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/creditcard")
public class CreditCardController {

    @Autowired
    private CreditCardService creditCardService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{username}")
    public ResponseEntity<?> getCreditCardData(@PathVariable String username) {
        try {
            List<CreditCard> creditCardList = creditCardService.getCreditCard(username);
            if (creditCardList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(creditCardList);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/{username}")
    public ResponseEntity<?> createNewCreditCard(@PathVariable String username, @RequestBody CreditCardRequest creditCardRequest) {
        try {
            creditCardService.createCreditCards(username, creditCardRequest);
            return ResponseEntity.ok("Your new card has been created!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

}
