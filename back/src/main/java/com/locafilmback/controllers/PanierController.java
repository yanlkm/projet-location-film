package com.locafilmback.controllers;

import com.locafilmback.dtos.PanierDTO;
import com.locafilmback.models.*;
import com.locafilmback.repositories.PhotoRepository;
import com.locafilmback.services.LocationService;
import com.locafilmback.services.PanierService;
import org.springframework.data.domain.Limit;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;


@RestController
@RequestMapping("/panier")
public class PanierController {

    private final PanierService panierService;
    private final LocationService locationService;
    private final PhotoRepository photoRepository;

    public PanierController(PanierService panierService, LocationService locationService, PhotoRepository photoRepository) {
        this.panierService = panierService;
        this.locationService = locationService;
        this.photoRepository = photoRepository;
    }

    @GetMapping("/{idUtilisateur}")
    public ResponseEntity<?> getPanierByUserId(@PathVariable int idUtilisateur) {
        Panier panier = panierService.getPanierByUserId(idUtilisateur);

        if (panier != null) {
            try {
                List<DetailsPanier> detailsPanier = panierService.getDetailsPanierById(panier.getIdPanier());
                List<Film> films = new ArrayList<>();

                for (DetailsPanier detail : detailsPanier) {
                    films.add(detail.getFilm());
                }

                if (!films.isEmpty()) {
                    // transformer les films en panier dto

                    return ResponseEntity.ok(getListPanier(films));
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun film dans le panier");
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Panier non trouvé");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Panier non trouvé.");
        }
    }



    @PostMapping("/{idUtilisateur}")
    public ResponseEntity<String> addFilmToPanier(@PathVariable int idUtilisateur, @RequestBody FilmPanier filmPanier) {
        // Vérifier si le film est déjà dans les locations en cours
        boolean filmInLocations = locationService.isFilmInCurrentLocations(idUtilisateur, filmPanier.getIdFilm());

        // Si le film est déjà dans les locations en cours, retourner un message d'erreur
        if (filmInLocations) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le film est déjà dans les locations en cours.");
        }

        // Ajouter le film au panier s'il n'est pas déjà présent dans les locations en cours
        panierService.addFilmToPanier(idUtilisateur, filmPanier.getIdFilm());

        // Retourner un message de succès
        return ResponseEntity.ok("Film ajouté au panier avec succès");
    }



    @PutMapping("/{idUtilisateur}")
    public ResponseEntity<String> updatePanier(@PathVariable int idUtilisateur, @RequestBody FilmPanier filmPanier) {
        if( !locationService.isFilmInCurrentLocations(idUtilisateur, filmPanier.getIdFilm()))  {
            panierService.updatePanier(idUtilisateur, filmPanier);
            return ResponseEntity.ok("Panier modifié avec succès");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le film est déjà dans les locations en cours.");

        }
    }

    @DeleteMapping("/{idUtilisateur}")
    public ResponseEntity<?> deletePanier(@PathVariable int idUtilisateur) {
        Panier panier = panierService.getPanierByUserId(idUtilisateur);

        if (panier != null) {
            try {
                List<DetailsPanier> detailsPanier = panierService.getDetailsPanierById(panier.getIdPanier());
                for (DetailsPanier detail : detailsPanier) {
                    // Créer une nouvelle instance de Location
                    Location location = new Location();
                    location.setUtilisateur(detail.getPanier().getUtilisateur());
                    location.setFilm(detail.getFilm());

                    // Convertir la date actuelle en java.sql.Date
                    java.sql.Date currentDate = new java.sql.Date(System.currentTimeMillis());
                    location.setDateDebut(currentDate);

                    // Ajouter 3 heures à la date actuelle pour obtenir la date de fin
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(currentDate);
                    calendar.add(Calendar.DAY_OF_WEEK, 1);
                    java.sql.Date endDate = new java.sql.Date(calendar.getTimeInMillis());
                    location.setDateFin(endDate);

                    // Enregistrer la nouvelle instance de Location
                    locationService.saveLocation(location);
                }

                // Supprimer le panier une fois que toutes les locations ont été créées
                panierService.clearPanier(idUtilisateur);

                return ResponseEntity.ok("Panier supprimé avec succès, locations créées.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erreur lors de la suppression du panier : " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Panier non trouvé.");
        }
    }

    private List<?> getListPanier(List<Film> films) {
        List<PanierDTO> completedPanierDTOs = new ArrayList<>();
        for (Film film : films) {
            PanierDTO panierDTO = new PanierDTO();
            // Remplir les champs du PanierDTO
            panierDTO.setIdFilm(film.getIdFilm());
            panierDTO.setNom(film.getNom());
            panierDTO.setSynopsis(film.getSynopsis());
            panierDTO.setUrl(film.getUrl());
            panierDTO.setRealisateur(film.getRealisateur());
            panierDTO.setGenre(film.getGenre());
            panierDTO.setPrix(film.getPrix());
            panierDTO.setPegi(film.getPegi());
            panierDTO.setValidite(film.getValidite());

            // Récupérer la photo du film à partir du repository de photos
            Photo photo = photoRepository.findOneFilm_IdFilm(film.getIdFilm(), Limit.of(1));
            if (photo != null) {
                panierDTO.setPhoto(photo.getImage());
            } else {
                panierDTO.setPhoto("");
            }

            completedPanierDTOs.add(panierDTO);
        }
        return completedPanierDTOs;
    }

}
