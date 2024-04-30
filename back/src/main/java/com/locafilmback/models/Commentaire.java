package com.locafilmback.models;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Getter
@Setter
@Table(name = "Commentaire")
public class Commentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCommentaire")
    private int idCommentaire;

    @Column(name = "description", length = 500, nullable = false)
    private String description;

    @Column(name = "note", nullable = false)
    private int note;

    @Column(name = "datePublication", nullable = false)
    private Date datePublication;

    @Column(name = "validite", length = 1, nullable = false)
    private char validite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idUtilisateur", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idFilm", nullable = false)
    private Film film;

}
