package com.locafilmback.mappers;

import com.locafilmback.dtos.UtilisateurDTO;
import com.locafilmback.models.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class UtilisateurMapperImpl implements UtilisateurMapper {

    @Override
    public UtilisateurDTO utilisateurToUtilisateurDTO(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }

        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setIdUtilisateur(utilisateur.getIdUtilisateur());
        utilisateurDTO.setDateNaissance(utilisateur.getDateNaissance());
        utilisateurDTO.setMail(utilisateur.getMail());
        utilisateurDTO.setNom(utilisateur.getNom());
        utilisateurDTO.setPrenom(utilisateur.getPrenom());
        utilisateurDTO.setPseudo(utilisateur.getPseudo());
        utilisateurDTO.setRole(utilisateur.getRole());
        utilisateurDTO.setValidite(utilisateur.getValidite());

        return utilisateurDTO;
    }

    @Override
    public Utilisateur utilisateurDTOToUtilisateur(UtilisateurDTO utilisateurDTO) {
        if (utilisateurDTO == null) {
            return null;
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setIdUtilisateur(utilisateurDTO.getIdUtilisateur());
        utilisateur.setDateNaissance(utilisateurDTO.getDateNaissance());
        utilisateur.setMail(utilisateurDTO.getMail());
        utilisateur.setMdp(utilisateurDTO.getMdp()); // Garder le mot de passe lors de la conversion de DTO à Entité
        utilisateur.setNom(utilisateurDTO.getNom());
        utilisateur.setPrenom(utilisateurDTO.getPrenom());
        utilisateur.setPseudo(utilisateurDTO.getPseudo());
        utilisateur.setRole(utilisateurDTO.getRole());
        utilisateur.setValidite(utilisateurDTO.getValidite());

        return utilisateur;
    }
}
