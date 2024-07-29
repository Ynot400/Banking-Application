package com.joshualukelacsamana.banking.AnyConfig.Securityconfig;

import com.joshualukelacsamana.banking.appuser.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractAuthenticationFilterConfigurer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private final AppUserService userDetailService;

    public SecurityConfig(AppUserService userDetailService) {
        this.userDetailService = userDetailService;
    }

// Due to the scope of this project not being intended for deployment, csrf checking is disabled as it is not necessary
    // .permitAll() is used for all of the API requests and is no way intended for real life deployment
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeHttpRequests(registry -> {
                    // Allows the post request to not go through the security filter chain
                    registry.requestMatchers("/api/v1/registration/register").permitAll();
                    registry.requestMatchers("/api/v1/registration/login").permitAll();
                    // Grab account data from user
                    registry.requestMatchers("api/account/{username}").permitAll();
                    // grab credit card data from user
                    registry.requestMatchers("api/creditcard/**").permitAll();
                    // All the transactional requests
                    registry.requestMatchers("/api/transaction/**").permitAll();
                    // If a user is on the home page, no authentication roles are required
                    registry.requestMatchers("/home").permitAll();
                    // if a user logs in, they will be able to access their personal dashboard
                    registry.requestMatchers("/dashboard/**").hasRole("USER");
                    // permit all for the signup page
                    registry.requestMatchers("/signup").permitAll();
                    // post request access for the email verification
                    registry.requestMatchers("/api/emailcheck/**").permitAll();
                        })
                        .formLogin(AbstractHttpConfigurer::disable)
                        .csrf(AbstractHttpConfigurer::disable);
              return  httpSecurity.build();
    }


    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        // TODO: Make my own hashing function for sufficient password encoding
        return new BCryptPasswordEncoder();
    }



}
