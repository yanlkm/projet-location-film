const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { addFilmToHistory } = require("../controllers/historicalController");
const { getFilmListByUserId } = require("../controllers/historicalController");
// Récupérer tous les films (actifs ou visibles)
router.get("/", movieController.getAllFilms);

// récupérer tous les films visités (si connecté)
router.get("/visites", getFilmListByUserId);

// Récupérer les details d'un film
router.get("/:movieId", addFilmToHistory, movieController.getFilmById);

module.exports = router;
