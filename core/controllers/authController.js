const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createMariaDBPool = require("../config/db");

// Clé secrète pour signer les tokens JWT
const jwtSecret = "secret";

// Fonction pour générer un token JWT
function generateToken(user) {
  return jwt.sign(
    {
      idUtilisateur: user[0].idUtilisateur,
      mail: user[0].mail,
      role: user[0].role,
      validite: user[0].validite,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
}

exports.login = async (req, res) => {
  // Extraction des données d'authentification du corps de la requête
  const { mail, mdp } = req.body;

  try {
    if (!mail || !mdp || mail.length===0 || mdp.length ===0 ){
      return res.status(400).json({ message: "Remplir tous les champs" });

    }
    const pool = await createMariaDBPool();
    // Vérification de l'utilisateur dans la base de données
    const [userRows] = await pool.query(
      "SELECT * FROM Utilisateur WHERE mail = ?",
      [mail]
    );
    if (!userRows) {
      return res
        .status(404)
        .json({ message: "Identifiants incorrects" });
    }
    if(userRows.validite!=='A') {
      return res
      .status(404)
      .json({ message: "Contactez le support pour la réactivation de votre compte" });
    }
    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(mdp, userRows.mdp);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const user = await pool.query("SELECT * FROM Utilisateur WHERE mail = ?", [
      mail,
    ]);

    // Génération d'un token JWT
    const token = generateToken(user);

    // Configuration des options pour le cookie
    const cookieOptions = {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: true, // Le cookie ne sera envoyé que sur une connexion HTTPS sécurisée
      sameSite: "strict", // Le cookie n'est envoyé que pour des requêtes provenant du même site
      maxAge: 990000, // Durée de vie du cookie en millisecondes (ici, 1 heure)
    };

    // Définition du cookie dans la réponse
    res.cookie("token", token, cookieOptions);
    // Envoyer l'id au client
    res.json({ idUtilisateur : user[0].idUtilisateur, role : user[0].role, mail :user[0].mail, token : token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la connexion" });
  }
};

exports.logout = async (req, res) => {
  try {

    const cookieOptions = {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: true, // Le cookie ne sera envoyé que sur une connexion HTTPS sécurisée
      sameSite: "strict", // Le cookie n'est envoyé que pour des requêtes provenant du même site
      maxAge: 0, // Durée de vie du cookie en millisecondes (ici, 0 pour le supprimer)
    };
    // Suppression du cookie dans la réponse
    res.clearCookie("token", cookieOptions);

    // Envoyer une réponse de succès
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue lors de la déconnexion" });
  }
};
