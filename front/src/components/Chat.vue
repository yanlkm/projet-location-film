<template>
  <!-- Conteneur principal -->
  <div class="container">
    <!-- Carte principale -->
    <div class="card">
      <!-- Titre de la carte -->
      <div class="card-title">
        <!-- En-tête -->
        <div class="header">
          <span class="icon">🗨️</span>
          <div class="title">Vue Chatapp</div>
        </div>
        <!-- Bouton de quitter la salle de discussion -->
        <button class="btn btn-primary">Leave {{ $route.query.room }}</button>
      </div>
      <!-- Séparateur -->
      <hr class="divider">

      <!-- Contenu de la carte -->
      <div class="card-text">
        <!-- Barre latérale -->
        <div class="sidebar">
          <!-- Informations sur la salle de discussion -->
          <div class="room-info">
            <!-- En-tête des informations -->
            <div class="info-header">
              <span class="icon">🗨️</span>
              <div class="info-title">Nom de la salle</div>
            </div>
            <!-- Contenu des informations -->
            <div class="info-content">{{ currentRoom }}</div>
          </div>
          <!-- Informations sur les utilisateurs -->
          <div class="users-info">
            <!-- En-tête des informations -->
            <div class="info-header">
              <span class="icon">👥</span>
              <div class="info-title">Utilisateurs</div>
            </div>
            <!-- Liste des utilisateurs -->
            <ul class="user-list">
              <li v-for="(user, i) in users" :key="i">
                <!-- Affichage du nom d'utilisateur -->
                {{ user.username }}
                <!-- Séparateur pour le nom d'utilisateur actuel -->
                <hr v-if="user.username === $route.query.username">
              </li>
            </ul>
          </div>
        </div>

        <!-- Zone de discussion -->
        <div class="chat-area">
          <!-- Boîte de chat avec défilement -->
          <div class="chat-box" style="height: 400px; overflow-y: auto;">
            <!-- Affichage des messages -->
            <div v-for="(chat, i) in chats" :key="i" :class="chatClass(chat)">
              <!-- Boîte de message -->
              <div class="message-box" :class="messageClass(chat)">
                <!-- En-tête du message -->
                <div class="message-header">
                  <!-- Nom d'utilisateur -->
                  <span class="username">{{ chat.username }}</span>
                  <!-- Horodatage -->
                  <span class="timestamp">{{ chat.time }}</span>
                </div>
                <!-- Contenu du message -->
                <div class="message-content">{{ chat.text }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Séparateur -->
      <hr class="divider">
      <!-- Actions de la carte -->
      <div class="card-actions">
        <!-- Formulaire de chat -->
        <form @submit.prevent="onSubmit" class="chat-form">
          <!-- Champ de saisie de message -->
          <input type="text" v-model="message" class="message-input" placeholder="Tapez votre message...">
          <!-- Bouton d'envoi -->
          <button type="submit" class="btn btn-send">Envoyer</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      // Contenu du message
      message: "",
      // Liste des messages de chat
      chats: [],
      // Liste des utilisateurs connectés
      users: [],
      // Nom de la salle de discussion actuelle
      currentRoom: "",
      // Instance du socket
      socket: null,
      // Informations sur l'utilisateur
      infoUtilisateur: null,
      // Nom d'utilisateur
      username: null,
    };
  },
  methods: {
    // Soumission du formulaire de chat
    onSubmit() {
      if (this.socket) {
        this.socket.emit("chatMessage", this.message);
        this.message = "";
      }
    },
    // Classe CSS pour le style du message de chat
    chatClass(chat) {
      return chat.username === this.username ? "user-chat" : "other-chat";
    },
    // Classe CSS pour le style du message
    messageClass(chat) {
      if (chat.username === "ChatApp") {
        return "admin-message";
      } else if (chat.username === this.username) {
        return "user-message";
      } else {
        return "other-message";
      }
    },
    // Demander le nom d'utilisateur à l'utilisateur
    promptUsername() {
      this.username = window.prompt("Entrez votre pseudo :", "Utilisateur non inscrit");
      if (!this.username) {
        this.$router.push("/");
      }
    },
  },
  mounted() {
    // Connexion au serveur socket
    this.socket = io("http://localhost:8080");

    // Récupération des informations utilisateur depuis les cookies
    if (Cookies.get('cook')) {
      this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
      this.username = this.infoUtilisateur.mail;
    } else {
      this.promptUsername(); // Utiliser window.prompt pour demander le pseudo
    }

    // Nom de la salle de discussion
    const room = "rom";

    // Redirection si le nom d'utilisateur ou la salle de discussion est manquant
    if (!this.username || !room) {
      this.$router.push("/");
    }

    // Joindre la salle de discussion
    this.socket.emit("joinRoom", { username: this.username, room });

    // Écouter les événements du serveur
    this.socket.on("roomUsers", (response) => {
      this.users = response.users;
      this.currentRoom = response.room;
    });

    this.socket.on("message", (message) => {
      this.chats.push(message);
    });
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #007BFF;
  font-weight: bold;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007BFF;
  color: white;
  border: none;
}

.divider {
  margin: 20px 0;
  border: 0.5px solid #e0e0e0;
}

.card-text {
  display: flex;
}

.sidebar {
  flex: 1;
  padding-right: 20px;
}

.room-info, .users-info {
  margin-bottom: 20px;
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.icon {
  font-size: 24px;
  margin-right: 10px;
}

.title, .info-title {
  font-size: 18px;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-list li {
  margin-bottom: 5px;
}

.chat-area {
  flex: 3;
}

.message-box {
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.username, .timestamp {
  font-size: 14px;
}

.message-content {
  font-size: 16px;
}

.message-input {
  width: calc(100% - 100px);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

.btn-send {
  width: 100px;
  padding: 10px;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  border: none;
}

.admin-message {
  background-color: #ffe6e6;
}

.user-message {
  background-color: #e6f7ff;
}

.other-message {
  background-color: #e6ffe6;
}
</style>
