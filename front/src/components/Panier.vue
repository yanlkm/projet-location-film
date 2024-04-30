<template>
  <!-- Page du panier -->
  <div class="cart-page">
    <!-- Titre de la page -->
    <h1 class="title">Mon panier</h1>
    <!-- Liste des articles dans le panier -->
    <div class="cart-items">
      <!-- Affichage de chaque article dans le panier -->
      <div class="cart-item" v-for="item in panier" :key="item.id">
        <!-- Image de l'article avec lien vers les détails du film -->
        <div class="item-image">
          <router-link :to="{ name: 'FilmDetails', params: { id: item.idFilm } }">
            <img :src="'data:image/jpeg;base64,' + item.photo" alt="Affiche du film" class="film-image">
          </router-link>
        </div>
        <!-- Détails de l'article -->
        <div class="item-details">
          <h3>{{ item.nom }}</h3>
          <h3>{{ item.titre }}</h3>
          <p>{{ item.prix.toFixed(2) }} €</p>
        </div>
        <!-- Bouton pour supprimer l'article du panier -->
        <button @click="SupprimerFilmPanier(item.idFilm)">Supprimer</button>
      </div>
    </div>
    <!-- Affichage si le panier est vide -->
    <p v-if="panier.length === 0">Votre panier est vide.</p>
    <!-- Résumé du panier avec bouton pour commander -->
    <div class="cart-summary" v-else>
      <p>Total : {{ cartTotal.toFixed(2) }} €</p>
      <button class="button is-primary" @click="commander()">Commander</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'Panier',
  data() {
    return {
      // Informations de l'utilisateur et du panier
      infoUtilisateur: '',
      idUtilisateur: null,
      panier: [],
    };
  },
  created() {
    // Récupération des informations de l'utilisateur et du panier lors de la création du composant
    this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
    this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
    this.fetchPanier();
  },
  methods: {
    // Méthode pour récupérer le panier de l'utilisateur
    async fetchPanier() {
      const monCookie = Cookies.get('token');
      const config = {
        headers: {
        },
        withCredentials: true
      };
      if (monCookie) {
        config.headers['Authorization'] = `Bearer ${monCookie}`;
      }
      try {
        // Requête pour récupérer le panier de l'utilisateur depuis le serveur
        const reponse = await axios.get(`http://localhost:8080/panier/${this.idUtilisateur}`, config);
        this.panier = reponse.data;
      } catch (erreur) {
        // Gestion des erreurs
        if (erreur.response.status === 404) {
          alert('Votre panier est vide');
        } else {
          alert(erreur.response.data.message);
          this.$router.push('/');
        }
      }
    },
    // Méthode pour passer une commande
    async commander() {
      try {
        const monCookie = Cookies.get('token');
        const config = {
          headers: {
          },
          withCredentials: true
        };
        if (monCookie) {
          config.headers['Authorization'] = `Bearer ${monCookie}`;
        }
        // Requête pour supprimer le panier de l'utilisateur après validation de la commande
        const reponse = await axios.delete(`http://localhost:8080/panier/${this.idUtilisateur}`, config);
        this.panier = [];
        // Affichage d'une confirmation de commande
        alert('Commande passée avec succès !');
      } catch (erreur) {
        // Gestion des erreurs
        alert(erreur.response.data.message);
      }
    },
    // Méthode pour supprimer un film du panier
    async SupprimerFilmPanier(itemId) {
      const monCookie = Cookies.get('token');
      const config = {
        headers: {
        },
        withCredentials: true
      };
      if (monCookie) {
        config.headers['Authorization'] = `Bearer ${monCookie}`;
      }
      const nbFilmPanier = this.panier.length;
      // Requête pour supprimer un film du panier
      const reponse = await axios.put(`http://localhost:8080/panier/${this.idUtilisateur}`, { idFilm: itemId, ajout: "false" }, config);
      if (nbFilmPanier === 1) {
        this.panier = [];
        // Affichage d'une confirmation de suppression du film du panier
        alert('Le film a bien été supprimé du panier');
        window.location.href = `/panier/${this.idUtilisateur}`;
      } else {
        // Affichage d'une confirmation de suppression du film du panier
        alert('Le film a bien été supprimé du panier');
        window.location.href = `/panier/${this.idUtilisateur}`;
        this.fetchPanier();
      }
    },
  },
  computed: {
    // Calcul du total du panier
    cartTotal() {
      return this.panier.reduce((total, item) => total + item.prix, 0);
    },
  },
};
</script>

<style scoped>
/* Styles spécifiques à la page du panier */
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
}

/* Styles pour la liste des articles dans le panier */
.cart-items {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Styles pour chaque article dans le panier */
.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

/* Styles pour l'image de l'article */
.item-image {
  flex: 1;
  margin-right: 20px;
}

.item-image img {
  max-width: 100%;
  max-height: 150px;
  height: auto;
}

/* Styles pour les détails de l'article */
.item-details {
  flex: 2;
}

/* Styles pour le résumé du panier */
.cart-summary {
  width: 1300px;
  padding: 20px;
  border: 1px solid #eee;
  margin-left: 0px;
  text-align: center;
}

/* Styles pour les boutons */
button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #333;
}
</style>
