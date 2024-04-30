const createMariaDBPool = require("../config/db.js");

// Consulter toutes les locations associées à un utilisateur
const getAllLocations = async (req, res) => {
  try {
    const idUtilisateur = req.params.userId;

    const response = await sendRequestToSpringBoot(
      {},
      `/locations/${idUtilisateur}`,
      "GET"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des locations de l'utilisateur",
    });
  }
};

// Consulter une location en particulier
const getLocationById = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idUtilisateur = req.params.userId;
    const idLocation = req.params.idLocation;

    const location = await pool.query(
      "SELECT * FROM Location WHERE idUtilisateur = ? AND idLocation = ?",
      [idUtilisateur, idLocation]
    );
    if (location.length === 0) {
      return res
        .status(404)
        .json({ message: "La location spécifiée n'existe pas" });
    }

    const response = await sendRequestToSpringBoot(
      {},
      `/locations/${idUtilisateur}/${location[0].idLocation}`,
      "GET"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération de la location",
    });
  }
};

// Consulter uniquement les locations en cours pour un utilisateur
const getCurrentLocations = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idUtilisateur = req.params.userId;

    const currentLocations = await pool.query(
      "SELECT * FROM Location WHERE idUtilisateur = ? AND dateFin > CURRENT_DATE()",
      [idUtilisateur]
    );

    if (currentLocations.length === 0) {
      return res.status(404).json({ message: "Aucune location en cours" });
    }

    const response = await sendRequestToSpringBoot(
      {},
      `/locations/${idUtilisateur}/encours`,
      "GET"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des locations en cours de l'utilisateur",
    });
  }
};

// Consulter uniquement les locations terminées pour un utilisateur
const getFinishedLocations = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idUtilisateur = req.params.userId;

    const currentLocations = await pool.query(
      "SELECT * FROM Location WHERE idUtilisateur = ? AND dateFin < CURRENT_DATE()",
      [idUtilisateur]
    );

    if (currentLocations.length === 0) {
      return res.status(404).json({ message: "Historique vide" });
    }

    const response = await sendRequestToSpringBoot(
      {},
      `/locations/${idUtilisateur}/fini`,
      "GET"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des locations terminées de l'utilisateur",
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
  getAllLocations,
  getLocationById,
  getCurrentLocations,
  getFinishedLocations,
};