<template>
    <!-- Section principale pour ajouter un film -->
    <div class="section">
        <div class="container">
            <!-- Titre de la section -->
            <h1 class="title">Ajouter un film</h1>
            <!-- Formulaire pour créer un nouveau film -->
            <form @submit.prevent="creerFilm">
                <!-- Champ Nom du film -->
                <div class="field">
                    <label for="nom" class="label">Nom :</label>
                    <div class="control">
                        <input v-model="nom" type="text" id="nom" class="input" required />
                    </div>
                </div>
                <!-- Champ Réalisateur -->
                <div class="field">
                    <label for="realisateur" class="label">Réalisateur :</label>
                    <div class="control">
                        <input v-model="realisateur" type="text" id="realisateur" class="input" required />
                    </div>
                </div>
                <!-- Champ Genre -->
                <div class="field">
                    <label for="genre" class="label">Genre:</label>
                    <div class="control">
                        <input v-model="genre" type="text" id="genre" class="input" required />
                    </div>
                </div>
                <!-- Champ Synopsis -->
                <div class="field">
                    <label for="synopsis" class="label">Synopsis :</label>
                    <div class="control">
                        <input v-model="synopsis" type="text" id="synopsis" class="input" required />
                    </div>
                </div>
                <!-- Champ Date de sortie -->
                <div class="field">
                    <label for="dateSortie" class="label">Date de sortie :</label>
                    <div class="control">
                        <input v-model="dateSortie" type="date" id="dateSortie" class="input" required />
                    </div>
                </div>
                <!-- Champ Prix -->
                <div class="field">
                    <label for="prix" class="label">Prix:</label>
                    <div class="control">
                        <input v-model="prix" type="number" id="prix" class="input" required />
                    </div>
                </div>
                <!-- Champ PEGI -->
                <div class="field">
                    <label for="pegi" class="label">PEGI:</label>
                    <div class="control">
                        <input v-model="pegi" type="number" id="pegi" class="input" required />
                    </div>
                </div>
                <!-- Champ URL -->
                <div class="field">
                    <label for="url" class="label">URL:</label>
                    <div class="control">
                        <input v-model="url" type="text" id="url" class="input" required />
                    </div>
                </div>
                <!-- Bouton pour soumettre le formulaire -->
                <div class="field">
                    <div class="control">
                        <button type="submit" class="button is-primary">Créer le film</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import ajouterPhoto from './ajouterPhoto.vue'; // Importation du composant pour ajouter une photo
import Cookies from 'js-cookie';

export default {
    data() {
        return {
            // Variables pour les données du formulaire
            nom: '',
            realisateur: '',
            genre: '',
            synopsis: '',
            dateSortie: '',
            prix: 0,
            pegi: 0,
            url: '',
            // Variable pour stocker les informations de l'utilisateur
            infoUtilisateur: '',
        };
    },
    created() {
        // Récupération des informations de l'utilisateur depuis les cookies
        const infos = Cookies.get('cook');
        if (infos != null) {
            this.infoUtilisateur = JSON.parse(infos);
        } else {
            this.infoUtilisateur = null;
        }
    },
    methods: {
        // Fonction pour créer un nouveau film
        async creerFilm() {
            try {
                // Récupération du token d'authentification depuis les cookies
                const monCookie = Cookies.get('token');

                // Configuration de la requête HTTP
                const config = {
                    headers: {},
                    withCredentials: true
                };
                if (monCookie) {
                    config.headers['Authorization'] = `Bearer ${monCookie}`;
                }

                // Envoi de la requête HTTP pour créer un nouveau film
                const reponse = await axios.post('http://localhost:8080/admin/films', {
                    nom: this.nom,
                    realisateur: this.realisateur,
                    genre: this.genre,
                    synopsis: this.synopsis,
                    dateSortie: this.dateSortie,
                    validite: 'V',
                    prix: this.prix,
                    pegi: this.pegi,
                    url: this.url
                }, config);

                // Affichage d'une alerte en cas de succès
                alert('Le film a bien été créé');

                // Redirection vers la liste des films de l'administrateur
                this.$router.push(`/admin/films`);
            } catch (erreur) {
                // Gestion des erreurs
                alert(erreur.response.data.message);
                // Redirection vers la page des films en cas d'erreur
                this.$router.push(`/films`);
                console.error(erreur);
            }
        }
    }
};
</script>
