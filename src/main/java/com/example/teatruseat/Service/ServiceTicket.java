package com.example.teatruseat.Service;

import com.example.teatruseat.Model.Ticket;
import com.example.teatruseat.Repository.RepositoryTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceTicket {

    @Autowired
    private RepositoryTicket ticketRepository;


}
