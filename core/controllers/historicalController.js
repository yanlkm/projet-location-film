const Historique = require("../models/historicalModel");
const jwt = require("jsonwebtoken");
const createMariaDBPool = require("../config/db.js");

exports.addFilmToHistory = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;

    // Vérifier si le champ "Cookie" existe dans l'en-tête de la requête
    if (!cookies) {
      return next(); // Terminer le traitement de la requête si le champ "Cookie" est absent
    }

    // Extraire le token JWT du champ "Cookie"
    const tokenCookie = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    // Vérifier si le token JWT a été trouvé dans le champ "Cookie"
    if (!tokenCookie) {
      return next(); // Terminer le traitement de la requête si le token JWT est absent
    }

    const token = tokenCookie.split("=")[1];
    const jwtString = "secret";

    // Vérifier et décoder le token JWT
    jwt.verify(token, jwtString, (err, decoded) => {
      if (err) {
        return next(); // Terminer le traitement de la requête si le token JWT est invalide
      }

      // Ajouter les informations de l'utilisateur authentifié à la requête
      req.user = decoded;
    });

    // Vérifier si le paramètre "movieId" existe dans l'URL de la requête
    if (!req.params.movieId) {
      return next(); // Terminer le traitement de la requête si le paramètre "movieId" est absent
    }

    const idUtilisateur = req.user.idUtilisateur;
    const idFilm = req.params.movieId;
    const pool = await createMariaDBPool();
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      next();
    } else {
      const existingPicture = await pool.query(
        "SELECT * FROM Photo WHERE idFilm = ? limit 1",
        [idFilm]
      );
      let movie = {
        idFilm: existingMovie[0].idFilm,
        nom: existingMovie[0].nom,
        photo: "",
      };

      if (existingPicture.length !== 0) {
        movie.photo = existingPicture[0].image;
      }
      try {
        let historique = await Historique.findOne({ idUtilisateur });

        // Vérifier si l'historique existe
        if (!historique) {
          // Si l'historique n'existe pas, créer un nouveau document avec l'id du film
          historique = new Historique({
            idUtilisateur,
            films: [movie],
          });
        } else {
          // Vérifier si movie.idFilm n'existe pas déjà dans la liste des films
          const isNotDuplicate = historique.films.every(
            (film) => film.idFilm !== movie.idFilm
          );

          if (isNotDuplicate) {
            // Si movie.idFilm n'existe pas dans la liste, l'ajouter
            historique.films.push(movie);
          }
        }

        await historique.save();
        next();
      } catch (error) {
        console.error(error);
        next();
      }
    }
  } catch (err) {
    next();
  }
};
exports.deleteFilm = async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur est connecté
    const cookies = req.headers.cookie;

    // Vérifier si le champ "Cookie" existe dans l'en-tête de la requête
    if (!cookies) {
      return next(); // Terminer le traitement de la requête si le champ "Cookie" est absent
    }

    // Extraire le token JWT du champ "Cookie"
    const tokenCookie = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    // Vérifier si le token JWT a été trouvé dans le champ "Cookie"
    if (!tokenCookie) {
      return next(); // Terminer le traitement de la requête si le token JWT est absent
    }

    const token = tokenCookie.split("=")[1];
    const jwtString = "secret";

    // Vérifier et décoder le token JWT
    jwt.verify(token, jwtString, (err, decoded) => {
      if (err) {
        return next(); // Terminer le traitement de la requête si le token JWT est invalide
      }

      // Ajouter les informations de l'utilisateur authentifié à la requête
      req.user = decoded;
    });

    if (!req.user) {
      next();
    } else{
      const idUtilisateur = req.user.idUtilisateur;
  
      // Supprimer le document correspondant à l'utilisateur
      await Historique.findOneAndDelete({ idUtilisateur });
  
      next();
    }

  } catch (error) {
    console.error(error);
    next();
  }
};

exports.getFilmListByUserId = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est connecté
    const cookies = req.headers.cookie;

    // Vérifier si le champ "Cookie" existe dans l'en-tête de la requête
    if (!cookies) {
      return res.status(200).json({ films: [] });
    }

    // Extraire le token JWT du champ "Cookie"
    const tokenCookie = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    // Vérifier si le token JWT a été trouvé dans le champ "Cookie"
    if (!tokenCookie) {
      return res.status(200).json({ films: [] });
    }

    const token = tokenCookie.split("=")[1];
    const jwtString = "secret";

    // Vérifier et décoder le token JWT
    jwt.verify(token, jwtString, (err, decoded) => {
      if (err) {
        return res.status(200).json({ films: [] });
      }

      // Ajouter les informations de l'utilisateur authentifié à la requête
      req.user = decoded;
    });

    if (!req.user) {
      return res.status(200).json({ films: [] });
    } else {
      const idUtilisateur = req.user.idUtilisateur;

      // Utiliser la méthode statique pour récupérer la liste des idFilms
      const films = await Historique.getIdFilmsByUserId(idUtilisateur);

      res.status(200).json({ films });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération de la liste des films",
    });
  }
};
