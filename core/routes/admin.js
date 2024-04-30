const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const requireAuth = require('../middlewares/requireAuth');
const checkAdminId = require('../middlewares/checkAdminId');

// Récupérer tous les comptes utilisateurs
router.get("/comptes", requireAuth, checkAdminId, adminController.getAllUsers);

// Bannir/supprimer un utilisateur
router.delete("/comptes/bannir/:userId",requireAuth, checkAdminId, adminController.banUser);

// Supprimer définitivement un utilisateur
router.delete("/comptes/supprimer/:userId",requireAuth, checkAdminId, adminController.deleteUser);

// Debannir un utilisateur
router.get("/comptes/debannir/:userId",requireAuth, checkAdminId, adminController.unbanUser);

// Récupérer tous les films
router.get("/films", requireAuth, checkAdminId,adminController.getAllFilms);

// Ajouter un film
router.post("/films", requireAuth, checkAdminId,adminController.addFilm);

// Mettre à jour un film
router.put("/films/:movieId",requireAuth, checkAdminId, adminController.updateFilm);

// Mettre à jour l'état d'un film (suppression)
router.delete("/films/:movieId",requireAuth, checkAdminId, adminController.updateStateFilm);

// Mettre à jour l'état d'un film (suppression)
router.delete("/commentaires/:commentId",requireAuth, checkAdminId, adminController.deleteCommentForFilm);

// Obtenir toutes les locations de tous les utilisateurs
router.get("/locations",requireAuth, checkAdminId, adminController.getAllLocations);

// Obtenir les informations d'une location en particulier
router.get("/locations/:locationId", requireAuth, checkAdminId,adminController.getLocationById);

module.exports = router;
