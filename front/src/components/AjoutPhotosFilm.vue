<template>
    <!-- Champ d'entrée pour sélectionner un fichier image -->
    <input type="file" @change="onFileChange" accept="image/*" />
</template>

<script>
import axios from 'axios';

export default {
    name: 'AjoutPhotosFilm',
    data() {
        // Données locales du composant
        return {
            // Informations de l'utilisateur (non utilisées dans ce composant)
            infoUtilisateur: '',
            // Données de l'image encodée en base64
            imageData: null
        }
    },
    methods: {
        // Méthode appelée lorsqu'un fichier est sélectionné
        async onFileChange(event) {
            // Récupération du fichier sélectionné
            const file = event.target.files[0];
            // Création d'un lecteur de fichier
            const reader = new FileReader();
            // Fonction exécutée lorsque la lecture du fichier est terminée
            reader.onload = async () => {
                // Extraction de la partie base64 de l'URL du fichier
                const base64String = reader.result.split(',')[1];
                // Stockage de la représentation base64 de l'image
                this.imageData = base64String;
                // Récupération de l'identifiant du film à partir des paramètres de l'URL
                const filmId = this.$route.params.idFilm;
                try {
                    // Envoi de la requête POST avec les données de l'image au serveur
                    const reponse = await axios.post(`http://localhost:8080/photos/films/${filmId}`, {
                        image: this.imageData
                    });
                    // Affichage d'une alerte en cas de succès
                    alert('La photo a été ajoutée avec succès');
                    // Redirection vers la page d'administration des films
                    this.$router.push('/admin/films');
                } catch (error) {
                    // Affichage d'une alerte en cas d'erreur lors de l'envoi de la requête
                    alert('Erreur lors de l\'ajout de la photo');
                }
            };
            // Lecture du contenu du fichier en tant qu'URL de données
            reader.readAsDataURL(file);
        }
    }
};
</script>
