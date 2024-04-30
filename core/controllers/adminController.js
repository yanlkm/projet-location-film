const createMariaDBPool = require("../config/db");

// Récupérer tous les comptes utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    // Envoi de la requête au serveur Spring Boot
    const response = await sendRequestToSpringBoot({}, `/admin/comptes`, "GET");

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Bannir/supprimer un utilisateur
exports.banUser = async (req, res) => {
  try {
    const idUtilisateur = req.params.userId;

    const pool = await createMariaDBPool();

    // Envoi de la requête au serveur Spring Boot pour vérifier si l'utilisateur existe
    const existingUser = await pool.query(
      "SELECT * FROM Utilisateur WHERE idUtilisateur = ?",
      [idUtilisateur]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Envoi de la requête au serveur Spring Boot
    const response = await sendRequestToSpringBoot(
      {},
      `/admin/comptes/bannir/${idUtilisateur}`,
      "DELETE"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Créer une connexion à la base de données
    const pool = await createMariaDBPool();
    const userId = req.params.userId;

    // Envoi de la requête au serveur Spring Boot pour vérifier si l'utilisateur existe
    const existingUser = await pool.query(
      "SELECT * FROM Utilisateur WHERE idUtilisateur = ?",
      [userId]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

   // Supprimer les enregistrements liés à l'utilisateur dans la table DetailsPanier
   await pool.query("DELETE FROM DetailsPanier WHERE idPanier IN (SELECT idPanier FROM Panier WHERE idUtilisateur = ?)", [userId]);

   // Supprimer les enregistrements liés à l'utilisateur dans la table Photo
   await pool.query("DELETE FROM Photo WHERE idCommentaire IN (SELECT idCommentaire FROM Commentaire WHERE idUtilisateur = ?) ", [userId]); 
   
   // Supprimer les enregistrements de la table Location
   await pool.query("DELETE FROM Location WHERE idUtilisateur = ?", [userId]);
   
   // Supprimer les enregistrements de la table Panier
   await pool.query("DELETE FROM Panier WHERE idUtilisateur = ?", [userId]);
   
   // Supprimer les enregistrements de la table Commentaire
   await pool.query("DELETE FROM Commentaire WHERE idUtilisateur = ?", [userId]);
   
   // Supprimer l'utilisateur lui-même
   await pool.query("DELETE FROM Utilisateur WHERE idUtilisateur = ?", [userId]);

   res.status(200).json({ message: "L'utilisateur et ses données associées ont été supprimés avec succès." });

  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de la suppression de l'utilisateur.",
      });
  }
};

// Debannir un utilisateur
exports.unbanUser = async (req, res) => {
  try {
    const idUtilisateur = req.params.userId;

    const pool = await createMariaDBPool();

    // Envoi de la requête au serveur Spring Boot pour vérifier si l'utilisateur existe
    const existingUser = await pool.query(
      "SELECT * FROM Utilisateur WHERE idUtilisateur = ?",
      [idUtilisateur]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Envoi de la requête au serveur Spring Boot
    const response = await sendRequestToSpringBoot(
      {},
      `/admin/comptes/debannir/${idUtilisateur}`,
      "GET"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Récupérer tous les films
exports.getAllFilms = async (req, res) => {
  try {
    // Envoi de la requête au serveur Spring Boot
    const response = await sendRequestToSpringBoot({}, `/admin/films`, "GET");

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Ajouter un film
exports.addFilm = async (req, res) => {
  try {
    const movieToAdd = ({
      nom,
      genre,
      realisateur,
      synopsis,
      url,
      dateSortie,
      validite,
      prix,
      pegi,
    } = req.body);
    // Implémentation de la vérification pour créer un film
    // Vérifier que tous les champs sont présents
    if (
      !nom ||
      !genre ||
      !realisateur ||
      !synopsis ||
      !url ||
      !dateSortie ||
      !validite ||
      !prix ||
      !pegi
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs doivent être renseignés" });
    }

    // Vérifier que la validité est soit 'V' soit 'N'
    if (validite !== "V" && validite !== "N") {
      return res.status(400).json({
        message: "La validité doit être 'V' (valide) ou 'N' (non valide)",
      });
    }

    // Vérifier que le prix est un double supérieur à 0 et inférieur à 100
    if (typeof prix !== "number" || prix <= 0 || prix >= 100) {
      return res.status(400).json({
        message: "Le prix doit être un nombre supérieur à 0 et inférieur à 100",
      });
    }

    // Vérifier que la date de sortie est valide
    const releaseDate = new Date(dateSortie);
    if (isNaN(releaseDate.getTime())) {
      return res
        .status(400)
        .json({ message: "La date de sortie doit être une date valide " });
    }

    // Vérifier que le pegi est un nombre entier
    if (!Number.isInteger(pegi) || pegi < 0 || pegi > 18) {
      return res.status(400).json({
        message: "Le pegi doit être un nombre entier positif en 0 et 18",
      });
    }

    const response = await sendRequestToSpringBoot(
      movieToAdd,
      `/admin/films`,
      "POST"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Mettre à jour un film
exports.updateFilm = async (req, res) => {
  try {
    // Récupérer l'ID du film à mettre à jour depuis les paramètres de la requête
    const idFilm = req.params.movieId;

    const pool = await createMariaDBPool();
    // les mêmes vérifications
    // vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }

    // Récupérer les données du corps de la requête
    const movieToUpdate = ({
      nom,
      genre,
      realisateur,
      synopsis,
      url,
      dateSortie,
      prix,
      pegi,
    } = req.body);

    // Vérifier si tous les champs sont présents
    if (
      !nom ||
      !genre ||
      !realisateur ||
      !synopsis ||
      !url ||
      !dateSortie ||
      !prix ||
      !pegi
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier que le prix est un double supérieur à 0 et inférieur à 100
    if (typeof prix !== "number" || prix <= 0 || prix >= 100) {
      return res.status(400).json({
        message: "Le prix doit être un nombre supérieur à 0 et inférieur à 100",
      });
    }

    // Vérifier si la date de sortie est valide
    const dateSortieRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateSortie.match(dateSortieRegex)) {
      return res
        .status(400)
        .json({ message: "La date de sortie doit être au format YYYY-MM-DD" });
    }

    // Vérifier si le pegi est un entier entre 0 et 18
    if (typeof pegi !== "number" || pegi < 0 || pegi > 18) {
      return res
        .status(400)
        .json({ message: "Le pegi doit être un entier entre 0 et 18" });
    }

    // envoyer le film modifier
    const response = await sendRequestToSpringBoot(
      movieToUpdate,
      `/admin/films/${idFilm}`,
      "PUT"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Mettre à jour un film (etat)
exports.updateStateFilm = async (req, res) => {
  try {
    // Récupérer l'ID du film à mettre à jour depuis les paramètres de la requête
    const idFilm = req.params.movieId;

    const pool = await createMariaDBPool();

    // vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }

    // Supprimer l'ID du film de tous les détails panier
    await pool.query("DELETE FROM DetailsPanier WHERE idFilm = ?", [idFilm]);

    // envoyer le film modifier
    const response = await sendRequestToSpringBoot(
      {},
      `/admin/films/${idFilm}`,
      "DELETE"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Obtenir toutes les locations de tous les utilisateurs
exports.getAllLocations = async (req, res) => {
  try {
    // récupérer toutes les locations
    const response = await sendRequestToSpringBoot(
      {},
      `/admin/locations`,
      "GET"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Obtenir les informations d'une location en particulier
exports.getLocationById = async (req, res) => {
  try {
    const idLocation = req.params.locationId;

    const pool = await createMariaDBPool();
    const location = await pool.query(
      "SELECT * FROM Location WHERE idLocation = ?",
      [idLocation]
    );
    if (location.length === 0) {
      return res.status(404).json({ message: "Location non trouvée" });
    }

    const response = await sendRequestToSpringBoot(
      {},
      `/admin/locations/${idLocation}`,
      "GET"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};
exports.deleteCommentForFilm = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idCommentaire = req.params.commentId;

    // Vérifier que le commentaire existe
    const existingComment = await pool.query(
      "SELECT * FROM Commentaire WHERE idCommentaire = ?",
      [idCommentaire]
    );
    if (existingComment.length === 0) {
      return res.status(400).json({ message: "Le commentaire n'existe pas" });
    }

    // Votre logique pour supprimer un commentaire dans la base de données

    const response = await sendRequestToSpringBoot(
      {},
      `/admin/commentaires/${idCommentaire}`,
      "DELETE"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la suppression du commentaire pour ce film",
    });
  }
};
// Fonction pour envoyer les requêtes au serveur Spring Boot
async function sendRequestToSpringBoot(data, route, method) {
  try {
    // Vérifier si la méthode est GET ou HEAD
    if (method === "GET" || method === "HEAD") {
      // Ne pas inclure de corps de requête pour les requêtes GET ou HEAD
      var options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      // Pour les autres méthodes, inclure le corps de requête
      var options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
    }
    const response = await fetch(`http://localhost:8082${route}`, options);

    // Vérifier si le statut de la réponse est 204 (No Content)
    if (response.status === 204) {
      // Si c'est le cas, retourner simplement le statut sans essayer de parser le corps de la réponse
      return { statusCode: response.status, data: null };
    }

    // Si le statut est différent de 204, alors la réponse a du contenu
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      // Si le contenu est de type JSON, le parser et le retourner
      const responseData = await response.json();
      return { statusCode: response.status, data: responseData };
    } else {
      // Sinon, retourner la réponse brute sous forme de texte
      const responseData = await response.text();
      return { statusCode: response.status, data: responseData };
    }
  } catch (error) {
    // En cas d'erreur lors de la communication avec le serveur Spring Boot, retourner une réponse d'erreur
    return {
      statusCode: 500,
      data: {
        message:
          "Une erreur est survenue lors de la communication avec le serveur Spring Boot",
      },
    };
  }
}
