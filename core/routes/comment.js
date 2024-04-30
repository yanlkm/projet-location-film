const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const requireAuth = require('../middlewares/requireAuth');
const checkUserId = require('../middlewares/checkUserId');

// Récupérer tous les commentaires pour un film
router.get('/:movieId', commentController.getAllCommentsForFilm);

// Ajouter un commentaire pour un film
router.post('/:movieId/:userId',  requireAuth, checkUserId,commentController.addCommentForFilm);

// Récupérer un commentaire par son ID pour un film
router.get('/:movieId/:commentId', commentController.getCommentByIdForFilm);

// Mettre à jour un commentaire pour un film
router.put('/:movieId/:commentId/:userId',  requireAuth, checkUserId,commentController.updateCommentForFilm);

// Supprimer un commentaire pour un film
router.delete('/:movieId/:commentId/:userId',  requireAuth, checkUserId, commentController.deleteCommentForFilm);

module.exports = router;
