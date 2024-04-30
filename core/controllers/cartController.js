const createMariaDBPool = require("../config/db.js");
// Récupérer le contenu du panier d'un utilisateur
const getCart = async (req, res) => {
  try {
    
    const idUtilisateur = req.params.userId;
    const response = await sendRequestToSpringBoot(
      {},
      `/panier/${idUtilisateur}`,
      "GET"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération du panier",
    });
  }
};

// Ajouter un film au panier d'un utilisateur
const addToCart = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idUtilisateur = req.params.userId;
    const movieId = req.body.idFilm;
    const cartToSend = ({ idFilm, ajout } = req.body);

    if (!idFilm || !ajout) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    // vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [movieId]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'id de film n'existe pas" });
    }

    // récupérer le panier (l'idPanier) de l'utilisateur :
    
    const resultCart = await pool.query(
      "SELECT * FROM Panier WHERE idUtilisateur = ?",
      [idUtilisateur]
    );
    if (resultCart.length === 0) {
      return res.status(400).json({ message: "Le panier n'existe pas" });
    }

    // idPanier dans DetailsPanier
    const idCart = resultCart[0].idPanier;

    // verifier s'il n'est pas déjà dans le panier
    const existingInCart = await pool.query(
      "SELECT * FROM DetailsPanier WHERE idFilm = ? AND idPanier = ?",
      [movieId, idCart]
    );
    if (existingInCart.length > 0) {
      return res
        .status(400)
        .json({ message: "Le film est déjà dans le panier" });
    }
    //vérifier s'il n'est pas déjà dans les Location en cours
    const existingInLocation = await pool.query(
      "SELECT * FROM Location WHERE idFilm = ? AND idUtilisateur = ? AND dateFin > CURRENT_DATE() ",
      [movieId, idUtilisateur]
    );
    if (existingInLocation.length > 0) {
      return res
        .status(400)
        .json({ message: "Le film est déjà loué" });
    }

    const response = await sendRequestToSpringBoot(
      cartToSend,
      `/panier/${idUtilisateur}`,
      "POST"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);

    // Supposons que l'identifiant du film est envoyé dans le corps de la requête
  } catch (error) {
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de l'ajout au panier" });
  }
};

// Modifier le panier d'un utilisateur
const updateCart = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idUtilisateur = req.params.userId;
    const movieId = req.body.idFilm;
    const cartToSend = ({ idFilm, ajout } = req.body);

    if (!idFilm || !ajout) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    // vérifier que le film existe
    const existingMovie = await pool.query(
      "SELECT * FROM Film WHERE idFilm = ?",
      [movieId]
    );
    if (existingMovie.length === 0) {
      return res.status(400).json({ message: "L'film n'existe pas" });
    }

    // récupérer le panier (l'idPanier) de l'utilisateur :
    const resultCart = await pool.query(
      "SELECT * FROM Panier WHERE idUtilisateur = ?",
      [idUtilisateur]
    );
    if (resultCart.length === 0) {
      return res.status(400).json({ message: "Le panier n'existe pas" });
    }

    // idPanier dans DetailsPanier
    const idCart = resultCart[0].idPanier;

    // verifier s'il n'est pas déjà dans le panier si on doit l'ajouter
    if (ajout === "true") {
      const existingInCart = await pool.query(
        "SELECT * FROM DetailsPanier WHERE idFilm = ? AND idPanier = ?",
        [movieId, idCart]
      );
      if (existingInCart.length > 0) {
        return res
          .status(400)
          .json({ message: "Le film est déjà dans le panier" });
      }
    }

    if (ajout === "false") {
      const existingInCart = await pool.query(
        "SELECT * FROM DetailsPanier WHERE idFilm = ? AND idPanier = ?",
        [movieId, idCart]
      );
      if (existingInCart.length === 0) {
        return res
          .status(400)
          .json({ message: "Le film n'est pas dans le panier" });
      }
    }

    //vérifier s'il n'est pas déjà dans les Location en cours
    const existingInLocation = await pool.query(
      "SELECT * FROM Location WHERE idFilm = ? AND idUtilisateur = ? AND dateFin > CURRENT_DATE() ",
      [movieId, idUtilisateur]
    );
    if (existingInLocation.length > 0) {
      return res
        .status(400)
        .json({ message: "Le film est déjà loué" });
    }

    const response = await sendRequestToSpringBoot(
      cartToSend,
      `/panier/${idUtilisateur}`,
      "PUT"
    );
    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du panier",
    });
  }
};

// Vider le panier d'un utilisateur
const emptyCart = async (req, res) => {
  try {
    const pool = await createMariaDBPool();
    const idUtilisateur = req.params.userId;
    // récupérer le panier (l'idPanier) de l'utilisateur :
    const resultCart = await pool.query(
      "SELECT * FROM Panier WHERE idUtilisateur = ?",
      [idUtilisateur]
    );


    if (resultCart.length === 0) {
      return res.status(400).json({ message: "Le panier n'existe pas" });
    }

    // idPanier dans DetailsPanier
    const idCart = resultCart[0].idPanier;

    // verifier s'il n'est pas rempli
    const existingCart = await pool.query(
      "SELECT * FROM DetailsPanier WHERE idPanier = ?",
      [idCart]
    );
    if (existingCart.length === 0) {
      return res
        .status(400)
        .json({ message: "Le panier est vide" });
    }

    //vider le panier
    const response = await sendRequestToSpringBoot(
      {},
      `/panier/${idUtilisateur}`,
      "DELETE"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la suppression du contenu du panier",
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

module.exports = { getCart, addToCart, updateCart, emptyCart };
