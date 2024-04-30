package com.locafilmback.dtos;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class UtilisateurDTO {
    private int idUtilisateur;
    private String pseudo;
    private String nom;
    private String prenom;
    private Date dateNaissance;
    private String mail;
    private String mdp;
    private char validite;
    private char role;

}
