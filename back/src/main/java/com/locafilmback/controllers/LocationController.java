package com.locafilmback.controllers;

import com.locafilmback.dtos.LocationDTO;
import com.locafilmback.models.Location;
import com.locafilmback.models.Photo;
import com.locafilmback.repositories.PhotoRepository;
import com.locafilmback.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Limit;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/locations")
public class LocationController {

    private final LocationService locationService;
    private final PhotoRepository photoRepository;


    @Autowired
    public LocationController(LocationService locationService, PhotoRepository photoRepository) {
        this.locationService = locationService;
        this.photoRepository = photoRepository;
    }

    @GetMapping("/{idUtilisateur}")
    public ResponseEntity<List<LocationDTO>> getAllLocationsByUserId(@PathVariable int idUtilisateur) {
        List<Location> locations = locationService.getAllLocationsByUserId(idUtilisateur);

        // Créer une liste pour stocker les détails de chaque emplacement avec l'utilisateur et le film associés
        List<LocationDTO> locationDetails = new ArrayList<>();

        // Parcourir chaque emplacement pour récupérer les détails de l'utilisateur et du film
        for (Location location : locations) {
            // Vérifier que les détails de l'utilisateur et du film ne sont pas nuls
            if (location.getUtilisateur() == null || location.getFilm() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Créer un nouvel objet LocationDetail avec les détails de l'emplacement, de l'utilisateur et du film
            LocationDTO locationDetail = new LocationDTO();
            locationDetail.setLocation(location);
            locationDetail.setIdUtilisateur((location.getUtilisateur().getIdUtilisateur()));
            locationDetail.setFilm(location.getFilm());
            locationDetail.setNomFilm(location.getFilm().getNom());
            locationDetail.setNomUtilisateur(location.getUtilisateur().getPseudo());
            locationDetail.setUrlFilm(location.getFilm().getUrl());
            locationDetail.setIdFilm(location.getFilm().getIdFilm());


            Photo photo = photoRepository.findOneFilm_IdFilm(location.getFilm().getIdFilm(), Limit.of(1));
            if (photo != null) {
                locationDetail.setPhoto(photo.getImage());
            }else {
                locationDetail.setPhoto("");
            }
            // Ajouter l'objet LocationDetail à la liste
            locationDetails.add(locationDetail);
        }

        // Retourner la liste des détails de l'emplacement
        return ResponseEntity.ok(locationDetails);
    }


    @GetMapping("/{idUtilisateur}/{idLocation}")
    public ResponseEntity<LocationDTO> getLocationById(@PathVariable int idUtilisateur, @PathVariable int idLocation) {
        Location location = locationService.getLocationById(idUtilisateur, idLocation);
        if (location != null) {
            LocationDTO locationDTO = new LocationDTO();
            locationDTO.setLocation(location);
            locationDTO.setIdUtilisateur(location.getUtilisateur().getIdUtilisateur());
            locationDTO.setFilm(location.getFilm());
            locationDTO.setNomFilm(location.getFilm().getNom());
            locationDTO.setNomUtilisateur(location.getUtilisateur().getPseudo());
            locationDTO.setUrlFilm(location.getFilm().getUrl());
            locationDTO.setIdFilm(location.getFilm().getIdFilm());

            Photo photo = photoRepository.findOneFilm_IdFilm(location.getFilm().getIdFilm(), Limit.of(1));
            if (photo != null) {
                locationDTO.setPhoto(photo.getImage());
            }else {
                locationDTO.setPhoto("");
            }
            return ResponseEntity.ok(locationDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{idUtilisateur}/encours")
    public ResponseEntity<List<LocationDTO>> getActiveLocationsByUserId(@PathVariable int idUtilisateur) {
        List<Location> activeLocations = locationService.getActiveLocationsByUserId(idUtilisateur);
        return getListLocationsDTO(activeLocations);
    }

    @GetMapping("/{idUtilisateur}/fini")
    public ResponseEntity<List<LocationDTO>> getCompletedLocationsByUserId(@PathVariable int idUtilisateur) {
        List<Location> completedLocations = locationService.getCompletedLocationsByUserId(idUtilisateur);
        return getListLocationsDTO(completedLocations);
    }

    // convertir les Locations en LocationDTO
    private ResponseEntity<List<LocationDTO>> getListLocationsDTO(List<Location> completedLocations) {
        List<LocationDTO> completedLocationDTOs = new ArrayList<>();
        for (Location location : completedLocations) {
            LocationDTO locationDTO = new LocationDTO();
            locationDTO.setLocation(location);
            locationDTO.setIdUtilisateur(location.getUtilisateur().getIdUtilisateur());
            locationDTO.setFilm(location.getFilm());
            locationDTO.setNomFilm(location.getFilm().getNom());
            locationDTO.setNomUtilisateur(location.getUtilisateur().getPseudo());
            locationDTO.setUrlFilm(location.getFilm().getUrl());
            locationDTO.setIdFilm(location.getFilm().getIdFilm());

            Photo photo = photoRepository.findOneFilm_IdFilm(location.getFilm().getIdFilm(), Limit.of(1));
            if (photo != null) {
                locationDTO.setPhoto(photo.getImage());
            }else {
                locationDTO.setPhoto("");
            }
            completedLocationDTOs.add(locationDTO);
        }
        return ResponseEntity.ok(completedLocationDTOs);
    }

}

