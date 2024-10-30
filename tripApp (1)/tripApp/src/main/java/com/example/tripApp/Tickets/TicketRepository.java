package com.example.tripApp.Tickets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Tickets, Long>{
    Optional<Tickets> findByPnr(String pnr);
    void deleteByPnr(String pnr); // PNR ile silme metodu
    boolean existsByPnr(String pnr); // PNR kontrol metodu
}
