<template>
  <div class="container">
    <h1 class="title">Nos films</h1>
    <div class="columns is-multiline is-centered">
      <!-- Section pour afficher la liste des films -->
      <div v-if="films.length === 0">
        <p>Aucun film pour le moment</p>
      </div>
      <div v-else class="column is-one-quarter" v-for="film in films" :key="film.idFilm">
        <div v-if="film.validite === 'V'">
          <!-- Lien pour afficher les détails du film -->
          <router-link :to="{ name: 'FilmDetails', params: { id: film.idFilm } }">
            <div class="film-container is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
              <!-- Image du film -->
              <img :src="'data:image/jpeg;base64,' + film.photo" :alt="film.nom" class="film-image">
              <!-- Titre du film -->
              <h2>{{ film.nom }}</h2>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <!-- Footer pour afficher les films consultés récemment -->
    <footer class="footer">
      <div class="container">
        <h2>Consultés récemment</h2>
        <br>
        <div v-if="filmsVisites.length === 0">
          <p>Aucun film visité pour le moment</p>
        </div>
        <div v-else class="grid-container">
          <!-- Boucle pour afficher les films consultés récemment -->
          <div class="grid-item" v-for="film in filmsVisites.films" :key="film.idFilm">
            <!-- Lien pour afficher les détails du film -->
            <router-link :to="{ name: 'FilmDetails', params: { id: film.idFilm } }">
              <!-- Image du film consulté récemment -->
              <img :src="'data:image/jpeg;base64,' + film.photo" :alt="film.nom" class="small-film-image">
              <!-- Titre du film consulté récemment -->
              <h3>{{ film.nom }}</h3>
            </router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from "js-cookie";

export default {
  name: 'Films',
  data() {
    return {
      films: [],
      filmsVisites: []
    };
  },
  created() {
    // Chargement de la liste des films
    this.fetchFilms();
    // Chargement des films consultés récemment
    this.fetchFilmsVisites();
  },
  methods: {
    // Fonction pour charger la liste des films
    async fetchFilms() {
      try {
        const reponse = await axios.get('http://localhost:8080/films');
        this.films = reponse.data;
      } catch (erreur) {
        alert(erreur.response.data.message);
        this.$router.push('/');
      }
    },
    // Fonction pour charger les films consultés récemment
    async fetchFilmsVisites() {
      const monCookie = Cookies.get('token');
      const config = {
        headers: {},
        withCredentials: true
      };
      if (monCookie) {
        config.headers['Authorization'] = `Bearer ${monCookie}`;
      }
      try {
        const reponse = await axios.get('http://localhost:8080/films/visites', config);
        this.filmsVisites = reponse.data;
      } catch (erreur) {
        alert(erreur.response.data.message);
      }
    }
  }
};
</script>

<style>
.film-image {
  width: 200px;
  height: 300px;
  object-fit: cover;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 20px;
}

.grid-item {
  text-align: center;
}

.small-film-image {
  width: 100px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}

h3 {
  margin: 0;
  font-size: 14px;
}
</style>
