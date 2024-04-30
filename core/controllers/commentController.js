const createMariaDBPool = require("../config/db.js");

// Récupérer tous les commentaires pour un film
const getAllCommentsForFilm = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idFilm = req.params.movieId;

    // vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }

    const response = await sendRequestToSpringBoot(
      {},
      `/commentaires/${idFilm}`,
      "GET"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des commentaires pour ce film",
    });
  }
};

// Ajouter un commentaire pour un film
const addCommentForFilm = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idFilm = req.params.movieId;
    const idUtilisateur = req.params.userId;
    const commentBody = ({ description, note } = req.body);

    // Votre logique pour ajouter un commentaire dans la base de données

    if (
      !description ||
      !note ||
      description.length === 0 ||
      note.length === 0
    ) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    if (description.length > 500) {
      return res.status(400).json({ message: "Commentaire trop long" });
    }
    try {
      const mark = parseInt(note);

      if (mark > 5 || mark < 0 || isNaN(mark)) {
        return res.status(400).json({ message: "Note incorrecte" });
      }
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Saisir une valeur nombre pour la note" });
    }

    // vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }

    const response = await sendRequestToSpringBoot(
      commentBody,
      `/commentaires/${idFilm}/${idUtilisateur}`,
      "POST"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de l'ajout du commentaire pour ce film",
    });
  }
};

// Récupérer un commentaire par son ID pour un film
const getCommentByIdForFilm = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idFilm = req.params.movieId;
    const idCommentaire = req.params.commentId;
    const comment = await pool.query(
      "SELECT * FROM Commentaire WHERE idFilm = ? AND idCommentaire = ?",
      [idFilm, idCommentaire]
    );
    if (comment.length === 0) {
      return res
        .status(404)
        .json({ message: "Le commentaire spécifié n'existe pas" });
    }
    const response = await sendRequestToSpringBoot(
        {},
        `/commentaires/${idFilm}/${idCommentaire}`,
        "GET"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération du commentaire pour ce film",
    });
  }
};

// Mettre à jour un commentaire pour un film
const updateCommentForFilm = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idFilm = req.params.movieId;
    const idCommentaire = req.params.commentId;
    const idUtilisateur = req.params.userId;
    const commentBody = ({ description, note } = req.body);

    // Votre logique pour mettre à jour un commentaire dans la base de données

    if (
      !description ||
      !note ||
      description.length === 0 ||
      note.length === 0
    ) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    if (description.length > 500) {
      return res.status(400).json({ message: "Commentaire trop long" });
    }
    try {
      const mark = parseInt(note);
      if (mark > 5 || mark < 0 || isNaN(mark)) {
        return res.status(400).json({ message: "Note maximale de 5" });
      }
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Saisir une valeur nombre pour la note" });
    }

    // Vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }

    // Vérifier que le commentaire existe
    const existingComment = await pool.query(
      "SELECT * FROM Commentaire WHERE idCommentaire = ?",
      [idCommentaire]
    );
    if (existingComment.length === 0) {
      return res.status(400).json({ message: "Le commentaire n'existe pas" });
    }

    const response = await sendRequestToSpringBoot(
      commentBody,
      `/commentaires/${idFilm}/${idCommentaire}/${idUtilisateur}`,
      "PUT"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la mise à jour du commentaire pour ce film",
    });
  }
};

// Supprimer un commentaire pour un film
const deleteCommentForFilm = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idFilm = req.params.movieId;
    const idCommentaire = req.params.commentId;
    const idUtilisateur = req.params.userId;
    // Vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }

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
      `/commentaires/${idFilm}/${idCommentaire}/${idUtilisateur}`,
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

module.exports = {
  getAllCommentsForFilm,
  addCommentForFilm,
  getCommentByIdForFilm,
  updateCommentForFilm,
  deleteCommentForFilm,
};
