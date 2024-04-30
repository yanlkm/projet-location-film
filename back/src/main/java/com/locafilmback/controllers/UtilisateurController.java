package com.locafilmback.controllers;

import com.locafilmback.dtos.UtilisateurDTO;
import com.locafilmback.mappers.UtilisateurMapper;
import com.locafilmback.models.Panier;
import com.locafilmback.models.Utilisateur;
import com.locafilmback.repositories.PanierRepository;
import com.locafilmback.services.UtilisateurService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;
    private final PanierRepository panierRepository;
    private final UtilisateurMapper utilisateurMapper;
    public UtilisateurController(UtilisateurService utilisateurService, PanierRepository panierRepository, UtilisateurMapper utilisateurMapper) {
        this.utilisateurService = utilisateurService;
        this.panierRepository = panierRepository;
        this.utilisateurMapper = utilisateurMapper;
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        List<UtilisateurDTO> utilisateurs = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }

    @GetMapping("/{idUtilisateur}")
    public ResponseEntity<?> getUtilisateurById(@PathVariable int idUtilisateur) {
        return getResponseEntity(idUtilisateur, utilisateurService);

    }

    static ResponseEntity<?> getResponseEntity(@PathVariable int idUtilisateur, UtilisateurService utilisateurService) {
        try {
            UtilisateurDTO utilisateur = utilisateurService.getUtilisateurById(idUtilisateur);
            if (utilisateur != null) {
                return ResponseEntity.ok(utilisateur);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
            }
        }catch( IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createUtilisateur(@RequestBody UtilisateurDTO utilisateurDTO) {
        Utilisateur createdUtilisateur = utilisateurService.createUtilisateur(utilisateurDTO);
        if (createdUtilisateur != null) {
            // Créer automatiquement le panier pour cet utilisateur avec le statut 'E'
            Panier panier = new Panier();
            panier.setUtilisateur(createdUtilisateur);
            panier.setStatut('E'); //
            panierRepository.save(panier);

            return ResponseEntity.status(HttpStatus.CREATED).body(utilisateurMapper.utilisateurToUtilisateurDTO(createdUtilisateur));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pseudo ou e-mail déjà utilisé.");
        }
    }

    @PutMapping("/{idUtilisateur}")
    public ResponseEntity<?> updateUtilisateur(@PathVariable int idUtilisateur, @RequestBody UtilisateurDTO utilisateurDTO) {
        UtilisateurDTO updatedUtilisateur;
        try {
            updatedUtilisateur = utilisateurService.updateUtilisateur(idUtilisateur, utilisateurDTO);
            if (updatedUtilisateur != null) {
                return ResponseEntity.ok(updatedUtilisateur);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
            }
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Adresse e-mail ou pseudo déjà utilisé.");
        }
    }
    @DeleteMapping("/{idUtilisateur}")
    public ResponseEntity<?> deleteUtilisateur(@PathVariable int idUtilisateur) {
        utilisateurService.deleteUtilisateur(idUtilisateur);
        return ResponseEntity.ok("Utilisateur supprimée");
    }

}
