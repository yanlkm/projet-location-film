package com.locafilmback.repositories;

import com.locafilmback.models.Photo;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Integer> {
    List<Photo> findByFilm_IdFilm(int idFilm);

    List<Photo> findByCommentaire_IdCommentaire(int idCommentaire);

    @Query("select p from Photo p JOIN FETCH p.film f where f.idFilm = :idFilm")
    Photo findOneFilm_IdFilm(int idFilm, Limit limit);

}
