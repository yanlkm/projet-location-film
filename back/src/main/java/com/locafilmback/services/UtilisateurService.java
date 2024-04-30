package com.locafilmback.services;

import com.locafilmback.dtos.UtilisateurDTO;
import com.locafilmback.mappers.UtilisateurMapper;
import com.locafilmback.models.Utilisateur;
import com.locafilmback.repositories.UtilisateurRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    private final UtilisateurMapper utilisateurMapper;

    public UtilisateurService(UtilisateurRepository utilisateurRepository, UtilisateurMapper utilisateurMapper) {
        this.utilisateurRepository = utilisateurRepository;
        this.utilisateurMapper = utilisateurMapper;
    }

    public List<UtilisateurDTO> getAllUtilisateurs() {
        return utilisateurRepository.getAllUtilisateurs().stream()
                .map(utilisateurMapper::utilisateurToUtilisateurDTO)
                .collect(Collectors.toList());
    }

    public UtilisateurDTO getUtilisateurById(int idUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        return utilisateurMapper.utilisateurToUtilisateurDTO(utilisateur);
    }

    public Utilisateur createUtilisateur(UtilisateurDTO utilisateurDTO) {
        Utilisateur utilisateur = utilisateurMapper.utilisateurDTOToUtilisateur(utilisateurDTO);
        try {
            utilisateur = utilisateurRepository.save(utilisateur);
            return utilisateur;
        } catch (DataIntegrityViolationException e) {
            return null;
        }
    }

    @Transactional
    public UtilisateurDTO updateUtilisateur(int idUtilisateur, UtilisateurDTO utilisateurDTO) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        utilisateur.setNom(utilisateurDTO.getNom());
        utilisateur.setPrenom(utilisateurDTO.getPrenom());
        utilisateur.setDateNaissance(utilisateurDTO.getDateNaissance());
        utilisateur.setMdp(utilisateurDTO.getMdp());

        return utilisateurMapper.utilisateurToUtilisateurDTO(utilisateur);
    }

    @Transactional
    public void deleteUtilisateur(int idUtilisateur) {
        utilisateurRepository.updateValiditeById(idUtilisateur);
    }

    @Transactional
    public void activateUtilisateur(int idUtilisateur) {
        utilisateurRepository.updateValiditeOnAById(idUtilisateur);

    }
}
