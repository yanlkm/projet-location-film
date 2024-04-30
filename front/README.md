# Frontend de l'Application

Ce document fournit un aperçu de la partie frontend de l'application, comprenant les composants, les fonctionnalités et les technologies utilisées.

---

## Structure du Projet

- **`src/components/` :** Contient les composants de l'interface utilisateur.
- **`App.vue` :** Fichier principal de l'application Vue.js.
- **`store/` :** Gestion de l'état global avec Vuex.
- **`router.js` :** Gestion des routes avec Vue Router.
- **`main.js` :** Point d'entrée de l'application.

## Composants Principaux

1. **SeConnecter (`SeConnecter.vue`) :** Page de connexion.
2. **CreerCompte (`CreerCompte.vue`) :** Page de création de compte.
3. **Films (`Films.vue`) :** Liste des films disponibles.
4. **FilmDetails (`FilmDetails.vue`) :** Détails d'un film spécifique.
5. **Panier (`Panier.vue`) :** Panier de l'utilisateur.
6. **ListeUtilisateurs (`ListeUtilisateurs.vue`) :** Liste des utilisateurs pour les administrateurs.
7. **ListeFilms (`ListeFilms.vue`) :** Liste des films pour les administrateurs.
8. **UtilisateurDetails (`UtilisateurDetails.vue`) :** Détails d'un utilisateur spécifique.
9. **MesLocations (`MesLocations.vue`) :** Locations actives de l'utilisateur.
10. **CommentairesFilms (`CommentairesFilms.vue`) :** Commentaires des utilisateurs sur un film.

## Routage

Routes principales :
- `/connexion`
- `/inscription`
- `/films`
- `/films/:id`
- `/panier/:id`
- `/admin/comptes`
- `/admin/films`

## État Global

Utilisation de Vuex pour gérer l'état global de l'application.

## Communication avec le Backend

Axios est utilisé pour les requêtes HTTP vers le backend.

## Technologies Utilisées

- Vue.js
- Vue Router
- Vuex
- Axios
- Vue Bootstrap
- JavaScript ES6+

---

Ce document donne un aperçu général du frontend de l'application. Pour plus de détails, référez-vous au code source.
