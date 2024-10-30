package com.example.tripApp.BusComponents;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.math.BigDecimal;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "bus_trips")
public class BusTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "trip_date", nullable = false)
    private LocalDate  tripDate;

    @Column(name = "departure_time", nullable = false)
    private LocalTime  departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalTime  arrivalTime;

    @Column(name = "from_location", nullable = false)
    private String fromLocation;

    @Column(name = "to_location", nullable = false)
    private String toLocation;

    @Column(name = "available_seats", nullable = false)
    private int availableSeats;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "seat_map", nullable = false)
    private String seatMap; // 0 ve 1'lerle koltuk durumunu temsil eden string

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getTrip_date() { // Değiştirildi
        return tripDate;
    }

    public void setTrip_date(LocalDate tripDate) { // Değiştirildi
        this.tripDate = tripDate;
    }

    public LocalTime  getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime  departureTime) {
        this.departureTime = departureTime;
    }

    public LocalTime  getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime  arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getFromLocation() {
        return fromLocation;
    }

    public void setFromLocation(String fromLocation) {
        this.fromLocation = fromLocation;
    }

    public String getToLocation() {
        return toLocation;
    }

    public void setToLocation(String toLocation) {
        this.toLocation = toLocation;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSeatMap() {
        return seatMap;
    }

    public void setSeatMap(String seatMap) {
        this.seatMap = seatMap;
    }

    @Override
    public String toString() {
        return "BusTrip{" +
                "id=" + id +
                ", tripDate=" + tripDate +
                ", departureTime=" + departureTime +
                ", arrivalTime=" + arrivalTime +
                ", fromLocation='" + fromLocation + '\'' +
                ", toLocation='" + toLocation + '\'' +
                ", availableSeats=" + availableSeats +
                ", price=" + price +
                '}';
    }
    @JsonProperty("seatMap")
    public List<String> getSeatMapAsList() {
        return Arrays.asList(seatMap.split(""));
    }
}

