// Module définissant le schéma et le modèle pour la collection 'historical' dans MongoDB avec Mongoose

// Importation du module mongoose pour la gestion des schémas et des modèles MongoDB
const mongoose = require('mongoose');

// Définition du schéma MongoDB pour la collection 'historical'
const historiqueSchema = new mongoose.Schema({
  // Champ représentant l'identifiant de l'utilisateur
  idUtilisateur: {
    type: Number,
    required: true
  },
  // Champ représentant les films consultés par l'utilisateur
  films: [{
    type: Object,
    unique : true,
    ref: 'Film'
  }]
});

// Définition d'une méthode statique pour récupérer les identifiants des films consultés par un utilisateur
historiqueSchema.statics.getIdFilmsByUserId = async function(idUtilisateur) {
  try {
    // Recherche d'un historique correspondant à l'identifiant de l'utilisateur spécifié
    const historique = await this.findOne({ idUtilisateur });
    // Si un historique est trouvé, renvoyer la liste des identifiants des films consultés
    if (historique) {
      return historique.films;
    } else {
      // Sinon, renvoyer une liste vide
      return [];
    }
  } catch (error) {
    // Gestion des erreurs en cas de problème lors de la recherche de l'historique
    console.error(error);
    // Renvoyer une liste vide en cas d'erreur
    return [];
  }
};

// Création du modèle 'Historique' pour la collection 'historical' avec le schéma défini
const Historique = mongoose.model('historical', historiqueSchema);

// Exportation du modèle 'Historique' pour pouvoir l'utiliser dans d'autres parties de l'application
module.exports = Historique;
