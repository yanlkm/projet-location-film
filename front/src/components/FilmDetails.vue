<template>
  <div class="container">
    <div class="columns is-centered">
      <!-- Section pour afficher les images -->
      <div class="column is-one-quarter is-flex is-justify-content-center" v-for="image in images" :key="image.idPhoto">
        <img :src="'data:image/jpeg;base64,' + image?.image" alt="Affiche du film" class="film-image">
      </div>
      <!-- Section pour afficher les détails du film -->
      <div class="column is-half">
        <h1 class="title has-text-centered">{{ film.nom }}</h1>
        <div class="film-card">
          <div class="film-card-image">
            <!-- Carousel pour afficher les images du film -->
            <carousel :navigation-enabled="true">
              <!-- Boucle pour afficher les images du film dans le carousel -->
              <slide v-for="image in images" :key="image.idPhoto">
                <img :src="'data:image/jpeg;base64,' + image?.image" alt="Affiche du film" class="film-image">
              </slide>
            </carousel>
          </div>
          <div class="film-card-content">
            <p class="content has-text-justified">Pegi : {{ film.pegi }}</p>
            <p class="content has-text-justified">Prix : {{ film?.prix?.toFixed(2) }} €</p>
            <p class="content has-text-justified">Sorti le : {{ formatDate(film.dateSortie) }}</p>
            <p class="content has-text-justified">Genre : {{ film.genre }}</p>
            <p class="content has-text-justified">Réalisateur(s) : {{ film.realisateur }}</p>
            <p class="content has-text-justified">Synopsis : {{ film.synopsis }}</p>
            <!-- Bouton pour ajouter le film au panier -->
            <button class="button is-primary is-fullwidth" @click="ajouterPanier(film.idFilm)">Ajouter au panier</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Composant pour afficher les commentaires du film -->
    <ListeCommentairesFilm />
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import ListeCommentairesFilm from './ListeCommentairesFilm.vue';
import Cookies from 'js-cookie';
import Carousel from 'vue-carousel';

export default {
  name: 'FilmDetails',
  components: {
    ListeCommentairesFilm,
    Carousel
  },
  data() {
    return {
      film: {},
      images: [],
      infoUtilisateur: null,
      idUtilisateur: null,
    };
  },
  created() {
    moment.locale('fr', {
      months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    });

    // Récupération des informations de l'utilisateur depuis les cookies
    if (Cookies.get('cook')) {
      this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
      this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
    }

    // Récupération de l'ID du film depuis les paramètres de l'URL
    const filmId = this.$route.params.id;

    // Chargement des détails du film
    this.fetchFilmDetails(filmId);

    // Chargement des images du film
    this.getPhotos();
  },
  methods: {
    // Fonction pour charger les détails du film
    async fetchFilmDetails(filmId) {
      const monCookie = Cookies.get('token');
      const config = {
        headers: {},
        withCredentials: true
      };
      if (monCookie) {
        config.headers['Authorization'] = `Bearer ${monCookie}`;
      }
      try {
        // Requête HTTP pour obtenir les détails du film
        const reponse = await axios.get(`http://localhost:8080/films/${filmId}`, config);
        this.film = reponse.data;
      } catch (erreur) {
        console.error(erreur);
      }
    },
    // Fonction pour charger les images du film
    async getPhotos() {
      try {
        const filmId = this.$route.params.id;
        const reponse = await axios.get(`http://localhost:8080/photos/films/${filmId}`);
        this.images = reponse.data;
      } catch (erreur) {
        console.error(erreur);
      }
    },
    // Fonction pour ajouter le film au panier
    async ajouterPanier(idFilm) {
      const monCookie = Cookies.get('token');
      const config = {
        headers: {},
        withCredentials: true
      };
      if (monCookie) {
        config.headers['Authorization'] = `Bearer ${monCookie}`;
      }
      try {
        // Requête HTTP pour ajouter le film au panier de l'utilisateur
        const reponse = await axios.post(`http://localhost:8080/panier/${this.idUtilisateur}`, {
          idFilm: idFilm,
          ajout: true
        }, config);
        // Alerte de succès
        alert('Film ajouté au panier avec succès !');
        // Redirection vers la page du film
        window.location.href = `/films/${idFilm}`;
        // Rechargement des détails du film
        this.fetchFilmDetails(idFilm);
      } catch (erreur) {
        // Gestion des erreurs
        alert(erreur.response.data.message);
        // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
        if (!this.infoUtilisateur)
          this.$route.push('/connexion');
      }
    },
    // Fonction pour formater la date
    formatDate(date) {
      if (!date) return '';
      const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Intl.DateTimeFormat('fr-FR', options).format(new Date(date));
    }
  },
};
</script>

<style scoped>
.title {
  margin-bottom: 20px;
}

.film-card {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem;
}

.film-card-image {
  flex: 1 1 30%;
  max-width: 150px;
  height: auto;
}

.film-card-image img {
  max-width: 100%;
  height: auto;
}

.film-card-content {
  flex: 1 1 70%;
}

.film-card-content .content {
  margin-bottom: 1rem;
}

@media screen and (max-width: 768px) {
  .film-card {
    flex-direction: column;
  }

  .film-card-image {
    width: 100%;
    margin-bottom: 1rem;
  }

  .film-card-content {
    width: 100%;
  }
}
</style>
