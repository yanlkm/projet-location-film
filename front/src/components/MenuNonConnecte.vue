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
            <div class="navbar-start">
                <!-- Lien vers la page des films -->
                <router-link :to="{name: 'Films'}" class="navbar-item">Films</router-link>
            </div>
            <div class="navbar-start">
                <!-- Lien vers la page de chat -->
                <router-link :to="{name: 'Chat'}" class="navbar-item">Chat</router-link>
            </div>

            <!-- Boutons de connexion et d'inscription -->
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <!-- Lien vers la page de connexion -->
                        <router-link :to="{name: 'SeConnecter'}" class="button is-light">Connexion</router-link>
                        <!-- Lien vers la page d'inscription -->
                        <router-link :to="{name: 'CreerCompte'}" class="button is-primary"><strong>Inscription</strong></router-link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import locafilmLogo from '/images/logos/locafilm.png';
export default {
    name: 'MenuNonConnecte.vue',
    data() {
        return {
            showMobileMenu: false, // Indicateur pour afficher/masquer le menu mobile
            locafilmLogo, // Logo de Locafilm
        };
    },
};
</script>

<style scoped>
/* Styles spécifiques à la barre de navigation */
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
</style>
