<template>
    <!-- Barre de navigation principale -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <!-- Logo avec lien vers la page d'accueil -->
            <router-link to="/" class="navbar-item">
                <img :src="locafilmLogo" width="112" height="28" alt="Locafilm Logo">
            </router-link>

            <!-- Bouton hamburger pour les appareils mobiles -->
            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                data-target="navbarBasicExample" @click="showMobileMenu = !showMobileMenu">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <!-- Menu de navigation -->
        <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': showMobileMenu }">
            <!-- Section gauche du menu -->
            <div class="navbar-start">
                <!-- Lien vers la page des films -->
                <router-link :to="{ name: 'Films' }" class="navbar-item">Films</router-link>
                <!-- Lien vers la page de chat -->
                <router-link :to="{name: 'Chat'}" class="navbar-item">Chat</router-link>
            </div>

            <!-- Section droite du menu -->
            <div class="navbar-end">
                <!-- Dropdown pour le compte utilisateur -->
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">Compte</a>
                    <div class="navbar-dropdown">
                        <!-- Lien vers la page des locations de l'utilisateur -->
                        <router-link :to="{ name: 'MesLocations', params: { id: this.idUtilisateur } }"
                                     class="navbar-item">Mes locations</router-link>
                        <!-- Lien vers l'espace personnel de l'utilisateur -->
                        <router-link :to="{ name: 'UtilisateurDetails', params: { id: this.idUtilisateur } }"
                                     class="navbar-item">Espace personnel</router-link>
                        <hr class="navbar-divider">
                        <!-- Bouton de déconnexion -->
                        <button class="button is-danger is-outlined is-fullwidth"
                                @click="deconnexion">Déconnexion</button>
                    </div>
                </div>
                <!-- Lien vers le panier de l'utilisateur -->
                <router-link :to="{ name: 'Panier', params: { id: this.idUtilisateur } }" class="navbar-item">
                    <div class="panier-container">
                        <img :src="iconPanier" width="30" height="30" alt="Panier">
                        <span class="cart-count" v-if="compteurPanier > 0">{{ compteurPanier }}</span>
                    </div>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script>
import locafilmLogo from '/images/logos/locafilm.png';
import iconPanier from '/images/logos/panier.png';
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
    name: 'MenuUtilisateur.vue',
    data() {
        return {
            showMobileMenu: false, // Indicateur pour afficher/masquer le menu mobile
            locafilmLogo, // Logo de Locafilm
            iconPanier, // Icône du panier
            idUtilisateur: null, // Identifiant de l'utilisateur
            infoUtilisateur: null, // Informations de l'utilisateur
            panier: [], // Contenu du panier
        };
    },
    computed: {
        // Calcul du nombre d'éléments dans le panier
        compteurPanier() {
            return this.panier.length;
        },
    },
    created() {
        // Récupération des informations de l'utilisateur et initialisation
        this.infoUtilisateur = JSON.parse(Cookies.get('cook'));
        this.idUtilisateur = this.infoUtilisateur.idUtilisateur;
        this.fetchCompteurPanier();
    },
    methods: {
        // Récupération du contenu du panier
        async fetchCompteurPanier() {
            const monCookie = Cookies.get('token');
            const config = { headers: {}, withCredentials: true };
            if (monCookie) config.headers['Authorization'] = `Bearer ${monCookie}`;
            try {
                const response = await axios.get(`http://localhost:8080/panier/${this.idUtilisateur}`, config);
                this.panier = response.data;
            } catch (error) {
                if (error.response.status === 404) console.log("Panier vide");
            }
        },
        // Déconnexion de l'utilisateur
        async deconnexion() {
            try {
                const monCookie = Cookies.get('token');
                const config = { headers: {}, withCredentials: true };
                if (monCookie) config.headers['Authorization'] = `Bearer ${monCookie}`;
                await axios.get('http://localhost:8080/auth/deconnexion', config);
                document.cookie = 'cook=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                alert('Vous êtes maintenant déconnecté.');
                window.location.href = '/connexion';
            } catch (erreur) {
                alert(erreur.response.data.message);
            }
        },
    },
};
</script>

<style scoped>
/* Styles spécifiques au compteur du panier */
.cart-count {
    background-color: red; /* Couleur de fond rouge */
    color: white; /* Couleur du texte blanc */
    border-radius: 50%; /* Bordure arrondie */
    padding: 0 5px; /* Espacement intérieur */
    font-size: 10px; /* Taille de la police */
    position: absolute; /* Position absolue par rapport au parent */
    top: 2px; /* Décalage vers le haut */
    right: 7px; /* Décalage vers la droite */
}

/* Styles de la section du panier */
.panier-container {
    position: relative; /* Position relative pour le positionnement absolu du compteur */
    display: flex; /* Affichage en ligne des éléments */
    align-items: center; /* Alignement vertical */
    justify-content: center; /* Alignement horizontal */
}

/* Styles généraux de la barre de navigation */
.navbar {
    background-color: #363636; /* Couleur de fond */
    color: white; /* Couleur du texte */
}

/* Styles des liens de navigation */
.navbar-item {
    color: white; /* Couleur du texte */
}

/* Styles des liens de navigation au survol */
.navbar-item:hover {
    color: #ccc; /* Couleur du texte au survol */
}

/* Styles du bouton hamburger */
.navbar-burger {
    color: white; /* Couleur du bouton */
}

/* Styles du bouton hamburger au survol */
.navbar-burger:hover {
    color: #ccc; /* Couleur du bouton au survol */
}

/* Styles du dropdown du compte utilisateur */
.navbar-dropdown {
    background-color: #363636; /* Couleur de fond */
}

/* Styles des éléments du dropdown */
.navbar-dropdown .navbar-item {
    color: white; /* Couleur du texte */
}

/* Styles des éléments du dropdown au survol */
.navbar-dropdown .navbar-item:hover {
    background-color: #4a4a4a; /* Couleur de fond au survol */
    color: #ccc; /* Couleur du texte au survol */
}

/* Styles de la ligne de séparation du dropdown */
.navbar-dropdown hr.navbar-divider {
    border-top-color: #4a4a4a; /* Couleur de la ligne de séparation */
}

/* Styles du bouton de déconnexion */
.navbar-dropdown .button.is-danger.is-outlined.is-fullwidth:hover {
    background-color: transparent; /* Couleur de fond transparente au survol */
    border-color: #ccc; /* Couleur de la bordure */
    color: #ccc; /* Couleur du texte */
}

/* Styles du lien de la barre de navigation */
.navbar-link {
    color: white; /* Couleur du texte */
}

/* Styles du lien de la barre de navigation au survol */
.navbar-link:hover {
    color: #ccc; /* Couleur du texte au survol */
}

/* Styles du lien avec dropdown au survol */
.navbar-item.has-dropdown:hover .navbar-link {
    color: white; /* Couleur du texte */
    background-color: #363636; /* Couleur de fond */
}
</style>
