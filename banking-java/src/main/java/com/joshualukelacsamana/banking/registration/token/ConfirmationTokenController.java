//package com.joshualukelacsamana.banking.registration.token;
//import com.joshualukelacsamana.banking.appuser.AppUser;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/tokens")
//public class ConfirmationTokenController {
//    @Autowired
//    private ConfirmationTokenService confirmationTokenService;
//
//    @PostMapping("/create")
//    public String createToken(@RequestBody AppUser appUser) {
//        ConfirmationToken token = confirmationTokenService.createToken(appUser);
//        return token.getToken();
//    }
//
//    @GetMapping("/confirm")
//    public String confirmToken(@RequestParam("token") String token) {
//        if (confirmationTokenService.confirmToken(token)) {
//            return "Token confirmed successfully";
//        } else {
//            return "Token confirmation failed";
//        }
//    }
//}
