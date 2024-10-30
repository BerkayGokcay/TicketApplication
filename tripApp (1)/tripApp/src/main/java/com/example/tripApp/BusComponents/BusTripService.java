package com.example.tripApp.BusComponents;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusTripService {

    @Autowired
    private BusTripRepository busTripRepository;

    public List<BusTrip> getAllBusTrips() {
        return busTripRepository.findAll();
    }
    public List<BusTrip> filterTrips(String searchTerm)
    {
        return busTripRepository.searchTrips(searchTerm);
    }
    public BusTrip getBusTripById(Integer id) {
        return busTripRepository.findById(id).orElse(null);
    }

    public BusTrip saveBusTrip(BusTrip busTrip) {
        return busTripRepository.save(busTrip);
    }
}
