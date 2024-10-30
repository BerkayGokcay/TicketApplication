package com.example.tripApp.Tickets;

import com.example.tripApp.BusComponents.BusTrip;
import com.example.tripApp.BusComponents.BusTripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
public class TicketService {
    BusTrip busTrip;
    @Autowired
    BusTripRepository busTripRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    EmailService emailService;
    public Tickets createTicket(Tickets newTicket,String eMail) {
        BusTrip trip = busTripRepository.findAll()
                .stream()
                .filter(busTrip -> busTrip.getId() == newTicket.getTrip_id())
                .findFirst()
                .orElse(null); // Eğer bulunamazsam null döner
        if(trip == null)
        {
            System.out.println( trip + "is null");
            return null;
        }
        String seatMap = trip.getSeatMap();
        char[] seatMapArray = seatMap.toCharArray(); // Koltuk haritasını karakter dizisine çevir

        int selectedSeatIndex = newTicket.getSeat_count(); // Seçilen koltuk indeksi

        if (seatMapArray[selectedSeatIndex] == '1') { // Eğer koltuk boşsa
            seatMapArray[selectedSeatIndex] = '0'; //  dolu olarak ayarla
            trip.setAvailableSeats(trip.getAvailableSeats() - 1 );
            trip.setSeatMap(new String(seatMapArray)); //  koltuk haritasını ayarla
        }

        String subject = "Bilet Satın Alma Onayı";
        String text = "Biletiniz başarıyla satın alındı. PNR Kodu: " + newTicket.getPnr();
        emailService.sendEmail(newTicket.geteMail(), subject, text);
        return ticketRepository.save(newTicket);
    }
    public Optional<Tickets> getTicketByPnr(String pnr) {
        System.out.println(pnr);
        return ticketRepository.findByPnr(pnr);
    }
    public Tickets findByPnr(String pnr) {
        return ticketRepository.findByPnr(pnr).orElse(null);
    }
    @Transactional
    public boolean deleteByPnr(String pnr) {
        if (ticketRepository.existsByPnr(pnr)) {
            ticketRepository.deleteByPnr(pnr);
            return true;
        }
        return false;
    }


}
