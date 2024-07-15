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
                    registry.requestMatchers("api/creditcard/{username}").permitAll();
                    // All the transactional requests
                    registry.requestMatchers("api/transaction/**").permitAll();
                    // If a user is on the home page, no authentication roles are required
                    registry.requestMatchers("/home").permitAll();
                    // if a user logs in, they will be able to access their personal dashboard
                    registry.requestMatchers("/dashboard/**").hasRole("USER");
                    // postman testing for requestment
                    registry.requestMatchers("/signup").permitAll();
                    // post request access for the email verification
                    registry.requestMatchers("/api/emailcheck/**").permitAll();
                    // with any other page, you must be authenticated to use it
        //            registry.anyRequest().authenticated();
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

//    @Bean
//    public UserDetailsService userDetailsService() {
//        //debugging
////        String encodedPassword = passwordEncoder().encode("yourRawPassword"); // Replace with actual raw password
////        System.out.println("Encoded password: " + encodedPassword); // Log the encoded password
//        UserDetails normalUser = User.builder()
//                .username("teebo")
//                .password(passwordEncoder().encode("1234")) // Ensure to replace "yourRawPassword" with the actual raw password
//                .roles("USER")
//                .build();
//        return new InMemoryUserDetailsManager(normalUser);
//    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        // TODO: Make my own hashing function for sufficient password encoding
        return new BCryptPasswordEncoder();
    }



}


//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
//        return authenticationConfiguration.getAuthenticationManager();
//    }
//
//    @Bean
//    public DaoAuthenticationProvider daoAuthenticationProvider() {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setPasswordEncoder(bCryptPasswordEncoder);
//        provider.setUserDetailsService((UserDetailsService) appUserService);
//        return provider;
//    }
//
//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        return (web) -> web.ignoring().requestMatchers("/api/v*/registration/**");
//    }
//}
