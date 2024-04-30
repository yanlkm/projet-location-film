package com.locafilmback.repositories;


import com.locafilmback.models.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FilmRepository extends JpaRepository<Film, Integer> {

    @Query("SELECT f FROM Film f WHERE f.idFilm = :idFilm AND f.validite = 'V'")
    Film findFilmByIdAndValiditeV(int idFilm);

    @Query("SELECT f FROM Film f WHERE f.idFilm = :idFilm AND f.validite != 'S'")
    Film findFilmByIdAndValiditeNotS(int idFilm);
    @Query("SELECT f FROM Film f WHERE f.validite = 'V'")
    List<Film> findAllValidFilms();

    @Query("SELECT f FROM Film f WHERE f.validite != 'S'")
    List<Film> findAllExistingFilms();
}
