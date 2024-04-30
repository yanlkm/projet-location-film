const express = require('express');
const router = express.Router();
const {
  getAllPicturesFromMovie,
  addPictureToMovie,
  getAllPicturesFromComment,
  addPictureToComment,
  deletePicture,
} = require('../controllers/pictureController');

// Récupérer toutes les photos d'un film
router.get('/films/:movieId', getAllPicturesFromMovie);

// Ajouter une photo pour un film
router.post('/films/:movieId', addPictureToMovie);

// Récupérer toutes les photos d'un commentaire
router.get('/commentaires/:commentId', getAllPicturesFromComment);

// Ajouter une photo pour un commentaire
router.post('/commentaires/:commentId', addPictureToComment);

// Supprimer une photo
router.delete('/:idPhoto', deletePicture);

module.exports = router;
