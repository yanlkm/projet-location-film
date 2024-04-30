package com.locafilmback.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "Film")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idFilm")
    private int idFilm;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "synopsis", nullable = false, length = 1500)
    private String synopsis;

    @Column(name = "url", nullable = false, length = 500)
    private String url;

    @Column(name = "realisateur", nullable = false)
    private String realisateur;

    @Column(name = "genre", nullable = false)
    private String genre;

    @Column(name = "dateSortie", nullable = false)
    private Date dateSortie;

    @Column(name = "validite", nullable = false, length = 1)
    private char validite;

    @Column(name = "prix", nullable = false)
    private double prix;

    @Column(name = "pegi")
    private Integer pegi;
}
