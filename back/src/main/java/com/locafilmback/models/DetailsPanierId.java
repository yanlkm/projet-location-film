package com.locafilmback.models;

import java.io.Serializable;
import javax.persistence.Embeddable;
import lombok.EqualsAndHashCode;

@Embeddable
@EqualsAndHashCode
public class DetailsPanierId implements Serializable {
    private int idFilm;
    private int idPanier;

    public DetailsPanierId() {}
    public DetailsPanierId(int idFilm, int idPanier) {
        this.idFilm = idFilm;
        this.idPanier = idPanier;
    }

    // Constructeur par défaut
}

