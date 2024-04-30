package com.locafilmback.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Photo")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPhoto")
    private int idPhoto;

    @Column(name = "image", nullable = false, columnDefinition = "LONGTEXT")
    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCommentaire", referencedColumnName = "idCommentaire")
    private Commentaire commentaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idFilm", referencedColumnName = "idFilm")
    private Film film;

}
