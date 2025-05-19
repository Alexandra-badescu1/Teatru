package com.example.teatruseat.Repository;

import com.example.teatruseat.Model.User;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositoryUser extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    User findByPassword(String password);
    User findById(int id);

    Optional<User> findByUsername(String username);
}
