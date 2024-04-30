<template>
    <!-- Container pour afficher le profil utilisateur -->
    <div class="container is-fluid">
        <!-- Titre de la page -->
        <h1 class="title has-text-centered">Profil utilisateur</h1>
        <div class="box">
            <!-- Formulaire pour modifier les informations utilisateur -->
            <form v-if="editMode">
                <!-- Affichage du pseudo de l'utilisateur -->
                <p><strong>Pseudo:</strong> {{ utilisateur.pseudo }}</p>
                <!-- Champ pour modifier le nom de l'utilisateur -->
                <div class="field">
                    <label class="label">Nom</label>
                    <div class="control">
                        <input class="input" type="text" v-model="utilisateur.nom" />
                    </div>
                </div>
                <!-- Champ pour modifier le prénom de l'utilisateur -->
                <div class="field">
                    <label class="label">Prénom</label>
                    <div class="control">
                        <input class="input" type="text" v-model="utilisateur.prenom" />
                    </div>
                </div>
                <!-- Affichage de l'email de l'utilisateur -->
                <p><strong>Email:</strong> {{ utilisateur.mail }}</p>
                <!-- Champ pour modifier la date de naissance de l'utilisateur -->
                <div class="field">
                    <label class="label">Date de naissance:</label>
                    <div class="control">
                        <input class="input" type="text" v-model="utilisateur.dateNaissance" />
                    </div>
                </div>
                <!-- Champ pour modifier le mot de passe de l'utilisateur -->
                <div class="field">
                    <label class="label">Mot de passe</label>
                    <div class="control">
                        <input class="input" type="password" v-model="utilisateur.mdp" />
                    </div>
                </div>
                <!-- Champ pour confirmer le mot de passe -->
                <div class="field">
                    <label for="confirmeMdp" class="label">Confirmer le mot de passe:</label>
                    <div class="control">
                        <input v-model="confirmeMdp" type="password" id="confirmeMdp" class="input" required />
                    </div>
                </div>
                <!-- Boutons pour mettre à jour, annuler ou supprimer le compte -->
                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link" @click.prevent="updateUtilisateur">Mettre à jour</button>
                    </div>
                    <div class="control">
                        <button class="button is-light" @click.prevent="annulerModification">Annuler</button>
                    </div>
                    <div class="control">
                        <button class="button is-danger" @click.prevent="supprimerCompte">Supprimer le compte</button>
                    </div>
                </div>
            </form>
            <!-- Affichage des informations utilisateur en mode lecture seule -->
            <div v-else>
                <p><strong>Pseudo:</strong> {{ utilisateur.pseudo }}</p>
                <p><strong>Nom:</strong> {{ utilisateur.nom }}</p>
                <p><strong>Prénom:</strong> {{ utilisateur.prenom }}</p>
                <p><strong>Email:</strong> {{ utilisateur.mail }}</p>
                <p><strong>Date de naissance:</strong> {{ utilisateur.dateNaissance }}</p>
                <p><strong>Mot de passe:</strong> *******</p>
                <!-- Boutons pour modifier ou supprimer le compte -->
                <button class="button is-link" @click.prevent="editMode = true">Modifier</button>
                <button class="button is-danger" @click.prevent="supprimerCompte">Supprimer mon compte</button>
            </div>
            <!-- Affichage des erreurs -->
            <p v-if="erreur" class="help is-danger">{{ erreur }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
export default {
    name: 'UtilisateurDetails',
    data() {
        return {
            // Données de l'utilisateur
            utilisateur: {
                pseudo: "",
                mail: "",
                nom: "",
                prenom: "",
                dateNaissance: null,
                mdp: '',
            },
            // Champ pour confirmer le mot de passe
            confirmeMdp: '',
            // Message d'erreur
            erreur: '',
            // Mode d'édition du formulaire
            editMode: false,
        };
    },
    created() {
        // Récupération de l'ID de l'utilisateur
        const id = this.$route.params.id;
        // Appel de la méthode pour récupérer les informations de l'utilisateur
        this.fetchUtilisateur();
    },
    methods: {
        // Méthode pour récupérer les informations de l'utilisateur depuis le serveur
        async fetchUtilisateur() {
            try {
                const monCookie = Cookies.get('token');
                const config = {
                    headers: {
                    },
                    withCredentials: true
                };
                if (monCookie) {
                    config.headers['Authorization'] = `Bearer ${monCookie}`;
                }
                const id = this.$route.params.id;
                const reponse = await axios.get(`http://localhost:8080/utilisateurs/${id}`, config);
                this.utilisateur = reponse.data;
            } catch (erreur) {
                if (erreur.response != null) {
                    this.erreur = erreur.response.data.message;
                } else {
                    this.erreur = 'Une erreur s\'est produite lors de la récupération de vos informations personnelles.';
                }
            }
        },
        // Méthode pour mettre à jour les informations de l'utilisateur
        async updateUtilisateur() {
            if (this.utilisateur.mdp != this.confirmeMdp) {
                this.erreur = "Les mots de passe ne correspondent pas.";
                return;
            }
            try {
                const monCookie = Cookies.get('token');
                const config = {
                    headers: {
                    },
                    withCredentials: true
                };
                if (monCookie) {
                    config.headers['Authorization'] = `Bearer ${monCookie}`;
                }
                const id = this.$route.params.id;
                await axios.put(`http://localhost:8080/utilisateurs/${id}`, this.utilisateur, config);
                this.editMode = false;
                this.erreur = '';
                alert('Vos informations personnelles ont bien été mises à jour')
            } catch (erreur) {
                if (erreur.response != null) {
                    this.erreur = erreur.response.data.message;
                } else {
                    this.erreur = 'Une erreur s\'est produite lors de la mise à jour de vos informations personnelles.';
                }
            }
        },
        // Méthode pour annuler la modification des informations de l'utilisateur
        annulerModification() {
            this.editMode = false;
            this.fetchUtilisateur();
        },
        // Méthode pour supprimer le compte utilisateur
        async supprimerCompte() {
            const confirmation = confirm("Voulez-vous vraiment supprimer votre compte? Appuyez sur OK pour supprimer toutes vos données ou Annuler pour seulement désactiver votre compte.");
            if (confirmation) { //suppression compte
                try {
                    const monCookie = Cookies.get('token');
                    const config = {
                        headers: {
                        },
                        withCredentials: true
                    };
                    if (monCookie) {
                        config.headers['Authorization'] = `Bearer ${monCookie}`;
                    }
                    const id = this.$route.params.id;
                    const response = await axios.delete(`http://localhost:8080/utilisateurs/supprimer/${id}`, config);
                    document.cookie = 'cook=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    alert('Votre compte a bien été supprimé.');
                    window.location.href = '/connexion';
                } catch (erreur) {
                    if (erreur.response != null) {
                        this.erreur = erreur.response.data.message;
                    } else {
                        this.erreur = 'Une erreur s\'est produite lors de la suppression de votre compte.';
                    }
                }
            } else { //désactivation compte
                try {
                    const monCookie = Cookies.get('token');
                    const config = {
                        headers: {
                        },
                        withCredentials: true
                    };
                    if (monCookie) {
                        config.headers['Authorization'] = `Bearer ${monCookie}`;
                    }
                    const id = this.$route.params.id;
                    const response = await axios.delete(`http://localhost:8080/utilisateurs/${id}`, config);
                    console.log(response.data.message);
                    document.cookie = 'cook=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    alert('Votre compte a bien été désactivé.');
                    window.location.href = '/connexion';
                } catch (erreur) {
                    if (erreur.response != null) {
                        this.erreur = erreur.response.data.message;
                    } else {
                        this.erreur = 'Une erreur s\'est produite lors de la désactivation de votre compte.';
                    }
                }
            }
        },
    },
};
</script>
