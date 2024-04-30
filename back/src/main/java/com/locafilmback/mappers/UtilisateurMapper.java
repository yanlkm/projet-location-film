package com.locafilmback.mappers;

import com.locafilmback.dtos.UtilisateurDTO;
import com.locafilmback.models.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE,
        componentModel = "spring", uses= Utilisateur.class)
public interface UtilisateurMapper {
    @Mapping(target = "idUtilisateur", source = "idUtilisateur")
    @Mapping(target = "dateNaissance", source = "dateNaissance")
    @Mapping(target = "mail", source = "mail")
    @Mapping(target = "mdp", source = "mdp")
    @Mapping(target = "nom", source = "nom")
    @Mapping(target = "prenom", source = "prenom")
    @Mapping(target = "pseudo", source = "pseudo")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "validite", source = "validite")
    UtilisateurDTO utilisateurToUtilisateurDTO(Utilisateur utilisateur);

    @Mapping(target = "idUtilisateur", source = "idUtilisateur")
    @Mapping(target = "dateNaissance", source = "dateNaissance")
    @Mapping(target = "mail", source = "mail")
    @Mapping(target = "mdp", source = "mdp")
    @Mapping(target = "nom", source = "nom")
    @Mapping(target = "prenom", source = "prenom")
    @Mapping(target = "pseudo", source = "pseudo")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "validite", source = "validite")
    Utilisateur utilisateurDTOToUtilisateur(UtilisateurDTO utilisateurDTO);
}
