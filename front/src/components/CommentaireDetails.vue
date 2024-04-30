<template>
    <!-- Conteneur principal -->
    <div class="commentaires-container">
        <!-- Titre du commentaire -->
        <p>Details commentaire</p>
        <!-- En-tête du commentaire -->
        <div class="commentaires-header">
            <!-- Pseudo de l'auteur -->
            <p class="commentaires-pseudo">{{ com.pseudo }}:</p>
            <!-- Évaluation en étoiles -->
            <div class="star-rating">
                <!-- Affichage des étoiles -->
                <span v-for="n in 5" :key="n" @click="setRating(com, n)" v-if="modeEdition">
                    <i class="fas fa-star" v-if="n <= com.note"></i>
                    <i class="far fa-star" v-else></i>
                </span>
                <!-- Affichage statique des étoiles -->
                <span v-for="m in 5" :key="m" v-else>
                    <i class="fas fa-star" v-if="m <= com.note"></i>
                    <i class="far fa-star" v-else></i>
                </span>
            </div>
            <!-- Date de publication -->
            <p class="commentaires-date">{{ com.datePublication }}</p>
        </div>
        <!-- Description du commentaire -->
        <p class="commentaires-description" v-if="!modeEdition">{{ com.description }}</p>
        <!-- Formulaire de modification du commentaire -->
        <form v-else>
            <!-- Champ de saisie pour la nouvelle description -->
            <textarea v-model="nouvelleDescription">{{ com.description }}</textarea>
            <!-- Bouton pour enregistrer les modifications -->
            <button @click.prevent="enregistrerModifications">Enregistrer</button>
        </form>
        <!-- Bouton de modification du commentaire -->
        <button v-if="this.idUtilisateur == this.idUtilisateurCommentaire" @click="modeEdition = !modeEdition">Modifier</button>
        <!-- Bouton de suppression du commentaire -->
        <button v-if="this.idUtilisateur == this.idUtilisateurCommentaire" @click="supprimerCommentaire">Supprimer mon commentaire</button>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
    name: 'CommentaireDetails',
    data() {
        return {
            // Informations sur l'utilisateur
            infoUtilisateur: '',
            // Identifiant de l'utilisateur
            idUtilisateur: null,
            // Données du commentaire
            com: {},
            // Pseudo de l'auteur
            pseudo: '',
            // Identifiant de l'utilisateur ayant écrit le commentaire
            idUtilisateurCommentaire: null,
            // Mode édition du commentaire
            modeEdition: false,
            // Nouvelle description du commentaire en cours d'édition
            nouvelleDescription: '',
        }
    },
    async created() {
        // Récupération des informations utilisateur depuis les cookies
        this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
        this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
        // Récupération des détails du commentaire
        this.fetchCommentaire();
    },
    methods: {
        // Récupération des détails du commentaire depuis l'API
        async fetchCommentaire() {
            const idFilm = this.$route.params.idFilm;
            const idCom = this.$route.params.idCommentaire;
            const reponse = await axios.get(`http://localhost:8080/commentaires/${idFilm}/${idCom}`);
            this.com = reponse.data;
            this.nouvelleDescription = this.com.description;
            this.idUtilisateurCommentaire = this.com.idUtilisateur;
        },

        // Enregistrement des modifications du commentaire
        async enregistrerModifications() {
            const idFilm = this.$route.params.idFilm;
            const idCom = this.$route.params.idCommentaire;
            const monCookie = Cookies.get('token');
            const config = {
                headers: {},
                withCredentials: true
            };
            if (monCookie) {
                config.headers['Authorization'] = `Bearer ${monCookie}`;
            }
            // Appel à l'API pour mettre à jour le commentaire
            await axios.put(`http://localhost:8080/commentaires/${idFilm}/${idCom}/${this.idUtilisateur}`, {
                description: this.nouvelleDescription,
                note: this.com.note
            }, config);
            // Désactivation du mode édition et rafraîchissement des données du commentaire
            this.modeEdition = false;
            await this.fetchCommentaire();
        },

        // Attribution de la note au commentaire
        setRating(com, n) {
            com.note = n;
        },

        // Suppression du commentaire
        async supprimerCommentaire() {
            const idFilm = this.$route.params.idFilm;
            const idCom = this.$route.params.idCommentaire;
            const monCookie = Cookies.get('token');
            const config = {
                headers: {},
                withCredentials: true
            };
            if (monCookie) {
                config.headers['Authorization'] = `Bearer ${monCookie}`;
            }
            // Appel à l'API pour supprimer le commentaire
            const reponse = await axios.delete(`http://localhost:8080/commentaires/${idFilm}/${idCom}/${this.idUtilisateur}`, config);
            // Affichage d'une alerte avec le message de la réponse
            alert(reponse.data);
            // Redirection vers la page du film après la suppression
            this.$router.push(`/films/${idFilm}`);
        }
    },
};
</script>

<style scoped>
/* Styles spécifiques au composant */
.commentaires-container {
    max-width: 800px;
    margin: 0 auto;
}

.commentaires-title {
    text-align: center;
    margin-bottom: 20px;
}

.commentaires-list {
    list-style-type: none;
    padding: 0;
}

.commentaires-item {
    border-bottom: 1px solid #ccc;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.commentaires-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
}

.commentaires-pseudo {
    font-weight: bold;
    font-size: 1.2em;
}

.commentaires-date {
    font-size: 0.8em;
    color: #999;
}

.commentaires-description {
    text-align: center;
    margin-bottom: 10px;
}

.star-rating {
    display: inline-block;
    font-size: 16px;
    color: #ffcc00;
    cursor: pointer;
}
</style>
