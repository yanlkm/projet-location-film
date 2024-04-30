<template>
    <!-- Section principale pour créer un compte -->
    <div class="section">
        <div class="container">
            <!-- Titre de la section -->
            <h1 class="title">Créer un compte</h1>
            <!-- Formulaire de création de compte -->
            <form @submit.prevent="creation" class="box">
                <!-- Champ Email -->
                <div class="field">
                    <label for="mail" class="label">Email:</label>
                    <div class="control">
                        <input v-model="mail" type="email" id="mail" class="input" required />
                    </div>
                </div>

                <!-- Champ Pseudo -->
                <div class="field">
                    <label for="pseudo" class="label">Pseudo:</label>
                    <div class="control">
                        <input v-model="pseudo" type="text" id="pseudo" class="input" required />
                    </div>
                </div>

                <!-- Champ Nom -->
                <div class="field">
                    <label for="nom" class="label">Nom:</label>
                    <div class="control">
                        <input v-model="nom" type="text" id="nom" class="input" required />
                    </div>
                </div>

                <!-- Champ Prénom -->
                <div class="field">
                    <label for="prenom" class="label">Prénom:</label>
                    <div class="control">
                        <input v-model="prenom" type="text" id="prenom" class="input" required />
                    </div>
                </div>

                <!-- Champ Date de Naissance -->
                <div class="field">
                    <label for="dateNaissance" class="label">Date de naissance:</label>
                    <div class="control">
                        <input v-model="dateNaissance" type="date" id="dateNaissance" class="input" required />
                    </div>
                </div>

                <!-- Champ Mot de Passe -->
                <div class="field">
                    <label for="mdp" class="label">Mot de passe:</label>
                    <div class="control">
                        <input v-model="mdp" type="password" id="mdp" class="input" required />
                    </div>
                </div>

                <!-- Champ Confirmation de Mot de Passe -->
                <div class="field">
                    <label for="confirmeMdp" class="label">Confirmer le mot de passe:</label>
                    <div class="control">
                        <input v-model="confirmeMdp" type="password" id="confirmeMdp" class="input" required />
                    </div>
                </div>

                <!-- Bouton pour soumettre le formulaire -->
                <div class="field">
                    <div class="control">
                        <button type="submit" class="button is-primary">Créer un compte</button>
                    </div>
                </div>
            </form>

            <!-- Affichage des erreurs éventuelles -->
            <p v-if="erreur" class="help is-danger">{{ erreur }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            // Variables pour les données du formulaire
            pseudo: '',
            mail: '',
            nom: '',
            prenom: '',
            dateNaissance: '',
            mdp: '',
            confirmeMdp: '',
            // Variable pour stocker les erreurs
            erreur: '',
        };
    },
    methods: {
        // Fonction de création de compte
        async creation() {
            // Vérification si tous les champs sont remplis
            if (!this.mail || !this.pseudo || !this.nom || !this.prenom || !this.dateNaissance || !this.mdp || !this.confirmeMdp) {
                this.erreur = 'Tous les champs sont requis.';
                return;
            }

            // Vérification si les mots de passe correspondent
            if (this.mdp !== this.confirmeMdp) {
                this.erreur = "Les mots de passe ne correspondent pas.";
                return;
            }

            try {
                // Appel à l'API pour créer un compte utilisateur
                const response = await axios.post('http://localhost:8080/utilisateurs', {
                    pseudo: this.pseudo,
                    mail: this.mail,
                    nom: this.nom,
                    prenom: this.prenom,
                    dateNaissance: this.dateNaissance,
                    mdp: this.mdp,
                    role: 'N',
                    validite: 'A'
                });
                // Affichage d'une alerte en cas de succès
                alert('Votre compte a bien été créé !')
                // Réinitialisation des erreurs et redirection vers la page de connexion
                this.erreur = '';
                this.$router.push('/connexion');
            } catch (erreur) {
                // Gestion des erreurs
                if (erreur.response != null) {
                    this.erreur = erreur.response.data.message;
                } else {
                    this.erreur = 'Une erreur s\'est produite lors de la création du compte.';
                }
            }
        },
    },
};
</script>
