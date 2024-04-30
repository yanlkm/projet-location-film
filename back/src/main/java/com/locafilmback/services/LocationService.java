// LocationService.java

package com.locafilmback.services;

import com.locafilmback.models.Location;
import com.locafilmback.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public void saveLocation(Location location) {
        locationRepository.save(location);
    }

    public boolean isFilmInCurrentLocations(int idUtilisateur, int idFilm) {
        // Récupérer la date actuelle
        java.sql.Date currentDate = new java.sql.Date(System.currentTimeMillis());

        // Vérifier si une location en cours correspond à l'idUtilisateur et idFilm donnés
        List<Location> currentLocations = locationRepository.findCurrentLocations(idUtilisateur, idFilm, currentDate);

        // Si la liste des locations en cours n'est pas vide, le film est déjà dans les locations en cours
        return !currentLocations.isEmpty();
    }

    public List<Location> getAllLocationsByUserId(int idUtilisateur) {
        return locationRepository.findAllByIdUtilisateur(idUtilisateur);
    }

    public Location getLocationById(int idUtilisateur, int idLocation) {
        return locationRepository.findByIdAndIdUtilisateur(idLocation, idUtilisateur);
    }

    public List<Location> getActiveLocationsByUserId(int idUtilisateur) {
        return locationRepository.findActiveLocationsByIdUtilisateur(idUtilisateur);
    }

    public List<Location> getCompletedLocationsByUserId(int idUtilisateur) {
        return locationRepository.findCompletedLocationsByIdUtilisateur(idUtilisateur);
    }
}
