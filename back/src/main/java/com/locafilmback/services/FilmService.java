package com.locafilmback.services;

import com.locafilmback.models.Film;
import com.locafilmback.repositories.FilmRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FilmService {

    private final FilmRepository filmRepository;

    public FilmService(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    public List<Film> getAllFilms() {
        return filmRepository.findAllValidFilms();
    }

    public List<Film> getAllExistingFilms() {
        return filmRepository.findAllExistingFilms();
    }

    public Film getFilmByIdAndValiditeNotS(int idFilm) {
        return filmRepository.findFilmByIdAndValiditeNotS(idFilm);
    }

    public Film getFilmById(int idFilm) {
        return filmRepository.findFilmByIdAndValiditeV(idFilm);
    }

    // Méthode pour sauvegarder un film
    public void saveFilm(Film film) {
        filmRepository.save(film);
    }
}
