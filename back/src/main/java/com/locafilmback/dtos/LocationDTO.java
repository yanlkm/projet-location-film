package com.locafilmback.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.locafilmback.models.Film;
import com.locafilmback.models.Location;
import com.locafilmback.models.Utilisateur;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationDTO {
    private Location location;
    private int idUtilisateur;
    @JsonIgnore
    private Film film;
    private String nomFilm;
    private String nomUtilisateur;
    private String urlFilm;
    private String photo;
    private int idFilm;

    // Getters et setters
}
