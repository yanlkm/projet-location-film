<template>
    <!-- Conteneur principal -->
    <div>
        <!-- Titre de la liste des commentaires -->
        <h1 class="title has-text-centered">Liste des commentaires</h1>
        <!-- Conteneur flexible pour centrer les éléments -->
        <div class="is-flex is-justify-content-center is-align-items-center">
            <!-- Affichage en l'absence de commentaires -->
            <div v-if="commentaires.length === 0">
                <p>Aucun commentaire pour le moment</p>
            </div>
            <!-- Affichage des commentaires -->
            <div v-else>
                <!-- Tableau pour afficher les commentaires -->
                <table class="table is-striped is-fullwidth">
                    <!-- En-tête du tableau -->
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Date de Publication</th>
                            <th>Note</th>
                            <th>Validité</th>
                        </tr>
                    </thead>
                    <!-- Corps du tableau -->
                    <tbody>
                        <!-- Boucle sur les commentaires -->
                        <tr v-for="commentaire in commentaires" :key="commentaire.idCommentaire">
                            <!-- Description du commentaire -->
                            <td>{{ commentaire.description }}</td>
                            <!-- Date de publication -->
                            <td>{{ formatDate(commentaire.datePublication) }}</td>
                            <!-- Note attribuée -->
                            <td>{{ commentaire.note }}</td>
                            <!-- Bouton pour activer/désactiver la validité du commentaire -->
                            <td>
                                <button class="button" @click="setValidite(commentaire, commentaire.validite === 'V' ? 'N' : 'V')">
                                    <!-- Image pour représenter l'état de validité -->
                                    <img :src="commentaire.validite === 'V' ? '/images/logos/enable.png' : '/images/logos/disable.png'" :alt="commentaire.validite === 'V' ? 'Activé' : 'Désactivé'" width="20" height="20">
                                </button>
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
    name: 'CommentairesFilms',
    data() {
        return {
            // Liste des commentaires
            commentaires: [],
        };
    },
    created() {
        // Configuration de moment pour les dates en français
        moment.locale('fr', {
            months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        });
        // Récupération des commentaires
        this.fetchCommentaires();
    },
    methods: {
        // Récupération des commentaires depuis l'API
        async fetchCommentaires() {
            try {
                const filmId = this.$route.params.idFilm;
                // Récupération du token d'authentification depuis les cookies
                const monCookie = Cookies.get('token');
                const config = {
                    headers: {},
                    withCredentials: true
                };
                // Ajout du token d'authentification aux headers si présent
                if (monCookie) {
                    config.headers['Authorization'] = `Bearer ${monCookie}`;
                }
                // Appel à l'API pour récupérer les commentaires du film
                const reponse = await axios.get(`http://localhost:8080/commentaires/${filmId}`, config);
                // Attribution des commentaires à la liste
                this.commentaires = reponse.data;
            } catch (erreur) {
                // Gestion des erreurs en cas de problème lors de la récupération des commentaires
                alert(erreur.response.data.message);
                this.$router.push('/admin/films');
            }
        },
        // Activation ou désactivation de la validité d'un commentaire
        async setValidite(commentaire, validite) {
            const idCommentaire = commentaire.idCommentaire;
            try {
                // Récupération du token d'authentification depuis les cookies
                const monCookie = Cookies.get('token');
                const config = {
                    headers: {},
                    withCredentials: true
                };
                // Ajout du token d'authentification aux headers si présent
                if (monCookie) {
                    config.headers['Authorization'] = `Bearer ${monCookie}`;
                }
                // Appel à l'API pour activer ou désactiver la validité du commentaire
                const reponse = await axios.delete(`http://localhost:8080/admin/commentaires/${idCommentaire}`, config);
                // Rafraîchissement de la liste des commentaires après modification
                this.fetchCommentaires();
                // Affichage d'une alerte en fonction de l'état de validité modifié
                if (validite === 'V') {
                    alert('Commentaire activé avec succès');
                } else {
                    alert('Commentaire désactivé avec succès');
                }
            } catch (erreur) {
                // Gestion des erreurs en cas de problème lors de la modification de la validité
                console.error(erreur);
            }
        },
        // Formatage de la date au format spécifié
        formatDate(date) {
            return moment(date).format('DD MMMM YYYY, HH:mm');
        },
    },
};
</script>
