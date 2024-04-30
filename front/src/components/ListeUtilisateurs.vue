<template>
    <!-- Container principal -->
    <div>
        <!-- Titre de la liste -->
        <h1 class="title has-text-centered">Liste des utilisateurs</h1>
        <!-- Contenu de la liste -->
        <div class="is-flex is-justify-content-center is-align-items-center">
            <!-- Affichage des utilisateurs ou message si aucun utilisateur -->
            <div v-if="utilisateurs.length === 0">
                <p>Aucun utilisateur pour le moment</p>
            </div>
            <!-- Tableau pour afficher les détails des utilisateurs -->
            <table v-else class="table is-striped is-fullwidth">
                <thead>
                    <!-- En-têtes des colonnes -->
                    <tr>
                        <th>Pseudo</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Validité</th>
                        <th>Suppression</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Affichage des utilisateurs -->
                    <tr v-for="utilisateur in utilisateurs" :key="utilisateur.idUtilisateur">
                        <!-- Détails de chaque utilisateur -->
                        <td>{{ utilisateur.pseudo }}</td>
                        <td>{{ utilisateur.nom }}</td>
                        <td>{{ utilisateur.prenom }}</td>
                        <td>{{ utilisateur.mail }}</td>
                        <!-- Bouton pour activer ou désactiver la validité du compte -->
                        <td>
                            <button class="button" @click="toggleValidity(utilisateur)">
                                <img :src="utilisateur.validite === 'A' ? '/images/logos/enable.png' : '/images/logos/disable.png'"
                                    :alt="utilisateur.validite === 'A' ? 'Activé' : 'Désactivé'" width="20" height="20">
                            </button>
                        </td>
                        <!-- Bouton pour supprimer le compte utilisateur -->
                        <td>
                            <button class="button" @click="deleteUser(utilisateur)">
                                <img src="/images/logos/poubelle.png" alt="Supprimer" width="20" height="20">
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
    name: 'ListeUtilisateurs',
    data() {
        return {
            utilisateurs: [],
        };
    },
    created() {
        // Récupération de la liste des utilisateurs
        this.fetchUtilisateurs();
    },
    methods: {
        async fetchUtilisateurs() {
            try {
                // Récupération du token d'authentification
                const token = Cookies.get('token');
                const config = {
                    headers: {},
                    withCredentials: true
                };
                if (token) {
                    // Ajout du token dans les en-têtes de la requête
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                // Appel à l'API pour récupérer la liste des utilisateurs
                const response = await axios.get('http://localhost:8080/admin/comptes', config);
                // Filtrage pour ne conserver que les utilisateurs non administrateurs
                this.utilisateurs = response.data.filter(utilisateur => utilisateur.role === 'N');
            } catch (error) {
                // Gestion des erreurs lors de la récupération des utilisateurs
                alert(error.response.data.message);
                this.$router.push('/films');
            }
        },
        async toggleValidity(utilisateur) {
            try {
                // Récupération du token d'authentification
                const token = Cookies.get('token');
                const config = {
                    headers: {},
                    withCredentials: true
                };
                if (token) {
                    // Ajout du token dans les en-têtes de la requête
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                // Calcul de la nouvelle validité du compte utilisateur
                const newValidity = utilisateur.validite === 'A' ? 'N' : 'A';
                // Modification de la validité du compte utilisateur via l'API
                await axios.put(`http://localhost:8080/admin/comptes/${utilisateur.idUtilisateur}/validite`, { validite: newValidity }, config);
                // Rafraîchissement de la liste des utilisateurs après modification
                this.fetchUtilisateurs();
                // Affichage d'un message de succès
                const message = newValidity === 'A' ? 'Compte activé avec succès' : 'Compte désactivé avec succès';
                alert(message);
            } catch (error) {
                // Gestion des erreurs lors de la modification de la validité du compte utilisateur
                alert(error.response.data.message);
                this.$router.push('/films');
            }
        },
        async deleteUser(utilisateur) {
            try {
                // Récupération du token d'authentification
                const token = Cookies.get('token');
                const config = {
                    headers: {},
                    withCredentials: true
                };
                if (token) {
                    // Ajout du token dans les en-têtes de la requête
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                // Suppression du compte utilisateur via l'API
                await axios.delete(`http://localhost:8080/admin/comptes/${utilisateur.idUtilisateur}`, config);
                // Rafraîchissement de la liste des utilisateurs après suppression
                this.fetchUtilisateurs();
                // Affichage d'un message de succès
                alert('Compte supprimé avec succès');
            } catch (error) {
                // Gestion des erreurs lors de la suppression du compte utilisateur
                alert(error.response.data.message);
                this.$router.push('/admin/comptes');
            }
        }
    },
};
</script>
