# Partie Core de l'Application

Cette partie du projet constitue le cœur de l'application, gérant la liaison entre le frontend et le backend, ainsi que la mise en place du serveur de sockets pour la fonctionnalité de chat en temps réel.

## Structure des Fichiers

La structure des fichiers est organisée de manière à séparer clairement les différentes fonctionnalités de l'application. Voici un aperçu de l'organisation des fichiers :

- **Config**: Contient les fichiers de configuration pour les bases de données et d'autres services.
- **Routes**: Contient les fichiers de définition des routes de l'API REST.
- **Chat**: Contient les fichiers relatifs à la gestion du chat en temps réel.

## Backend

### Gestion des API REST

Les routes de l'API REST sont définies dans les fichiers correspondants dans le répertoire `routes`. Chaque fichier définit les routes pour une ressource spécifique, telles que les utilisateurs, les produits, les commandes, etc. Les requêtes HTTP sont gérées par des contrôleurs qui manipulent les données et retournent les réponses appropriées.

### Connexion à la Base de Données

La connexion à la base de données MongoDB est établie à l'aide du module Mongoose. Le fichier `dbMongo.js` contient la configuration nécessaire pour établir la connexion à la base de données.

### Serveur de Sockets (Socket.IO)

Le serveur de sockets est configuré dans le fichier `index.js`. Il utilise Socket.IO pour permettre la communication en temps réel entre les clients et le serveur. Les événements de connexion, de déconnexion et de messages sont gérés pour permettre un chat en direct entre les utilisateurs.

## Frontend

Le frontend de l'application est développé avec Vue.js, une bibliothèque JavaScript progressive pour la construction d'interfaces utilisateur. Les fichiers Vue sont organisés en composants réutilisables et structurés selon les fonctionnalités de l'application.

## Dépendances

Les dépendances du projet sont spécifiées dans le fichier `package.json` et peuvent être installées à l'aide de npm (Node Package Manager).


