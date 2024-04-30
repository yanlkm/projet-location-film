package com.locafilmback.repositories;

import com.locafilmback.models.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Integer> {
    @Query("SELECT c FROM Commentaire c JOIN FETCH c.utilisateur u JOIN FETCH c.film f WHERE f.idFilm = :idFilm AND c.validite = 'A'")
    List<Commentaire> findAllByIdFilmWithUtilisateurAndFilm(@Param("idFilm") int idFilm);

    @Query("SELECT c FROM Commentaire c JOIN FETCH c.utilisateur u JOIN FETCH c.film f WHERE c.idCommentaire = :idCommentaire AND f.idFilm = :idFilm AND c.validite = 'A'")
    Commentaire findCommentaireByIdFilmAndIdCommentaireWithUtilisateurAndFilm(@Param("idFilm") int idFilm, @Param("idCommentaire") int idCommentaire);

    @Query("SELECT c FROM Commentaire c WHERE c.idCommentaire = :idCommentaire AND c.validite = 'A'")
    Commentaire findBy_IdCommentaire(int idCommentaire);

}
