package com.example.tripApp.BusComponents;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BusTripController {

    @Autowired
    private BusTripService busTripService;

    @GetMapping("/trips")
    public List<BusTrip> getTrips(@RequestParam(required = false) String search) {
        if (search == null || search.isEmpty()) {
            return busTripService.getAllBusTrips(); // Tüm seferleri döner
        } else {
            return busTripService.filterTrips(search); // Filtrelenmiş
        }
    }
    @GetMapping("/seats")
    public List<BusTrip> showTrips() {
        return busTripService.getAllBusTrips();
    }

    // ID ile sefer bilgisi çekme
    @GetMapping("/{id}")
    public BusTrip getBusTripById(@PathVariable Integer id) {
        return busTripService.getBusTripById(id);
    }
}