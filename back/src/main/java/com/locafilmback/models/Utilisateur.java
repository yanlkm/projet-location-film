package com.locafilmback.models;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@Entity
@Transactional
@Table(name = "Utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUtilisateur;

    @Column(unique = true)
    private String pseudo;

    private String nom;
    private String prenom;
    private Date dateNaissance;

    @Column(unique = true)
    private String mail;

    private String mdp;
    private char validite;
    private char role;

    public Utilisateur() {}
}
