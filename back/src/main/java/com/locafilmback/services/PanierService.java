package com.locafilmback.services;

import com.locafilmback.models.*;
import com.locafilmback.repositories.PanierRepository;
import com.locafilmback.repositories.DetailsPanierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PanierService {

    private final PanierRepository panierRepository;
    private final DetailsPanierRepository detailsPanierRepository;



    public PanierService(PanierRepository panierRepository, DetailsPanierRepository detailsPanierRepository) {
        this.panierRepository = panierRepository;
        this.detailsPanierRepository = detailsPanierRepository;
    }

    public int getPanierIdByUserId(int idUtilisateur) {
        Panier panier = panierRepository.findByUtilisateur_IdUtilisateur(idUtilisateur);
        if (panier != null) {
            return panier.getIdPanier();
        }
        return -1; // Si le panier n'est pas trouvé, retourne -1 ou lance une exception
    }

    public void addFilmToPanier(int idUtilisateur, int idFilm) {
        int idPanier = getPanierIdByUserId(idUtilisateur);

        // Créer un nouvel objet DetailsPanier
        DetailsPanier detailsPanier = new DetailsPanier();
        detailsPanier.setId(new DetailsPanierId(idFilm, idPanier));

        // Enregistrer le nouvel objet DetailsPanier
        detailsPanierRepository.save(detailsPanier);
    }
    public void updatePanier(int idUtilisateur, FilmPanier filmPanier) {
        int idPanier = getPanierIdByUserId(idUtilisateur);

        if (idPanier != -1) {
            if (filmPanier.isAjout()) {
                // Ajouter le film au panier

                addFilmToPanier(idPanier, filmPanier.getIdFilm());

            } else {
                // Supprimer le film du panier
                detailsPanierRepository.removeFilmFromPanier(idPanier, filmPanier.getIdFilm());
            }
        }
    }

    public void clearPanier(int idUtilisateur) {
        int idPanier = getPanierIdByUserId(idUtilisateur);
        detailsPanierRepository.clearPanier(idPanier);
    }




    public Panier getPanierByUserId(int idUtilisateur) {
        Panier panier = panierRepository.findByUtilisateur_IdUtilisateur(idUtilisateur);
        if (panier==null) return null;
        // Charger explicitement l'utilisateur associé au panier
        Utilisateur utilisateur = panier.getUtilisateur();
        if (utilisateur != null) {
            utilisateur.getIdUtilisateur(); // Charger l'ID de l'utilisateur associé au panier
        }

        return panier;
    }



    public List<DetailsPanier> getDetailsPanierById(int idPanier) {
        return detailsPanierRepository.findByPanier_IdPanier(idPanier);
    }


}
