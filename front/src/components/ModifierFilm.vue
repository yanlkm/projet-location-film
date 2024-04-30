<template>
    <!-- Formulaire de modification d'un film -->
    <form @submit.prevent="modifierFilm">
        <!-- Champ pour le nom du film -->
        <div>
            <label for="nom">Nom :</label>
            <input type="text" id="nom" v-model="nom">
        </div>
        <!-- Champ pour le réalisateur du film -->
        <div>
            <label for="realisateur">Réalisateur :</label>
            <input type="text" id="realisateur" v-model="realisateur">
        </div>
        <!-- Champ pour le genre du film -->
        <div>
            <label for="genre">Genre :</label>
            <input type="text" id="genre" v-model="genre">
        </div>
        <!-- Champ pour le synopsis du film -->
        <div>
            <label for="synopsis">Synopsis :</label>
            <textarea id="synopsis" v-model="synopsis"></textarea>
        </div>
        <!-- Champ pour la date de sortie du film -->
        <div>
            <label for="dateSortie">Date de sortie :</label>
            <input type="date" id="dateSortie" v-model="dateSortie">
        </div>
        <!-- Champ pour le prix du film -->
        <div>
            <label for="prix">Prix :</label>
            <input type="number" id="prix" v-model.number="prix">
        </div>
        <!-- Champ pour le PEGI du film -->
        <div>
            <label for="pegi">PEGI :</label>
            <input type="number" id="pegi" v-model.number="pegi">
        </div>
        <!-- Champ pour l'URL du film -->
        <div>
            <label for="url">URL :</label>
            <input type="text" id="url" v-model="url">
        </div>
        <!-- Bouton de soumission du formulaire -->
        <button type="submit">Modifier le film</button>
    </form>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
    data() {
        return {
            // Données du film à modifier
            nom: '',
            realisateur: '',
            genre: '',
            synopsis: '',
            dateSortie: '',
            prix: 0,
            pegi: 0,
            url: ''
        };
    },
    created() {
        // Récupération des données du film à modifier
        this.fetchFilm();
    },
    methods: {
        // Méthode pour récupérer les données du film à modifier
        async fetchFilm() {
            const idFilm = this.$route.params.idFilm;
            try {
                const reponse = await axios.get(`http://localhost:8080/films/${idFilm}`);
                // Remplissage des champs du formulaire avec les données du film
                this.nom = reponse.data.nom;
                this.realisateur = reponse.data.realisateur;
                this.genre = reponse.data.genre;
                this.synopsis = reponse.data.synopsis;
                this.dateSortie = reponse.data.dateSortie; 
                this.prix = reponse.data.prix;
                this.pegi = reponse.data.pegi;
                this.url = reponse.data.url;
            } catch (erreur) {
                // Gestion des erreurs
                alert(erreur.response.data.message);
                this.$router.push('/');
            }
        },
        // Méthode pour formater la date
        formatDate(dateString) {
            const [year, month, day] = dateString.split('T')[0].split('-');
            return `${year}-${month}-${day}`;
        },
        // Méthode pour modifier les données du film
        async modifierFilm() {
            // Récupération du cookie d'authentification
            const monCookie = Cookies.get('token');
            const config = {
                headers: {},
                withCredentials: true
            };
            if (monCookie) {
                config.headers['Authorization'] = `Bearer ${monCookie}`;
            }
            try {
                // Récupération de l'ID du film à modifier
                const idFilm = this.$route.params.idFilm;
                // Envoi des nouvelles données du film au serveur
                const reponse = await axios.put(`http://localhost:8080/admin/films/${idFilm}`, {
                    nom: this.nom,
                    realisateur: this.realisateur,
                    genre: this.genre,
                    synopsis: this.synopsis,
                    dateSortie: this.dateSortie,
                    prix: this.prix,
                    pegi: this.pegi,
                    url: this.url
                }, config);
                // Affichage d'une confirmation de modification
                alert('Le film a bien été modifié');
                // Redirection vers la liste des films après modification
                this.$router.push(`/admin/films/`);
            } catch (erreur) {
                // Gestion des erreurs
                alert(erreur.response.data.message);
                // Redirection vers la liste des films en cas d'erreur autre que le format de date
                if (erreur.response.data.message != "La date de sortie doit être au format YYYY-MM-DD") {
                    this.$router.push('/films'); 
                }
            }
        }
    }
};
</script>
