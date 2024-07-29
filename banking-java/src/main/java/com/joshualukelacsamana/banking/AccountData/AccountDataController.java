package com.joshualukelacsamana.banking.AccountData;

import com.joshualukelacsamana.banking.appuser.AppUser;
import com.joshualukelacsamana.banking.appuser.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/account")
public class AccountDataController {

    @Autowired
    private AccountDataService accountDataService;
    @Autowired
    private AccountDataRepository AccountDataRepository;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/oneAccount/{username}")
    public ResponseEntity<?> getOneAccountData(@PathVariable String username, @RequestParam String accountNumber) {
        try {
            Optional<AccountData> accountDataList = accountDataService.getOneAccountDataForUser(username, accountNumber);
            if (accountDataList.isEmpty()){
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(accountDataList);
        } catch (IllegalStateException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
            }
        }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{username}")
    public ResponseEntity<?> getAccountData(@PathVariable String username) {
        try {
            List<AccountData> accountDataList = accountDataService.getAccountDataForUser(username);
            if (accountDataList.isEmpty()){
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(accountDataList);
        } catch (IllegalStateException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
            }
        }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/{username}")
    public ResponseEntity<?> addAccountData(@PathVariable String username, @RequestBody AccountDataRequest accountDataRequest) {
        String response = accountDataService.addAccountDataToUser(username, accountDataRequest);
        return ResponseEntity.ok(response);
    }
}
