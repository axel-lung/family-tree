# Application d’arbre généalogique

## Aperçu
L’application d’arbre généalogique est une plateforme web permettant de créer, visualiser et gérer des arbres généalogiques familiaux. Elle offre des fonctionnalités pour ajouter des personnes, des relations, gérer les permissions des utilisateurs, et partager des fiches de manière sécurisée via des liens temporaires. L’application est construite avec un frontend Angular, un backend Node.js/Express, une base de données MySQL, et Redis pour le cache. Elle utilise une architecture monorepo avec Nx et PrimeNG pour l’interface utilisateur.

### Fonctionnalités principales

- Visualisation de l’arbre : Affiche les relations familiales (parents, enfants, conjoints) dans une interface interactive.
- Gestion des personnes : Ajout, modification, et suppression (soft delete) de fiches de personnes.
- Gestion des relations : Création de liens familiaux (parent, enfant, conjoint).
- Permissions basées sur les rôles (RBAC) : Trois rôles (admin, family_member, guest) avec des permissions spécifiques (can_create, can_update, can_delete).
- Panneau d’administration : Gestion des utilisateurs et permissions (réservé aux admins).
- Partage sécurisé : Génération de liens temporaires (24h) pour partager des fiches sans données sensibles.
- Authentification sécurisée : Connexion/déconnexion avec JWT.
- Déploiement Docker : Conteneurisation du frontend, backend, MySQL, et Redis.


## Prérequis
- Node.js : Version 18.x
- Docker et Docker Compose : Pour exécuter l’application en conteneurs
- MySQL : Version 8.0
- Redis : Version alpine
- Git : Pour cloner le repository
- Compte Docker Hub : Pour tirer/pousser les images (optionnel)
- Serveur Linux : Pour le déploiement (avec SSH et accès root)

## Installation
### 1. Cloner le repository

```bash
git clone https://github.com/ton-utilisateur/ton-repo.git
cd ton-repo
```

### 2. Installer les dépendances

```bash
npm install

```

### 3. Configurer les variables d’environnement

Créez un fichier ```.env``` à la racine du projet avec les variables suivantes :

```env
JWT_SECRET=ton_secret_jwt_ici
DB_USER=family_tree_user
DB_HOST=ip_serveur_mysql
DB_PASSWORD=ton_mot_de_passe_mysql
DB_ROOT_PASSWORD=ton_mot_de_passe_root_mysql
DOCKERHUB_USERNAME=ton-utilisateur
FRONTEND_URL=http://localhost
```
Note : Remplacez les valeurs par celles adaptées à votre environnement. En production, utilisez l’URL de votre serveur (par exemple, ```https://family-tree.example.com```).


## Exécution locale avec Docker

1. Lancez les services (frontend, backend, MySQL, Redis) :

```docker-compose up --build```

2. Accédez à l’application :
- Frontend : http://localhost
- Backend : http://localhost:3333/api

Pour arrêter les conteneurs :

```docker-compose down```

## Structure du projet
```plain
ton-repo/
├── apps/
│   ├── api/                # Backend Node.js/Express
│   └── frontend/           # Frontend Angular
├── docs/                   # Documentation (admin-guide.md, member-guide.md)
├── .env                    # Variables d’environnement
├── docker-compose.yml      # Configuration Docker
└── README.md               # Ce fichier
```