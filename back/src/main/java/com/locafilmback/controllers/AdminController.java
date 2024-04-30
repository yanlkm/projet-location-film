package com.locafilmback.controllers;


import com.locafilmback.dtos.*;
import com.locafilmback.models.Commentaire;
import com.locafilmback.models.Film;
import com.locafilmback.models.Location;
import com.locafilmback.models.Utilisateur;
import com.locafilmback.repositories.FilmRepository;
import com.locafilmback.repositories.LocationRepository;
import com.locafilmback.repositories.UtilisateurRepository;
import com.locafilmback.services.CommentaireService;
import com.locafilmback.services.FilmService;
import com.locafilmback.services.LocationService;
import com.locafilmback.services.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.locafilmback.controllers.UtilisateurController.getResponseEntity;

@RestController
@RequestMapping("/admin")

public class AdminController {

    private final FilmRepository filmRepository;
    private final UtilisateurService utilisateurService;
    private final LocationRepository locationRepository;
    private final FilmService filmService;
    private final CommentaireService commentaireService;

    @Autowired
    public AdminController(FilmRepository filmRepository, UtilisateurService utilisateurService, LocationRepository locationRepository, FilmService filmService, CommentaireService commentaireService) {
        this.filmRepository = filmRepository;
        this.utilisateurService = utilisateurService;
        this.locationRepository = locationRepository;
        this.filmService = filmService;
        this.commentaireService = commentaireService;
    }
    @GetMapping("/comptes")
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        List<UtilisateurDTO> utilisateurs = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }

    @GetMapping("/comptes/{idUtilisateur}")
    public ResponseEntity<?> getUtilisateurById(@PathVariable int idUtilisateur) {
        return getResponseEntity(idUtilisateur, utilisateurService);

    }

    @GetMapping("/films")
    public ResponseEntity<List<Film>> getAllFilms() {
        List<Film> films = filmService.getAllExistingFilms();
        return ResponseEntity.ok(films);
    }

    @GetMapping("/films/{idFilm}")
    public ResponseEntity<Film> getFilmById(@PathVariable int idFilm) {
        Film film = filmService.getFilmByIdAndValiditeNotS(idFilm);
        return ResponseEntity.ok(film);
    }


    @PostMapping("/films")
    public ResponseEntity<?> addFilm(@RequestBody FilmDTO filmDTO) {
        Film film = new Film();
        film.setNom(filmDTO.getNom());
        film.setGenre(filmDTO.getGenre());
        film.setRealisateur(filmDTO.getRealisateur());
        film.setSynopsis(filmDTO.getSynopsis());
        film.setUrl(filmDTO.getUrl());
        film.setDateSortie(filmDTO.getDateSortie());
        film.setValidite(filmDTO.getValidite());
        film.setPrix(filmDTO.getPrix());
        film.setPegi(filmDTO.getPegi());
        // Enregistrer le film dans la base de données
        filmRepository.save(film);

        return ResponseEntity.ok("Film ajouté avec succès");
    }

    @PutMapping("/films/{idFilm}")
    public ResponseEntity<?> updateFilm(@PathVariable int idFilm, @RequestBody FilmDTO filmDTO) {
        Film existingFilm = filmService.getFilmByIdAndValiditeNotS(idFilm);
        if (existingFilm == null) {
            return ResponseEntity.notFound().build();
        }
        // Mettre à jour les champs du film avec les valeurs du DTO
        existingFilm.setNom(filmDTO.getNom());
        existingFilm.setGenre(filmDTO.getGenre());
        existingFilm.setRealisateur(filmDTO.getRealisateur());
        existingFilm.setSynopsis(filmDTO.getSynopsis());
        existingFilm.setUrl(filmDTO.getUrl());
        existingFilm.setDateSortie(filmDTO.getDateSortie());
        existingFilm.setPrix(filmDTO.getPrix());
        existingFilm.setPegi(filmDTO.getPegi());

        // Enregistrer les modifications
        filmService.saveFilm(existingFilm);

        return ResponseEntity.ok("Film mis à jour avec succès");
    }

    @DeleteMapping("/films/{idFilm}")
    public ResponseEntity<?> changeValiditeFilm(@PathVariable int idFilm) {
        Film existingFilm = filmService.getFilmByIdAndValiditeNotS(idFilm);

        if (existingFilm == null) {
            return ResponseEntity.notFound().build();
        }
        // Mettre à jour la validité du film
        char newValidity = existingFilm.getValidite() == 'V' ? 'N' : 'V';
        existingFilm.setValidite(newValidity);

        // Enregistrer la modification de la validité
        filmService.saveFilm(existingFilm);

        return ResponseEntity.ok("Validité du film mise à jour avec succès");
    }


    @GetMapping("/locations")
    public ResponseEntity<?> getAllLocations() {
        List<Location> locations = locationRepository.findAllLocations();

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
            // Ajouter l'objet LocationDetail à la liste
            locationDetails.add(locationDetail);
        }

        // Retourner la liste des détails de l'emplacement
        return ResponseEntity.ok(locationDetails);
    }

    @GetMapping("/locations/{idLocation}")
    public ResponseEntity<?> getLocationById(@PathVariable int idLocation) {
        Location location = locationRepository.findBy_IdLocation(idLocation);

        LocationDTO locationDetail = new LocationDTO();
        locationDetail.setLocation(location);
        locationDetail.setIdUtilisateur((location.getUtilisateur().getIdUtilisateur()));
        locationDetail.setFilm(location.getFilm());
        locationDetail.setNomUtilisateur(location.getUtilisateur().getPseudo());
        locationDetail.setUrlFilm(location.getFilm().getUrl());
        locationDetail.setNomFilm(location.getFilm().getNom());

        return  ResponseEntity.ok(locationDetail);
    }

    @GetMapping("/comptes/debannir/{idUtilisateur}")
    public ResponseEntity<?> activateUtilisateur(@PathVariable int idUtilisateur) {
        utilisateurService.activateUtilisateur(idUtilisateur);
        return ResponseEntity.ok("Utilisateur reactivé");
    }

    @DeleteMapping("/comptes/bannir/{idUtilisateur}")
    public ResponseEntity<?> deleteUtilisateur(@PathVariable int idUtilisateur) {
        utilisateurService.deleteUtilisateur(idUtilisateur);
        return ResponseEntity.ok("Utilisateur supprimée");
    }
    @DeleteMapping("/commentaires/{idCommentaire}")
    public ResponseEntity<String> deleteCommentaireForFilmByAdmin(@PathVariable int idCommentaire) {
        commentaireService.deleteCommentaireForFilmByAdmin( idCommentaire);
        return ResponseEntity.ok("Commentaire supprimé avec succès");
    }

}
