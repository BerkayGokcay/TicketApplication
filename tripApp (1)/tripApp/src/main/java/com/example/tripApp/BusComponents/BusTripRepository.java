package com.example.tripApp.BusComponents;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusTripRepository extends JpaRepository<BusTrip, Integer> {
    @Query("SELECT t FROM BusTrip t WHERE LOWER(t.fromLocation) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(t.toLocation) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<BusTrip> searchTrips(@Param("searchTerm") String searchTerm);
}
