const jwt = require('jsonwebtoken');

const jwtString = "secret";

// Middleware pour vérifier l'authentification
module.exports = (req, res, next) => {
  // Récupérer le token JWT du champ "Cookie" de l'en-tête HTTP
  const cookies = req.headers.cookie;
  
  if (!cookies) {
    return res.status(401).json({ message: 'Accès interdit - Cookie manquant' });
  }

  // Extraire le token JWT du champ "Cookie"
  const tokenCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('token='));
  if (!tokenCookie) {
    return res.status(401).json({ message: 'Accès interdit - Token manquant dans le cookie' });
  }

  const token = tokenCookie.split('=')[1];

  // Vérifier et décoder le token JWT
  jwt.verify(token, jwtString, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token JWT invalide' });
    }
    
    // Ajouter les informations de l'utilisateur authentifié à la requête
    req.user = decoded;


    next(); // Passer au middleware suivant
  });
};
