package com.locafilmback.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentaireDTO {
    private int idCommentaire;
    private String description;
    private String datePublication;
    private String pseudo;
    private int idUtilisateur;
    private int note;

}
