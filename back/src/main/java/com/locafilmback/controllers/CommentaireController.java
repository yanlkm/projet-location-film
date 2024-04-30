package com.locafilmback.controllers;

import com.locafilmback.dtos.CommentaireBodyDTO;
import com.locafilmback.dtos.CommentaireDTO;
import com.locafilmback.models.Commentaire;
import com.locafilmback.models.Film;
import com.locafilmback.models.Utilisateur;
import com.locafilmback.repositories.FilmRepository;
import com.locafilmback.repositories.UtilisateurRepository;
import com.locafilmback.services.CommentaireService;
import com.locafilmback.services.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/commentaires")
public class CommentaireController {

    private final CommentaireService commentaireService;
    private final UtilisateurRepository utilisateurRepository;
    private final FilmRepository filmRepository;

    @Autowired
    public CommentaireController(CommentaireService commentaireService, UtilisateurRepository utilisateurRepository, FilmRepository filmRepository) {
        this.commentaireService = commentaireService;
        this.utilisateurRepository = utilisateurRepository;
        this.filmRepository = filmRepository;
    }

    private CommentaireDTO mapToDTO(Commentaire commentaire) {
        CommentaireDTO commentaireDTO = new CommentaireDTO();
        commentaireDTO.setIdCommentaire(commentaire.getIdCommentaire());
        commentaireDTO.setDescription(commentaire.getDescription());
        commentaireDTO.setDatePublication(commentaire.getDatePublication().toString());
        commentaireDTO.setPseudo(commentaire.getUtilisateur().getPseudo());
        commentaireDTO.setIdUtilisateur(commentaire.getUtilisateur().getIdUtilisateur());
        if (commentaire.getUtilisateur().getValidite()=='A')
        commentaireDTO.setPseudo(commentaire.getUtilisateur().getPseudo());
        else {
            commentaireDTO.setPseudo("Utilisateur Inconnu");
        }
        commentaireDTO.setNote(commentaire.getNote());
        return commentaireDTO;
    }

    @GetMapping("/{idFilm}")
    public ResponseEntity<List<CommentaireDTO>> getAllCommentairesForFilm(@PathVariable int idFilm) {
        List<Commentaire> commentaires = commentaireService.getAllCommentairesForFilm(idFilm);
        List<CommentaireDTO> commentairesDTO = new ArrayList<>();

        for (Commentaire commentaire : commentaires) {
            CommentaireDTO commentaireDTO = mapToDTO(commentaire);
            commentairesDTO.add(commentaireDTO);
        }

        return ResponseEntity.ok(commentairesDTO);
    }


    @GetMapping("/{idFilm}/{idCommentaire}")
    public ResponseEntity<CommentaireDTO> getCommentaireByIdForFilm(@PathVariable int idFilm, @PathVariable int idCommentaire) {
        Commentaire commentaire = commentaireService.getCommentaireByIdForFilm(idFilm, idCommentaire);
        if (commentaire != null) {
            return ResponseEntity.ok(mapToDTO(commentaire));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/{idFilm}/{idUtilisateur}")
    public ResponseEntity<String> addCommentaireForFilm(@PathVariable int idFilm, @PathVariable int idUtilisateur, @RequestBody CommentaireBodyDTO commentaireBody) {
        // Créer l'objet Commentaire
        Commentaire commentaire = new Commentaire();
        commentaire.setDescription(commentaireBody.getDescription());
        commentaire.setDatePublication(new java.sql.Date(System.currentTimeMillis()));
        commentaire.setValidite('V');
        commentaire.setNote(commentaireBody.getNote());
        commentaire.setUtilisateur(utilisateurRepository.findById(idUtilisateur).orElse(null));
        commentaire.setFilm(filmRepository.findById(idFilm).orElse(null));

        // Vérifier si l'utilisateur et le film existent
        if (commentaire.getUtilisateur() == null || commentaire.getFilm() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("L'utilisateur ou le film n'existe pas.");
        }

        // Ajouter le commentaire
        commentaireService.addCommentaireForFilm(commentaire);

        return ResponseEntity.ok("Commentaire ajouté avec succès");
    }

    @PutMapping("/{idFilm}/{idCommentaire}/{idUtilisateur}")
    public ResponseEntity<String> updateCommentaireForFilm(@PathVariable int idFilm, @PathVariable int idCommentaire, @PathVariable int idUtilisateur, @RequestBody CommentaireBodyDTO commentaireBody) {
        // Récupérer le commentaire existant
        Commentaire commentaire = commentaireService.getCommentaireByIdForFilm(idFilm, idCommentaire);
        if (commentaire == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Le commentaire n'existe pas.");
        }

        // Vérifier si l'utilisateur correspond à celui associé au commentaire
        if (commentaire.getUtilisateur().getIdUtilisateur() != idUtilisateur) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vous n'êtes pas autorisé à mettre à jour ce commentaire.");
        }

        // Mettre à jour le commentaire
        commentaire.setDescription(commentaireBody.getDescription());
        commentaire.setNote(commentaireBody.getNote());
        commentaireService.updateCommentaireForFilm(commentaire);

        return ResponseEntity.ok("Commentaire mis à jour avec succès");
    }


    @DeleteMapping("/{idFilm}/{idCommentaire}/{idUtilisateur}")
    public ResponseEntity<String> deleteCommentaireForFilm(@PathVariable int idFilm, @PathVariable int idCommentaire, @PathVariable int idUtilisateur) {
        commentaireService.deleteCommentaireForFilm(idFilm, idCommentaire, idUtilisateur);
        return ResponseEntity.ok("Commentaire supprimé avec succès");
    }
}
