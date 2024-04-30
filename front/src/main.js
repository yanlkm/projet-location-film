import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import store from './store/index.js';
import SeConnecter from './components/SeConnecter.vue';
import CreerCompte from './components/CreerCompte.vue';
import CreerFilm from './components/CreerFilm.vue';
import ModifierFilm from './components/ModifierFilm.vue';
import Films from './components/Films.vue';
import FilmDetails from './components/FilmDetails.vue';
import Panier from './components/Panier.vue';
import ListeUtilisateurs from './components/ListeUtilisateurs.vue';
import ListeFilms from './components/ListeFilms.vue';
import UtilisateurDetails from './components/UtilisateurDetails.vue';
import MesLocations from './components/MesLocations.vue';
import CommentairesFilms from './components/CommentairesFilms.vue';
import LocationDetails from './components/LocationDetails.vue';
import CommentaireDetails from './components/CommentaireDetails.vue';
import ajouterPhoto from './components/ajouterPhoto.vue';
import AjoutPhotosFilm from './components/AjoutPhotosFilm.vue';
import Chat from './components/Chat.vue';

// Création du router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/' },
    { path: '/connexion', name: 'SeConnecter', component: SeConnecter },
    { path: '/inscription', name: 'CreerCompte', component: CreerCompte },
    { path: '/films', name: 'Films', component: Films },
    { path: '/films/:id', name: 'FilmDetails', component: FilmDetails },
    { path: '/commentaires/:idFilm/:idCommentaire', name: 'CommentaireDetails', component: CommentaireDetails, props: true },
    { path: '/panier/:id', name: 'Panier', component: Panier },
    { path: '/locations/:id', name: 'MesLocations', component: MesLocations },
    { path: '/locations/:idUtilisateur/:idLocation', name: 'LocationDetails', component: LocationDetails, props: true },
    { path: '/admin/comptes', name: 'ListeUtilisateurs', component: ListeUtilisateurs },
    { path: '/admin/films', name: 'ListeFilms', component: ListeFilms },
    { path: '/admin/films/creation', name: 'CreerFilm', component: CreerFilm },
    { path: '/admin/films/modification/:idFilm', name: 'ModifierFilm', component: ModifierFilm },
    { path: '/utilisateurs/:id', name: 'UtilisateurDetails', component: UtilisateurDetails },
    { path: '/photo/films/:idFilm', name: 'ajouterPhoto', component: ajouterPhoto },
    { path: '/admin/films/photos/:idFilm', name: 'AjoutPhotosFilm', component: AjoutPhotosFilm },
    { path: '/admin/films/:idFilm/commentaires', name: 'CommentairesFilms', component: CommentairesFilms },
    { path: '/chat', name: 'Chat', component: Chat }
  ]
});

// Création de l'application
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
