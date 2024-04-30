// Module pour créer un pool de connexion MariaDB

// Importation du module mariadb pour la gestion des connexions à la base de données MariaDB
const mariadb = require('mariadb');

// Importation des fonctions utilitaires pour obtenir l'ID du conteneur MariaDB et le port
const { getMariaDBContainerId, getMariaDBPort } = require('./dockerUtils');

// Fonction asynchrone pour créer un pool de connexion MariaDB
const createMariaDBPool = async () => {
  try {
    // Obtention de l'ID du conteneur MariaDB
    const containerId = await getMariaDBContainerId();
    
    // Obtention du port de MariaDB
    const port = await getMariaDBPort(containerId);
  
    // Création d'un pool de connexion MariaDB avec les paramètres de configuration
    const pool = mariadb.createPool({
      host: 'localhost',
      port: port,
      user: 'myuser',
      password: 'secret', 
      database: 'mydatabase'
    });

    // Retourne le pool de connexion MariaDB créé
    return pool;
  } catch (error) {
    // Gestion des erreurs en cas de problème lors de la création du pool de connexion MariaDB
    throw new Error('Impossible de créer le pool MariaDB');
  }
};

// Exportation de la fonction pour créer un pool de connexion MariaDB
module.exports = createMariaDBPool;
