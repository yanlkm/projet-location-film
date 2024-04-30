package com.locafilmback.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class FilmBodyDTO {
    private int idFilm;
    private String nom;
    private String synopsis;
    private String url;
    private String realisateur;
    private String genre;
    private Date dateSortie;
    private char validite;
    private double prix;
    private Integer pegi;
    private String photo;

}
