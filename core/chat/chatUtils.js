// Module pour gérer les utilisateurs et les messages dans le chat de l'application

// Importation du module moment pour la gestion des dates et heures
const moment = require("moment");

// Nom du bot pour le chat de l'application
const botName = "Vue Chatapp Admin";

// Objet contenant les utilisateurs connectés au chat
const users = {};

// Fonction pour qu'un utilisateur rejoigne le chat
function userJoin(user) {
  users[user.id] = user;
  return user;
}

// Fonction pour formater un message avec le nom d'utilisateur, le texte et l'heure
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a') // Formatage de l'heure avec moment.js
    }
}

// Fonction pour obtenir les utilisateurs dans une salle de chat spécifique
function getRoomUsers(room) {
    // Filtrer les utilisateurs par salle de chat et retourner un tableau des utilisateurs dans cette salle
    return Object.values(users).filter(user => user.room === room);
}

// Fonction pour qu'un utilisateur quitte le chat
function userLeave(id) {
    if (users[id]) {
        const user = users[id];
        delete users[id];
        return user;
    }
}

// Fonction pour obtenir l'utilisateur actuel en fonction de son identifiant
function getCurrentUser(id){
    return users[id];
}

// Exportation des fonctions et constantes pour être utilisées dans d'autres parties de l'application
module.exports = {
  botName,
  userJoin,
  formatMessage,
  getRoomUsers,
  userLeave,
  getCurrentUser
};
