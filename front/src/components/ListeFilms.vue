<template>
    <!-- Container principal -->
    <div>
        <!-- Titre de la liste -->
        <h1 class="title has-text-centered ">Liste des films</h1>
        <!-- Contenu de la liste -->
        <div class="is-flex is-justify-content-center is-align-items-center">
            <!-- Affichage des films ou message si aucun film -->
            <div v-if="films.length === 0">
                <p>Aucun film pour le moment</p>
                <!-- Bouton pour ajouter un nouveau film -->
                <router-link :to="{ name: 'CreerFilm' }">
                    <button class="button is-primary is-outlined is-fullwidth">Ajouter Film</button>
                </router-link>
            </div>
            <!-- Affichage de la liste des films -->
            <div v-else>
                <!-- Bouton pour ajouter un nouveau film -->
                <router-link :to="{ name: 'CreerFilm' }">
                    <button class="button is-primary is-outlined is-fullwidth">Ajouter Film</button>
                </router-link>
                <!-- Tableau pour afficher les détails des films -->
                <table class="table is-striped is-fullwidth">
                    <thead>
                        <!-- En-têtes des colonnes -->
                        <tr>
                            <th>Nom</th>
                            <th>Genre</th>
                            <th>Date de Sortie</th>
                            <th>Pegi</th>
                            <th>Prix</th>
                            <th>Réalisateur</th>
                            <th>Synopsis</th>
                            <th>Validité</th>
                            <th>Modification</th>
                            <th>Ajout image</th>
                            <th>Commentaires</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Affichage des films -->
                        <tr v-for="film in films" :key="film.idFilm">
                            <!-- Détails de chaque film -->
                            <td>{{ film.nom }}</td>
                            <td>{{ film.genre }}</td>
                            <td>{{ formatDate(film.dateSortie) }}</td>
                            <td>{{ film.pegi }}</td>
                            <td>{{ film.prix }}</td>
                            <td>{{ film.realisateur }}</td>
                            <td>{{ film.synopsis }}</td>
                            <!-- Bouton pour activer ou désactiver la validité -->
                            <td>
                                <button @click="toggleValidity(film)">
                                    <img :src="film.validite === 'V' ? '/images/logos/enable.png' : '/images/logos/disable.png'"
                                        :alt="film.validite === 'V' ? 'Activé' : 'Désactivé'" width="20" height="20">
                                </button>
                            </td>
                            <!-- Bouton pour modifier le film -->
                            <td>
                                <router-link :to="{ name: 'ModifierFilm', params: { idFilm: film.idFilm } }">
                                    <button>
                                        <img src="/images/logos/stylo.png" alt="Modifier" width="20" height="20">
                                    </button>
                                </router-link>
                            </td>
                            <!-- Bouton pour ajouter des images au film -->
                            <td>
                                <router-link :to="{ name: 'AjoutPhotosFilm', params: { idFilm: film.idFilm } }">
                                    <button>
                                        <img src="/images/logos/plus.png" alt="Plus" width="20" height="20">
                                    </button>
                                </router-link>
                            </td>
                            <!-- Bouton pour voir les commentaires du film -->
                            <td>
                                <router-link :to="{ name: 'CommentairesFilms', params: { idFilm: film.idFilm } }">
                                    <button>
                                        <img src="/images/logos/commentaires.png" alt="Commentaires" width="20" height="20">
                                    </button>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';

export default {
    name: 'ListeFilms',
    data() {
        return {
            films: [],
        };
    },
    created() {
        // Configuration de moment.js pour la localisation en français
        moment.locale('fr', {
            months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        });
        // Récupération de la liste des films
        this.fetchFilms();
    },
    methods: {
        async fetchFilms() {
            try {
                // Récupération du token d'authentification
                const monCookie = Cookies.get('token');
                const config = {
                    headers: {},
                    withCredentials: true
                };
                if (monCookie) {
                    // Ajout du token dans les en-têtes de la requête
                    config.headers['Authorization'] = `Bearer ${monCookie}`;
                }
                // Appel à l'API pour récupérer la liste des films
                const response = await axios.get('http://localhost:8080/admin/films', config);
                // Mise à jour de la liste des films avec les données reçues
                this.films = response.data;
            } catch (error) {
                // Gestion des erreurs lors de la récupération des films
                alert(error.response.data.message);
                this.$router.push('/films');
            }
        },
        async toggleValidity(film) {
            try {
                // Récupération du token d'authentification
                const monCookie = Cookies.get('token');
                const config = {
                    headers: {},
                    withCredentials: true
                };
                if (monCookie) {
                    // Ajout du token dans les en-têtes de la requête
                    config.headers['Authorization'] = `Bearer ${monCookie}`;
                }
                // Calcul de la nouvelle validité du film
                const newValidity = film.validite === 'V' ? 'N' : 'V';
                // Modification de la validité du film via l'API
                await axios.put(`http://localhost:8080/admin/films/${film.idFilm}`, { validite: newValidity }, config);
                // Rafraîchissement de la liste des films après modification
                this.fetchFilms();
                // Affichage d'un message de succès
                const message = newValidity === 'V' ? 'Film activé avec succès' : 'Film désactivé avec succès';
                alert(message);
            } catch (error) {
                // Gestion des erreurs lors de la modification de la validité du film
                console.error(error);
            }
        },
        formatDate(date) {
            // Formatage de la date avec moment.js
            return moment(date).format('DD MMMM YYYY, HH:mm');
        }
    }
};
</script>
