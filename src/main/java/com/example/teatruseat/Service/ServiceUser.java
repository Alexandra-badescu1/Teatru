package com.example.teatruseat.Service;

import com.example.teatruseat.Model.LoginRequest;
import com.example.teatruseat.Model.User;
import com.example.teatruseat.Repository.RepositoryUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ServiceUser {
    @Autowired
    private RepositoryUser userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public void Add(User user, MultipartFile imageFile) throws Exception {
        user.setPassword(encoder.encode(user.getPassword()));
        user.setImageDate(imageFile.getBytes());
        user.setImageName(imageFile.getOriginalFilename());
        user.setImageType(imageFile.getContentType());
        userRepository.save(user);
    }

    public String verifyLogIn(LoginRequest user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String username = authentication.getName(); // ✅ safely extracts the email (from principal)
            return jwtService.generateToken(username);   // ✅ now token "sub" = "user@example.com"
        } else {
            throw new RuntimeException("User not authenticated");
        }
    }


    public String getRoleForUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                .getRole().name();
    }
}
