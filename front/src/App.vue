<template>
  <!-- Affichage du menu en fonction du statut de l'utilisateur -->
  <div>
    <!-- Menu pour les utilisateurs non connectés -->
    <div v-if="infoUtilisateur === null">
      <MenuNonConnecte />
    </div>
    <!-- Menu pour les utilisateurs connectés -->
    <div v-else-if="infoUtilisateur.role === 'N'">
      <MenuUtilisateur />
    </div>
    <!-- Menu pour les administrateurs -->
    <div v-else-if="infoUtilisateur.role === 'A'">
      <MenuAdmin />
    </div>
    <!-- Vue router -->
    <router-view />
  </div>
</template>

<script>
import MenuNonConnecte from './components/MenuNonConnecte.vue';
import MenuUtilisateur from './components/MenuUtilisateur.vue';
import MenuAdmin from './components/MenuAdmin.vue';
import Cookies from 'js-cookie';

export default {
  name: 'App',
  data() {
    return {
      // Informations sur l'utilisateur
      infoUtilisateur: ''
    }
  },
  components: {
    MenuNonConnecte,
    MenuUtilisateur,
    MenuAdmin,
  },
  created() {
    // Récupération des informations de l'utilisateur depuis les cookies
    const infos = Cookies.get('cook');
    if (infos != null) {
      this.infoUtilisateur = JSON.parse(infos);
    } else {
      this.infoUtilisateur = null;
    }
  }
};
</script>
