package com.example.tripApp.Tickets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // Yeni bir bilet oluşturmak için
    @PostMapping("/PurchaseTicket")
    public ResponseEntity<Tickets> createTicket(@RequestBody Tickets newTicket) {
        System.out.println(newTicket.getSeat_count());
        Tickets ticket = ticketService.createTicket(newTicket,newTicket.geteMail());
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }
    @GetMapping("/ticketPnr")
    public ResponseEntity<Tickets> getTicketByPnr(@RequestParam String pnr) {
        System.out.println("Received PNR: " + pnr);
        Tickets ticket = ticketService.findByPnr(pnr);
        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/deleteTicket")
    public ResponseEntity<Void> deleteTicket(@RequestParam String pnr) {
        System.out.println("Received PNR: " + pnr);
        boolean isDeleted = ticketService.deleteByPnr(pnr);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

