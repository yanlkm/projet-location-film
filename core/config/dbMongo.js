// Module pour se connecter à une base de données MongoDB avec Mongoose

// Importation du module mongoose pour la gestion des connexions MongoDB
const mongoose = require("mongoose");

// Fonction asynchrone pour se connecter à la base de données MongoDB
const connectDB = async () => {
  try {
    // Connexion à la base de données MongoDB en utilisant l'URI spécifié dans les variables d'environnement
    const conn = await mongoose.connect(process.env.MONGO_URI);

  } catch (err) {
    // Arrêt du processus avec un code de sortie 1 en cas d'échec de la connexion
    process.exit(1);
  }
};

// Exportation de la fonction de connexion à la base de données MongoDB
module.exports = connectDB;
