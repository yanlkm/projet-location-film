const { exec } = require('child_process');

// Fonction pour obtenir l'ID du conteneur MariaDB
const getMariaDBContainerId = () => {
  return new Promise((resolve, reject) => {
    // Commande pour lister les conteneurs en cours d'exécution
    const listContainersCommand = 'docker ps --format "{{.ID}} {{.Names}}"';

    // Exécution de la commande pour obtenir la liste des conteneurs
    exec(listContainersCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Erreur lors de l'exécution de la commande : ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Erreur de la commande : ${stderr}`);
        return;
      }

      // Analyser la sortie pour trouver le conteneur MariaDB
      const lines = stdout.trim().split('\n');
      let mariadbContainerId = null;
      lines.forEach(line => {
        const [containerId, containerName] = line.split(' ');
        if (containerName.includes('mariadb')) {
          mariadbContainerId = containerId;
          return;
        }
      });

      if (!mariadbContainerId) {
        reject('Aucun conteneur MariaDB en cours d\'exécution trouvé.');
        return;
      }

      resolve(mariadbContainerId);
    });
  });
};

// Fonction pour obtenir le port exposé du conteneur MariaDB
const getMariaDBPort = (containerId) => {
  return new Promise((resolve, reject) => {
    // Commande pour obtenir les détails du conteneur MariaDB
    const inspectContainerCommand = `docker inspect ${containerId}`;

    // Exécution de la commande pour obtenir les détails du conteneur
    exec(inspectContainerCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Erreur lors de l'exécution de la commande : ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Erreur de la commande : ${stderr}`);
        return;
      }

      // Analyser la sortie JSON pour obtenir le port exposé
      const containerInfo = JSON.parse(stdout);
      const exposedPort = containerInfo[0].NetworkSettings.Ports['3306/tcp'][0].HostPort;
      resolve(exposedPort);
    });
  });
};

module.exports = { getMariaDBContainerId, getMariaDBPort };
