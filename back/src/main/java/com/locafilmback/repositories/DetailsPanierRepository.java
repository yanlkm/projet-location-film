package com.locafilmback.repositories;

import com.locafilmback.models.DetailsPanier;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface DetailsPanierRepository extends JpaRepository<DetailsPanier, Integer> {
    @Transactional
    @Modifying
    @Query("DELETE FROM DetailsPanier dp WHERE dp.id.idPanier = :idPanier AND dp.id.idFilm = :idFilm")
    void removeFilmFromPanier(int idPanier, int idFilm);
    @Transactional
    @Modifying
    @Query("DELETE FROM DetailsPanier dp WHERE dp.panier.idPanier = :idPanier")
    void clearPanier(int idPanier);

    List<DetailsPanier> findByPanier_IdPanier(int idPanier);
}
