package com.locafilmback.repositories;

import com.locafilmback.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {

    @Modifying
    @Query("UPDATE Utilisateur u SET u.validite = 'N' WHERE u.idUtilisateur = :idUtilisateur")
    void updateValiditeById(@Param("idUtilisateur") int idUtilisateur);
    @Modifying
    @Query("UPDATE Utilisateur u SET u.validite = 'A' WHERE u.idUtilisateur = :idUtilisateur")
    void updateValiditeOnAById(@Param("idUtilisateur") int idUtilisateur);

    @Query("select u from  Utilisateur  u where u.role = 'N'")
    List<Utilisateur> getAllUtilisateurs();
}
