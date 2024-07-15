package com.joshualukelacsamana.banking.Transactions;

import com.joshualukelacsamana.banking.creditCard.CreditCard;
import com.joshualukelacsamana.banking.creditCard.CreditCardRequest;
import com.joshualukelacsamana.banking.creditCard.CreditCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/transactions/{username}")
    public ResponseEntity<?> fetchTransactions(@PathVariable String username, @RequestParam String type) {
        try {
            List<Transaction> transactionList = transactionService.getTransactionsForUser(username,type);
            if (transactionList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(transactionList);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{accountNumber}") // Corrected path
    public ResponseEntity<?> fetchTransactionsByAccountNumber(@PathVariable String accountNumber, @RequestParam String username) {
        try {
            List<Transaction> transactionList = transactionService.getTransactionsByAccountNumber(accountNumber, username);
            if (transactionList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(transactionList);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("deposit/{username}")
    public ResponseEntity<?> depositTransaction(@PathVariable String username, @RequestBody TransactionNonCreditRequest transactionNonCreditRequest) {
        try {
            transactionService.depositTransaction(username, transactionNonCreditRequest);
            return ResponseEntity.ok("Your deposit has been made!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("withdraw/{username}")
    public ResponseEntity<?> withdrawTransaction(@PathVariable String username, @RequestBody TransactionNonCreditRequest transactionNonCreditRequest) {
        try {
            transactionService.withdrawTransaction(username, transactionNonCreditRequest);
            return ResponseEntity.ok("Your withdrawal has been made!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("cardPayment/{username}")
    public ResponseEntity<?> cardPaymentTransaction(@PathVariable String username, @RequestBody TransactionCreditRequest transactionCreditRequest) {
        try {
            transactionService.cardPaymentTransaction(username, transactionCreditRequest);
            return ResponseEntity.ok("Your card payment has been made!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("cardPurchase/{username}")
    public ResponseEntity<?> cardPurchaseTransaction(@PathVariable String username, @RequestBody TransactionCreditRequest transactionCreditRequest) {
        try {
            transactionService.cardPurchaseTransaction(username, transactionCreditRequest);
            return ResponseEntity.ok("Your card purchase has been made!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }



}
