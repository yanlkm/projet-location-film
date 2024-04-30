package com.locafilmback.controllers;

import com.locafilmback.dtos.FilmBodyDTO;
import com.locafilmback.models.Film;
import com.locafilmback.dtos.FilmDTO;
import com.locafilmback.models.Photo;
import com.locafilmback.repositories.PhotoRepository;
import com.locafilmback.services.FilmService;
import org.springframework.data.domain.Limit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/films")
public class FilmController {

    private final FilmService filmService;

    private final PhotoRepository photoRepository;

    public FilmController(FilmService filmService, PhotoRepository photoRepository) {
        this.filmService = filmService;
        this.photoRepository = photoRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllFilms() {

        List<Film> films = filmService.getAllFilms();

        return ResponseEntity.ok(getAllFilmsWithPhoto(films)); //retourner filmDTO

    }
    public List<?> getAllFilmsWithPhoto(List<Film> lesfilms) {
        List<FilmBodyDTO> filmDTOs = new ArrayList<>();

        for (Film film : lesfilms) {
            FilmBodyDTO filmDTO = new FilmBodyDTO();
            filmDTO.setIdFilm(film.getIdFilm());
            filmDTO.setNom(film.getNom());
            filmDTO.setSynopsis(film.getSynopsis());
            filmDTO.setUrl(film.getUrl());
            filmDTO.setRealisateur(film.getRealisateur());
            filmDTO.setGenre(film.getGenre());
            filmDTO.setDateSortie(film.getDateSortie());
            filmDTO.setValidite(film.getValidite());
            filmDTO.setPrix(film.getPrix());
            filmDTO.setPegi(film.getPegi());

            // Récupérer la première photo associée au film (si elle existe) et ajouter l'image à filmDTO
            Photo photo = photoRepository.findOneFilm_IdFilm(film.getIdFilm(), Limit.of(1));
            if (photo != null) {
                filmDTO.setPhoto(photo.getImage());
            }else {
                filmDTO.setPhoto("");
            }

            filmDTOs.add(filmDTO);
        }

        return filmDTOs;
    }


    @GetMapping("/{idFilm}")
    public ResponseEntity<Film> getFilmById(@PathVariable int idFilm) {
        Film film = filmService.getFilmById(idFilm);
        return ResponseEntity.ok(film);
    }
}
