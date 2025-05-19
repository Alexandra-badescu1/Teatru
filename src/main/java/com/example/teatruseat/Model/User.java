package com.example.teatruseat.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;

    private String imageName;

    private String imageType;

    @Lob
    private byte[] imageDate;

    @Enumerated(EnumType.STRING)
    private Role role;
}
