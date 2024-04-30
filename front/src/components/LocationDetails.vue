<template>
    <!-- Conteneur principal pour la vidéo -->
    <div class="video-container">
        <!-- Élément HTML dynamique pour l'iframe de la vidéo -->
        <div v-html="iframe" class="iframe"></div>
    </div>
    <!-- Composant pour poster des commentaires -->
    <PosterCommentaire :idFilm="idFilm" />
</template>

<script>
import axios from 'axios'
import PosterCommentaire from './PosterCommentaire.vue'
import Cookies from 'js-cookie';

export default {
    name: 'LocationDetails',
    components: {
        PosterCommentaire
    },
    props: {
        idFilm: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            infoUtilisateur: null,
            idUtilisateur: null,
            idFilm: null,
            iframe: {} // Initialisation de l'iframe
        }
    },
    created() {
        // Récupération des informations utilisateur à partir des cookies
        this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
        this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
        // Récupération de l'ID du film depuis les paramètres de l'URL
        this.idFilm = this.$route.query.idFilm;
        // Appel à la méthode pour récupérer les détails de la location
        this.fetchLocation()
    },
    methods: {
        async fetchLocation() {
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
                // Récupération des ID utilisateur et de location à partir des paramètres d'URL
                const idUtilisateur = this.$route.params.idUtilisateur
                const idLocation = this.$route.params.idLocation
                // Appel à l'API pour récupérer les détails de la location
                const response = await axios.get(`http://localhost:8080/locations/${idUtilisateur}/${idLocation}`, config);
                // Assignation de l'ID du film et de l'iframe récupérée à partir de la réponse de l'API
                this.idFilm = response.data.idFilm;
                this.iframe = response.data.urlFilm;
            } catch (error) {
                // Gestion des erreurs lors de la récupération des détails de la location
                console.error(error)
            }
        }
    }
}
</script>

<style scoped>
.video-container {
    position: relative;
    height: 80vh; /* Hauteur de la vidéo */
}

.iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Centrage de l'iframe */
    width: 853px; 
    height: 480px;
}
</style>
