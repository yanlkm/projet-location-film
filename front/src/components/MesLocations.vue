<template>
    <!-- Conteneur principal -->
    <div class="container">
        <!-- Titre de la page -->
        <h1 class="title is-1">Mes locations</h1>
        <!-- Onglets de navigation -->
        <div class="tabs is-centered is-boxed">
            <ul>
                <!-- Onglet "Toutes les locations" -->
                <li :class="{ 'is-active': activeTab === 'toutesLesLocations' }">
                    <a @click="activeTab = 'toutesLesLocations'">Toutes les locations</a>
                </li>
                <!-- Onglet "Locations en cours" -->
                <li :class="{ 'is-active': activeTab === 'locationsEnCours' }">
                    <a @click="activeTab = 'locationsEnCours'">Locations en cours</a>
                </li>
                <!-- Onglet "Locations terminées" -->
                <li :class="{ 'is-active': activeTab === 'locationsFinis' }">
                    <a @click="activeTab = 'locationsFinis'">Locations terminées</a>
                </li>
            </ul>
        </div>
        <!-- Affichage des locations en fonction de l'onglet actif -->
        <div v-if="activeTab === 'toutesLesLocations'">
            <!-- Affichage en cas d'erreur -->
            <p v-if="erreur"> {{ erreur }}</p>
            <!-- Cartes des locations -->
            <div class="card">
                <div class="columns is-multiline">
                    <!-- Carte pour chaque location -->
                    <div class="column is-one-third" v-for="location in toutesLesLocations" :key="location.location.idLocation">
                        <!-- Vérification de l'état de la location -->
                        <div v-if="!locationFinis(location)">
                            <!-- Lien vers les détails de la location -->
                            <router-link :to="{ name: 'LocationDetails', params: { idUtilisateur: this.idUtilisateur, idLocation: location.location.idLocation } }">
                                <div class="card">
                                    <!-- Image de la location -->
                                    <div class="card-image">
                                        <figure class="image is-4by3">
                                            <img :src="'data:image/jpeg;base64,' + location.photo" alt="Affiche du film" class="film-image ">
                                        </figure>
                                    </div>
                                    <!-- Contenu de la carte -->
                                    <div class="card-content">
                                        <div class="media">
                                            <div class="media-content">
                                                <!-- Titre du film -->
                                                <p class="title is-4">{{ location?.film?.nom }}</p>
                                                <!-- Période de la location -->
                                                <p class="subtitle is-6">Du {{ formatDate(location.location.dateDebut) }} au {{ formatDate(location.location.dateFin) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <div v-else>
                            <!-- Carte pour les locations terminées -->
                            <div class="card" :class="{ 'is-finished': locationFinis(location) }">
                                <!-- Image de la location -->
                                <div class="card-image">
                                    <figure class="image is-4by3">
                                        <img :src="'data:image/jpeg;base64,' + location.photo" alt="Affiche du film" class="film-image">
                                    </figure>
                                </div>
                                <!-- Contenu de la carte -->
                                <div class="card-content">
                                    <div class="media">
                                        <div class="media-content">
                                            <!-- Titre du film -->
                                            <p class="title is-4">{{ location?.film?.nom }}</p>
                                            <!-- Période de la location -->
                                            <p class="subtitle is-6">Du {{ formatDate(location.location.dateDebut) }} au {{ formatDate(location.location.dateFin) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Affichage des locations en cours -->
        <div v-else-if="activeTab === 'locationsEnCours'">
            <!-- Affichage en cas d'erreur -->
            <p v-if="erreur2"> {{ erreur2 }}</p>
            <div class="card">
                <div class="columns is-multiline">
                    <!-- Carte pour chaque location en cours -->
                    <div class="column is-one-third" v-for="location in locationsEnCours" :key="location.location.idLocation">
                        <!-- Lien vers les détails de la location -->
                        <router-link :to="{ name: 'LocationDetails', params: { idUtilisateur: this.idUtilisateur, idLocation: location.location.idLocation }}">
                            <div class="card">
                                <!-- Image de la location -->
                                <div class="card-image">
                                    <figure class="image is-4by3">
                                        <img :src="'data:image/jpeg;base64,' + location.photo" alt="Affiche du film" class="film-image">
                                    </figure>
                                </div>
                                <!-- Contenu de la carte -->
                                <div class="card-content">
                                    <div class="media">
                                        <div class="media-content">
                                            <!-- Titre du film -->
                                            <p class="title is-4">{{ location?.film?.nom }}</p>
                                            <!-- Période de la location -->
                                            <p class="subtitle is-6">Du {{ formatDate(location.location.dateDebut) }} au {{ formatDate(location.location.dateFin) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Affichage des locations terminées -->
        <div v-else-if="activeTab === 'locationsFinis'">
            <!-- Affichage en cas d'erreur -->
            <p v-if="erreur3"> {{ erreur3 }}</p>
            <div class="card is-finished">
                <div class="columns is-multiline">
                    <!-- Carte pour chaque location terminée -->
                    <div class="column is-one-third" v-for="location in locationsFinis" :key="location.location.idLocation">
                        <div class="card">
                            <!-- Image de la location -->
                            <div class="card-image">
                                <figure class="image is-4by3">
                                    <img :src="'data:image/jpeg;base64,' + location.photo" alt="Affiche du film" class="film-image ">
                                </figure>
                            </div>
                            <!-- Contenu de la carte -->
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-content">
                                        <!-- Titre du film -->
                                        <p class="title is-4">{{ location?.film?.nom }}</p>
                                        <!-- Période de la location -->
                                        <p class="subtitle is-6">Du {{ formatDate(location.location.dateDebut) }} au {{ formatDate(location.location.dateFin) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment';
import Cookies from 'js-cookie';

export default {
    name: 'MesLocations',
    data() {
        return {
            idUtilisateur: null,
            erreur: '',
            erreur2: '',
            erreur3: '',
            activeTab: 'toutesLesLocations',
            locationsEnCours: [],
            locationsFinis: [],
            toutesLesLocations: [],
        };
    },
    created() {
        // Configuration de moment pour le français
        moment.locale('fr', {
            months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        });
        // Récupération de l'ID de l'utilisateur à partir du cookie
        this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
        this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
        // Chargement des locations
        this.fetchLocations();
    },
    methods: {
        async fetchLocations() {
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
                // Récupération de toutes les locations de l'utilisateur
                const toutesLesLocationsResponse = await axios.get(`http://localhost:8080/locations/${this.idUtilisateur}`, config);
                this.toutesLesLocations = toutesLesLocationsResponse.data;
                if (toutesLesLocationsResponse.data.length === 0) {
                    this.erreur = "Aucune location pour le moment";
                }
            } catch (erreur) {
                this.erreur = erreur.response.data.message;
            }
            try {
                // Récupération des locations en cours de l'utilisateur
                const locationsEnCoursResponse = await axios.get(`http://localhost:8080/locations/${this.idUtilisateur}/encours`, config);
                this.locationsEnCours = locationsEnCoursResponse.data;
            } catch (erreur) {
                this.erreur2 = erreur.response.data.message;
            }
            try {
                // Récupération des locations terminées de l'utilisateur
                const locationsFinisResponse = await axios.get(`http://localhost:8080/locations/${this.idUtilisateur}/fini`, config);
                this.locationsFinis = locationsFinisResponse.data;
            } catch (erreur) {
                this.erreur3 = erreur.response.data.message;
            }
        },
        // Vérification si une location est terminée
        locationFinis(location) {
            return this.locationsFinis.find(loc => loc.location.idLocation === location.location.idLocation);
        },
        // Formatage de la date
        formatDate(date) {
            return moment(date).format('DD MMMM YYYY, HH:mm');
        },
    }
};
</script>

<style>
/* Opacité des locations terminées */
.is-finished {
    opacity: 0.5;
}
/* Opacité des cartes des locations terminées */
.card.is-finished {
    opacity: 0.5;
}
</style>
