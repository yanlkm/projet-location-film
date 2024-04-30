package com.locafilmback.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "DetailsPanier")
public class DetailsPanier {

    @EmbeddedId
    private DetailsPanierId id;

    @ManyToOne
    @JoinColumn(name = "idFilm", referencedColumnName = "idFilm", insertable = false, updatable = false)
    private Film film;

    @ManyToOne
    @JoinColumn(name = "idPanier", referencedColumnName = "idPanier", insertable = false, updatable = false)
    private Panier panier;

    // Constructeur par défaut
}
