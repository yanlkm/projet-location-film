const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const requireAuth = require('../middlewares/requireAuth');
const checkUserId = require('../middlewares/checkUserId');

// Consulter toutes les locations associées à un utilisateur
router.get('/:userId',  requireAuth, checkUserId, locationController.getAllLocations);
// Consulter uniquement les locations en cours pour un utilisateur
router.get('/:userId/encours',  requireAuth, checkUserId, locationController.getCurrentLocations);

// Consulter uniquement les locations terminées pour un utilisateur
router.get('/:userId/fini',  requireAuth, checkUserId, locationController.getFinishedLocations);
// Consulter une location en particulier
router.get('/:userId/:idLocation',  requireAuth, checkUserId, locationController.getLocationById);



module.exports = router;
