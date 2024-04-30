const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { deleteFilm } = require('../controllers/historicalController'); 
// Routes pour l'authentification
router.post('/connexion', authController.login);
router.get('/deconnexion', deleteFilm, authController.logout);


module.exports = router;
