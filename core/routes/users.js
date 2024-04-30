const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');
const requireAuth = require('../middlewares/requireAuth');
const checkUserId = require('../middlewares/checkUserId');
const adminController = require('../controllers/adminController')

// Routes pour les utilisateurs
router.get('/', adminController.getAllUsers);
router.post('/', usersController.createUser);
router.put('/:userId', usersController.updateUser);
router.delete('/supprimer/:userId', requireAuth, checkUserId,adminController.deleteUser, usersController.logoutUser);
router.delete('/:userId', requireAuth, checkUserId, usersController.deleteUser, usersController.logoutUser);
router.get('/:userId', requireAuth, checkUserId, usersController.getUser);

module.exports = router;
