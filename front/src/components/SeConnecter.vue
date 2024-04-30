<template>
  <!-- Section de connexion -->
  <div class="section">
    <div class="container">
      <!-- Titre de la section -->
      <h1 class="title">Connexion</h1>
      <!-- Formulaire de connexion -->
      <form @submit.prevent="seConnecter" class="box">
        <!-- Champ pour l'adresse e-mail -->
        <div class="field">
          <label for="mail" class="label">Adresse mail:</label>
          <div class="control">
            <input v-model="mail" type="text" id="mail" class="input" required />
          </div>
        </div>
        <!-- Champ pour le mot de passe -->
        <div class="field">
          <label for="mdp" class="label">Mot de passe:</label>
          <div class="control">
            <input v-model="mdp" type="password" id="mdp" class="input" required />
          </div>
        </div>
        <!-- Bouton de connexion -->
        <div class="field">
          <div class="control">
            <button type="submit" class="button is-primary">Connexion</button>
          </div>
        </div>
      </form>
      <!-- Message d'erreur -->
      <p v-if="erreur" class="help is-danger">{{ erreur }}</p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { useStore } from 'vuex'; // Importation du store Vuex
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      // Données du formulaire de connexion
      mail: '',
      mdp: '',
      erreur: '',
    };
  },
  setup() {
    const store = useStore(); // Utilisation du store Vuex
  },
  methods: {
    async seConnecter() {
      try {
        // Envoi de la requête de connexion au serveur
        const reponse = await axios.post('http://localhost:8080/auth/connexion', {
          mail: this.mail,
          mdp: this.mdp,
        });
        // Récupération des informations de l'utilisateur
        const info = reponse.data;
        // Mise à jour des informations utilisateur dans le store Vuex
        this.$store.dispatch('setUser', info); 
        // Configuration du cookie contenant les informations utilisateur
        const cookieExpires = 7; 
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + cookieExpires);
        const cookieValue = `cook=${JSON.stringify(info)};expires=${expirationDate.toUTCString()};path=/`;
        document.cookie = cookieValue;
        expirationDate.setDate(expirationDate.getDate() + cookieExpires);
        const cookieValue2 = `token=${info.token};expires=${expirationDate.toUTCString()};path=/`;
        document.cookie = cookieValue2;
        // Réinitialisation des champs du formulaire
        this.mail = '';
        this.mdp = '';
        // Redirection vers la page d'accueil après la connexion réussie
        window.location.href = '/';
      } catch (erreur) {
        // Gestion des erreurs lors de la connexion
        if (erreur.response && erreur.response.status === 400) {
          this.erreur = 'Identifiants incorrects';
        } else {
          this.erreur = erreur.response.data.message;
        }
      }
    }
  },
};
</script>
