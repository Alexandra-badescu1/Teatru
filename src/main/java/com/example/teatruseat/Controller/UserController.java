package com.example.teatruseat.Controller;


import com.example.teatruseat.Model.LoginRequest;
import com.example.teatruseat.Model.User;
import com.example.teatruseat.Repository.RepositoryUser;
import com.example.teatruseat.Service.JWTService;
import com.example.teatruseat.Service.ServiceUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private ServiceUser userService;

    @Autowired
    private RepositoryUser userRepository;

    @PostMapping(path = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addUser(
            @RequestPart("product") String userJson,
            @RequestPart("imageFile") MultipartFile imageFile) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        User user = objectMapper.readValue(userJson, User.class);

        userService.Add(user, imageFile);
        return ResponseEntity.ok("User added successfully");
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.verifyLogIn(loginRequest);
            User fullUser = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", loginRequest.getUsername());
            response.put("role", fullUser.getRole().toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }
    }


}
