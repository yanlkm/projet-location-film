package com.locafilmback.services;

import com.locafilmback.models.Commentaire;
import com.locafilmback.repositories.CommentaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentaireService {

    private final CommentaireRepository commentaireRepository;

    @Autowired
    public CommentaireService(CommentaireRepository commentaireRepository) {
        this.commentaireRepository = commentaireRepository;
    }
    public Commentaire getCommentaireById(int idCommentaire) {
        return commentaireRepository.findBy_IdCommentaire(idCommentaire);
    }
    public List<Commentaire> getAllCommentairesForFilm(int idFilm) {
        return commentaireRepository.findAllByIdFilmWithUtilisateurAndFilm(idFilm);
    }

    public Commentaire getCommentaireByIdForFilm(int idFilm, int idCommentaire) {
       return commentaireRepository.findCommentaireByIdFilmAndIdCommentaireWithUtilisateurAndFilm(idFilm,idCommentaire);

    }

    public void addCommentaireForFilm(Commentaire commentaire) {
        // Ajustez la date de publication (si nécessaire)
        commentaire.setDatePublication(new java.sql.Date(System.currentTimeMillis()));
        // Définissez le statut initial du commentaire à 'A'
        commentaire.setValidite('A');
        commentaireRepository.save(commentaire);
    }

    public void updateCommentaireForFilm(Commentaire commentaire) {
        // Vérifiez d'abord si le commentaire existe
        Optional<Commentaire> existingCommentaireOptional = commentaireRepository.findById(commentaire.getIdCommentaire());

        if (existingCommentaireOptional.isPresent()) {
            Commentaire existingCommentaire = existingCommentaireOptional.get();

            if(existingCommentaire.getValidite()=='A')
            // Mettez à jour les champs nécessaires du commentaire
            {
                existingCommentaire.setDescription(commentaire.getDescription());
                existingCommentaire.setNote(commentaire.getNote());
                existingCommentaire.setDatePublication(new java.sql.Date(System.currentTimeMillis())); // Optionnel : mettre à jour la date de publication

                commentaireRepository.save(existingCommentaire);
            }
        }
    }

    public void deleteCommentaireForFilm(int idFilm, int idCommentaire, int idUtilisateur) {
        Optional<Commentaire> optionalCommentaire = commentaireRepository.findById(idCommentaire);
        if (optionalCommentaire.isPresent()) {
            Commentaire commentaire = optionalCommentaire.get();
            // Vérifiez si le commentaire appartient bien au film spécifié et a été posté par l'utilisateur spécifié
            if (commentaire.getFilm().getIdFilm() == idFilm && commentaire.getUtilisateur().getIdUtilisateur() == idUtilisateur) {
                commentaire.setValidite('N'); // Mettre à jour la validité du commentaire
                commentaireRepository.save(commentaire); // Enregistrer les modifications dans la base de données
            }
        }
    }

    public void deleteCommentaireForFilmByAdmin( int idCommentaire) {
        Optional<Commentaire> optionalCommentaire = commentaireRepository.findById(idCommentaire);
        if (optionalCommentaire.isPresent()) {
            Commentaire commentaire = optionalCommentaire.get();
            // Vérifiez si le commentaire appartient bien au film spécifié et a été posté par l'utilisateur spécifié

                commentaire.setValidite('N'); // Mettre à jour la validité du commentaire
                commentaireRepository.save(commentaire); // Enregistrer les modifications dans la base de données

        }
    }

}
