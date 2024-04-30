# Backend de l'Application

Ce document fournit une vue d'ensemble de la partie backend de l'application, en mettant en évidence les contrôleurs, les services, les DTO et les configurations.

---

## Contrôleurs

1. **AdminController :** Gère les opérations liées à l'administration du système.
2. **CommentaireController :** Gère les opérations liées aux commentaires sur les films.
3. **FilmController :** Gère les opérations liées aux films.
4. **LocationController :** Gère les opérations liées aux locations de films.
5. **PanierController :** Gère les opérations liées au panier utilisateur.
6. **PhotoController :** Gère les opérations liées aux photos des films.
7. **UtilisateurController :** Gère les opérations liées aux utilisateurs.

## DTO (Data Transfer Objects)

1. **UtilisateurDTO :** DTO pour représenter les données des utilisateurs.
2. **PhotoDTO :** DTO pour représenter les données des photos des films.
3. **PhotoBodyDTO :** DTO pour représenter les données de corps des requêtes concernant les photos.
4. **PanierDTO :** DTO pour représenter les données du panier utilisateur.
5. **LocationDTO :** DTO pour représenter les données des locations de films.
6. **FilmDTO :** DTO pour représenter les données des films.
7. **FilmBodyDTO :** DTO pour représenter les données de corps des requêtes concernant les films.
8. **CommentaireDTO :** DTO pour représenter les données des commentaires.
9. **CommentaireBodyDTO :** DTO pour représenter les données de corps des requêtes concernant les commentaires.

## Mappers

1. **UtilisateurMapper :** Interface pour mapper les entités Utilisateur et UtilisateurDTO.
2. **UtilisateurMapperImpl :** Implémentation du mapper pour les utilisateurs.

## Modèles

1. **Commentaire :** Modèle pour représenter les commentaires sur les films.
2. **DetailsPanier :** Modèle pour représenter les détails du panier de l'utilisateur.
3. **DetailsPanierId :** Identifiant composite pour les détails du panier.
4. **Film :** Modèle pour représenter les films.
5. **FilmPanier :** Modèle pour représenter les films dans le panier.
6. **Location :** Modèle pour représenter les locations de films.
7. **Photo :** Modèle pour représenter les photos des films.
8. **Panier :** Modèle pour représenter le panier de l'utilisateur.
9. **Utilisateur :** Modèle pour représenter les utilisateurs.

## Repositories

1. **CommentaireRepository :** Interface pour accéder aux données des commentaires.
2. **DetailsPanierRepository :** Interface pour accéder aux données des détails du panier.
3. **FilmRepository :** Interface pour accéder aux données des films.
4. **LocationRepository :** Interface pour accéder aux données des locations de films.
5. **PanierRepository :** Interface pour accéder aux données du panier de l'utilisateur.
6. **PhotoRepository :** Interface pour accéder aux données des photos des films.
7. **UtilisateurRepository :** Interface pour accéder aux données des utilisateurs.

## Services

1. **CommentaireService :** Service pour gérer les opérations sur les commentaires.
2. **FilmService :** Service pour gérer les opérations sur les films.
3. **LocationService :** Service pour gérer les opérations sur les locations de films.
4. **PanierService :** Service pour gérer les opérations sur le panier de l'utilisateur.
5. **PhotoService :** Service pour gérer les opérations sur les photos des films.
6. **UtilisateurService :** Service pour gérer les opérations sur les utilisateurs.

## Configuration

1. **CorsConfig :** Configuration CORS pour permettre les requêtes depuis d'autres domaines.

## Classe Principale

- **LocafilmBackApplication :** Classe principale de l'application Spring Boot.

---

Ce document offre un aperçu général de la structure et des composants de la partie backend de l'application. Pour plus de détails, référez-vous au code source.
