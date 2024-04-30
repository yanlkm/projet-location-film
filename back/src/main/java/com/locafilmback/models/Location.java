package com.locafilmback.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "Location")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idLocation;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idUtilisateur", referencedColumnName = "idUtilisateur")
    private Utilisateur utilisateur;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idFilm", referencedColumnName = "idFilm")
    private Film film;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "dateDebut")
    private Date dateDebut;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "dateFin")
    private Date dateFin;

    public Location() {}

    public void setIdUtilisateur(int idUtilisateur) {
        if (this.utilisateur == null) {
            this.utilisateur = new Utilisateur();
        }
        this.utilisateur.setIdUtilisateur(idUtilisateur);
    }

    public void setIdFilm(int idFilm) {
        if (this.film == null) {
            this.film = new Film();
        }
        this.film.setIdFilm(idFilm);
    }
}
