package com.locafilmback.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Transactional
@Table(name = "Panier", uniqueConstraints = @UniqueConstraint(columnNames = "idUtilisateur"))
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPanier;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idUtilisateur", unique = true) 
    private Utilisateur utilisateur;

    private char statut;

}
