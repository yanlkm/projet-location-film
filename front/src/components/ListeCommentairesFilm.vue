<template>
    <div class="commentaires-container">
        <h2 class="commentaires-title">Commentaires :</h2>
        <ul class="commentaires-list">
            <div v-if="commentaires.length === 0">
                <p>Aucun commentaire pour le moment</p>
            </div>
            <li class="commentaires-item" v-for="com in commentaires" :key="com.id">
                <div class="commentaires-header">
                    <p class="commentaires-pseudo">{{ com.pseudo }}:</p>
                    <!-- Section pour afficher la note -->
                    <div class="star-rating">
                        <span v-for="n in 5" :key="n">
                            <i class="fas fa-star" v-if="n <= com.note"></i>
                            <i class="far fa-star" v-else></i>
                        </span>
                    </div>
                    <p class="commentaires-date">{{ formatDate(com.datePublication) }}</p>
                </div>
                <p class="commentaires-description">{{ com.description }}</p>
                <!-- Lien pour voir plus de détails sur le commentaire -->
                <router-link :to="{ name: 'CommentaireDetails', params: { idFilm: $route.params.id, idCommentaire: com.idCommentaire } }">
                    <button>Voir plus</button>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
    name: 'ListeCommentairesFilm',
    data() {
        return {
            idUtilisateur: null,
            infoUtilisateur: null,
            commentaires: []
        };
    },
    created() {
        if (Cookies.get('cook')) {
            this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
            this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
        }
        this.fetchCommentaires();
    },
    methods: {
        async fetchCommentaires() {
            const idFilm = this.$route.params.id;
            const reponse = await axios.get(`http://localhost:8080/commentaires/${idFilm}`);
            this.commentaires = reponse.data;
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
    }
};
</script>

<style scoped>
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
