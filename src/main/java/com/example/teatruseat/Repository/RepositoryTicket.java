package com.example.teatruseat.Repository;

import com.example.teatruseat.Model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositoryTicket extends JpaRepository<Ticket, Long> {


    List<Ticket> findByUserUsername(String username);
}
