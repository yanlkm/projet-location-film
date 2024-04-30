package com.locafilmback.repositories;

import com.locafilmback.models.Panier;
import com.locafilmback.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PanierRepository extends JpaRepository<Panier, Integer> {
    @Query("SELECT p FROM Panier p JOIN FETCH p.utilisateur WHERE p.utilisateur.id = :idUtilisateur")
    Panier findByUtilisateur_IdUtilisateur(@Param("idUtilisateur") int idUtilisateur);

}
