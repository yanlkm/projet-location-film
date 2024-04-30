<template>
    <!-- Formulaire pour ajouter un nouveau commentaire -->
    <div class="nouveau-commentaire-container">
      <!-- Titre du formulaire -->
      <h3 class="nouveau-commentaire-title">Laisser un commentaire :</h3>
      <!-- Formulaire -->
      <form @submit.prevent="submitCommentaire">
        <!-- Champ pour le commentaire -->
        <div class="field">
          <label class="label" for="description">Commentaire :</label>
          <div class="control">
            <textarea class="textarea" id="description" v-model="nouveauCommentaire.description" required></textarea>
          </div>
        </div>
        <!-- Champ pour la note -->
        <div class="field">
          <label class="label" for="note">Note :</label>
          <!-- Étoiles pour sélectionner la note -->
          <div class="star-rating">
            <span v-for="n in 5" :key="n" @click="setRating(nouveauCommentaire, n)">
              <i class="fas fa-star" v-if="n <= nouveauCommentaire.note"></i>
              <i class="far fa-star" v-else></i>
            </span>
          </div>
        </div>
        <!-- Bouton pour publier le commentaire -->
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" type="submit">Publier</button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Cookies from 'js-cookie';
  
  export default {
    data() {
      return {
        // Informations de l'utilisateur et du nouveau commentaire
        infoUtilisateur: null,
        idUtilisateur: null,
        nouveauCommentaire: {
          pseudo: '',
          description: '',
          note: '',
          idFilm: null,
          idUtilisateur: null,
        },
      }
    },
    props: {
      // Propriété pour l'identifiant du film
      idFilm: {
        type: Number,
        required: true
      }
    },
    created() {
      // Récupération des informations de l'utilisateur lors de la création du composant
      this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
      this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
    },
    methods: {
      // Méthode pour définir la note du commentaire
      setRating(com, n) {
        com.note = n;
      },
      // Méthode pour soumettre le commentaire
      async submitCommentaire() {
        // Attribution de l'identifiant du film au commentaire
        this.nouveauCommentaire.idFilm = this.idFilm;
        try {
          // Récupération du token d'authentification
          const monCookie = Cookies.get('token');
          const config = {
            headers: {
            },
            withCredentials: true
          };
          if (monCookie) {
            config.headers['Authorization'] = `Bearer ${monCookie}`;
          }
          // Envoi du nouveau commentaire au serveur
          const reponse = await axios.post(`http://localhost:8080/commentaires/${this.idFilm}/${this.idUtilisateur}`, this.nouveauCommentaire, config);
          // Réinitialisation du formulaire après la soumission du commentaire
          this.nouveauCommentaire.pseudo = '';
          this.nouveauCommentaire.description = '';
          this.nouveauCommentaire.note = '';
          // Affichage d'une confirmation de publication du commentaire
          alert('Votre commentaire a bien été publié');
          this.$router.push(`/locations/${this.idUtilisateur}`);
        } catch (erreur) {
          // Gestion des erreurs lors de la soumission du commentaire
          if (erreur.response.status === 400) {
            alert('Vous avez déjà commenté ce film');
          } else {
            alert(erreur.response.data.message);
            this.$router.push('/');
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  /* Styles spécifiques au formulaire de nouveau commentaire */
  .nouveau-commentaire-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .nouveau-commentaire-title {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .field {
    margin-bottom: 20px;
  }
  
  .label {
    font-weight: bold;
  }
  
  .select {
    width: 100%;
  }
  
  .button {
    background-color: #ff6347;
    color: white;
  }
  
  .button:hover {
    background-color: #ff8566;
  }
  
  .star-rating {
    display: inline-block;
    font-size: 16px;
    color: #ffcc00;
    cursor: pointer;
  }
  </style>
  