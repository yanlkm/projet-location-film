const createMariaDBPool = require("../config/db.js");

// Récupérer tous les films
const getAllFilms = async (req, res) => {
  try {
    const response = await sendRequestToSpringBoot({}, `/films`, "GET");
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des commentaires pour ce film",
    });
  }
};

// Récupérer tous les details d'un film
const getFilmById = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idFilm = req.params.movieId;

    // vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ? and validite = 'V'",
      [idFilm]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }
    const response = await sendRequestToSpringBoot(
      {},
      `/films/${idFilm}`,
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

// envoyer les requetes à spring
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
  getAllFilms,
  getFilmById,
};
