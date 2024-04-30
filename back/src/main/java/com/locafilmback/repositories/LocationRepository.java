package com.locafilmback.repositories;

import com.locafilmback.models.Film;
import com.locafilmback.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository  extends JpaRepository<Location, Integer> {
    @Query("SELECT l FROM Location l WHERE l.utilisateur.idUtilisateur = :idUtilisateur AND l.film.idFilm = :idFilm AND l.dateFin > :currentDate")
    List<Location> findCurrentLocations(@Param("idUtilisateur") int idUtilisateur, @Param("idFilm") int idFilm, @Param("currentDate") java.sql.Date currentDate);


    @Query("SELECT l FROM Location l JOIN FETCH l.film f JOIN FETCH l.utilisateur u WHERE u.idUtilisateur = :idUtilisateur")
    List<Location> findAllByIdUtilisateur(@Param("idUtilisateur") int idUtilisateur);

    @Query("SELECT l FROM Location l JOIN FETCH l.film f JOIN FETCH l.utilisateur u WHERE l.idLocation = :idLocation AND u.idUtilisateur = :idUtilisateur")
    Location findByIdAndIdUtilisateur(@Param("idLocation") int idLocation, @Param("idUtilisateur") int idUtilisateur);

    @Query("SELECT l FROM Location l JOIN FETCH l.film f JOIN FETCH l.utilisateur u WHERE u.idUtilisateur = :idUtilisateur AND l.dateFin > CURRENT_TIMESTAMP")
    List<Location> findActiveLocationsByIdUtilisateur(@Param("idUtilisateur") int idUtilisateur);

    @Query("SELECT l FROM Location l JOIN FETCH l.film f JOIN FETCH l.utilisateur u WHERE u.idUtilisateur = :idUtilisateur AND l.dateFin <= CURRENT_TIMESTAMP")
    List<Location> findCompletedLocationsByIdUtilisateur(@Param("idUtilisateur") int idUtilisateur);

    @Query("SELECT l FROM Location l  WHERE l.idLocation = :idLocation")
    Location findBy_IdLocation(int idLocation);

    @Query("SELECT l FROM Location l")
    List<Location> findAllLocations();
}
