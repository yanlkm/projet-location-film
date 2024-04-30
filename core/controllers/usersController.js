const bcrypt = require("bcrypt");
const createMariaDBPool = require("../config/db.js");

exports.getUser = async (req, res) => {
  const idUtilisateur = req.params.userId;

  try {
    // Envoi de la requête au serveur Spring Boot pour récupérer les informations de l'utilisateur
    const response = await sendRequestToSpringBoot(
      {},
      `/utilisateurs/${idUtilisateur}`,
      "GET"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de la récupération des informations de l'utilisateur",
      });
  }
};

exports.createUser = async (req, res) => {
  const { pseudo, nom, prenom, dateNaissance, mail, mdp, validite, role } =
    req.body;

  try {
    const pool = await createMariaDBPool();
    // Effectuez les vérifications nécessaires sur les données reçues
    if (
      !pseudo ||
      !nom ||
      !prenom ||
      !dateNaissance ||
      !mail ||
      !mdp ||
      !validite ||
      !role
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }
    if (mdp.length < 8) {
      return res
        .status(400)
        .json({
          message: "Le mot de passe doit contenir au moins 8 caractères",
        });
    }
    if (!/^[a-zA-Z0-9]+$/.test(mdp)) {
      return res
        .status(400)
        .json({
          message:
            "Le mot de passe ne doit contenir que des lettres et des chiffres",
        });
    }

    const existingUser = await pool.query(
      "SELECT * FROM Utilisateur WHERE pseudo = ? OR mail = ?",
      [pseudo, mail]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Le pseudo ou l'email est déjà utilisé" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(mdp, 10);

    // Création d'un nouvel utilisateur avec le mot de passe haché
    const newUser = {
      pseudo: pseudo,
      nom: nom,
      prenom: prenom,
      dateNaissance: dateNaissance,
      mail: mail,
      mdp: hashedPassword,
      validite: validite,
      role: role,
    };

    // Envoi de la requête au serveur Spring Boot
    const token = await sendRequestToSpringBoot(
      newUser,
      "/utilisateurs",
      "POST"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(token.statusCode).json(token.data);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Une erreur est survenue lors de la création de l'utilisateur",
      });
  }
};
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { nom, prenom, dateNaissance, mdp } = req.body;
  const pool = await createMariaDBPool();

  try {
    // Envoi de la requête au serveur Spring Boot pour vérifier si l'utilisateur existe
    const existingUser = await pool.query(
      "SELECT * FROM Utilisateur WHERE idUtilisateur = ?",
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Effectuez les vérifications nécessaires sur les données reçues
    if (!nom || !prenom || !dateNaissance || !mdp) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }
    if (mdp.length < 8) {
      return res
        .status(400)
        .json({
          message: "Le mot de passe doit contenir au moins 8 caractères",
        });
    }
    if (!/^[a-zA-Z0-9]+$/.test(mdp)) {
      return res
        .status(400)
        .json({
          message:
            "Le mot de passe ne doit contenir que des lettres et des chiffres",
        });
    }
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(mdp, 10);

    // Création de l'objet utilisateur mis à jour
    const updatedUser = {
      nom: nom,
      prenom: prenom,
      dateNaissance: dateNaissance,
      mdp: hashedPassword, // Mot de passe haché
    };

    // Envoi de la requête au serveur Spring Boot
    const token = await sendRequestToSpringBoot(
      updatedUser,
      `/utilisateurs/${userId}`,
      "PUT"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(token.statusCode).json(token.data);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      });
  }
};

exports.deleteUser = async (req, res) => {
  const idUtilisateur = req.params.userId;
  try {
    const pool = await createMariaDBPool();
    // Envoi de la requête au serveur Spring Boot pour vérifier si l'utilisateur existe
    const existingUser = await pool.query(
      "SELECT * FROM Utilisateur WHERE idUtilisateur = ?",
      [idUtilisateur]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Envoi de la requête de suppression au serveur Spring Boot
    const response = await sendRequestToSpringBoot(
      {},
      `/utilisateurs/${idUtilisateur}`,
      "DELETE"
    );

    // Renvoi de la réponse du serveur Spring Boot au front-end
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de la suppression de l'utilisateur",
      });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: true, // Le cookie ne sera envoyé que sur une connexion HTTPS sécurisée
      sameSite: "strict", // Le cookie n'est envoyé que pour des requêtes provenant du même site
      maxAge: 0, // Durée de vie du cookie en millisecondes (ici, 0 pour le supprimer)
    };
    // Suppression du cookie dans la réponse
    res.clearCookie("token", cookieOptions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la déconnexion" });
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
