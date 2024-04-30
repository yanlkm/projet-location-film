const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const requireAuth = require('../middlewares/requireAuth');
const checkUserId = require('../middlewares/checkUserId');

// Récupérer le contenu du panier d'un utilisateur
router.get('/:userId',  requireAuth, checkUserId, cartController.getCart);

// Ajouter un film au panier d'un utilisateur
router.post('/:userId', requireAuth, checkUserId, cartController.addToCart);

// Modifier le panier d'un utilisateur
router.put('/:userId',requireAuth, checkUserId,  cartController.updateCart);

// Vider le panier d'un utilisateur
router.delete('/:userId', requireAuth, checkUserId, cartController.emptyCart);

module.exports = router;
