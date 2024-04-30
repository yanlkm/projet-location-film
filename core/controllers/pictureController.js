const createMariaDBPool = require("../config/db.js");

const getAllPicturesFromMovie = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idFilm = req.params.movieId;

    // Vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ? and validite = 'V'",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res
        .status(400)
        .json({ message: "L'id de film n'existe pas" });
    }
    const response = await sendRequestToSpringBoot(
      {},
      `/photos/films/${idFilm}`,
      "GET"
    );
    // Renvoyer la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des photos",
    });
  }
};

const addPictureToMovie = async (req, res) => {

  try {
    const pool = await createMariaDBPool();
    const imageSaved = ({ image } = req.body);
    // Vérifier que le champ image n'est pas vide

    if (!imageSaved) {
      return res.status(400).json({ message: "Le champ image est vide" });
    }
    const idFilm = req.params.movieId;

    const existingMovie = await pool.query(
        "SELECT * FROM Film WHERE idFilm = ?",
        [idFilm]
      );
      if (existingMovie.length === 0) {
        return res.status(400).json({ message: "L'id de film n'existe pas" });
      }

    const response = await sendRequestToSpringBoot(
      imageSaved,
      `/photos/films/${idFilm}`,
      "POST"
    );
    // Renvoyer la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de l'ajout de la photo au film",
    });
  }
};

const getAllPicturesFromComment = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idCommentaire = req.params.commentId;

    // Vérifier que le commentaire existe
    const existingComment = await pool.query(
      "SELECT * FROM Commentaire WHERE idCommentaire = ? and validite = 'A'",
      [idCommentaire]
    );
    if (existingComment.length === 0) {
      return res
        .status(400)
        .json({ message: "L'id de Commentaire n'existe pas" });
    }
    const response = await sendRequestToSpringBoot(
      {},
      `/photos/commentaires/${idCommentaire}`,
      "GET"
    );
    // Renvoyer la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des photos",
    });
  }
};

const addPictureToComment = async (req, res) => {
  try {
    const pool = await createMariaDBPool();

    const imageSaved = ({ image } = req.body); 
    // Vérifier que le champ image n'est pas vide

    if (!imageSaved) {
      return res.status(400).json({ message: "Le champ image est vide" });
    }

    const idCommentaire = req.params.commentId;
    // Vérifier que le commentaire existe
    const existingComment = await pool.query(
        "SELECT * FROM Commentaire WHERE idCommentaire = ? and validite = 'A'",
        [idCommentaire]
      );
      if (existingComment.length === 0) {
        return res
          .status(400)
          .json({ message: "L'id de Commentaire n'existe pas" });
      }


    const response = await sendRequestToSpringBoot(
      imageSaved,
      `/photos/commentaires/${idCommentaire}`,
      "POST"
    );
    // Renvoyer la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de l'ajout de la photo au commentaire",
    });
  }
};

const deletePicture = async (req, res) => {
  try {
    const pool = await createMariaDBPool();

    const idPhoto = req.params.idPhoto;
    // Vérifier que le commentaire existe
    const existingPicture = await pool.query(
        "SELECT * FROM Photo WHERE idPhoto = ? ",
        [idPhoto]
      );
      if (existingPicture.length === 0) {
        return res
          .status(400)
          .json({ message: "L'id de Photo n'existe pas" });
      }

    const response = await sendRequestToSpringBoot(
      {},
      `/photos/${idPhoto}`,
      "DELETE"
    );
    // Renvoyer la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la suppression de la photo",
    });
  }
};

// Envoyer les requêtes à Spring Boot
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
  getAllPicturesFromMovie,
  addPictureToMovie,
  getAllPicturesFromComment,
  addPictureToComment,
  deletePicture,
};
