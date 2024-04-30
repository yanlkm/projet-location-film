// Middleware pour vérifier l'ID de l'utilisateur dans le JWT et celui dans la route
module.exports = (req, res, next) => {
    // Récupérer l'ID de l'utilisateur à partir du JWT
  
    const userIdJWT = req.user.idUtilisateur;
    // Vérifier si les deux ID correspondent
    if (req.user.validite!=='A' || req.user.role!='A') {
      return res.status(403).json({ message: 'Accès non autorisé à cette ressource' });
    }
  
    // Si les ID correspondent, passer au middleware suivant
    next();
  };
  