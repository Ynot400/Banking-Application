package com.joshualukelacsamana.banking.registration.EmailVerification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService implements Email_Interface {
    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendTokenEmail(String text, String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("bankingapp@noreply.com");
        message.setTo(to);
        message.setSubject("Verify your email!");
        message.setText(text);
        emailSender.send(message);
    }

}
