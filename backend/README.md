# Application Microservices Express + MongoDB (Entreprise)

## Prérequis
- Docker & Docker Compose
- Node.js (pour développement local)
- **MongoDB** (service de base de données)
- **MongoDB Compass** (GUI pour visualiser et manipuler les données)

## Installation de MongoDB & MongoDB Compass

### MongoDB
1. Rendez-vous sur https://www.mongodb.com/try/download/community
2. Téléchargez la version Community Server adaptée à votre OS (Windows, Mac, Linux).
3. Suivez l’assistant d’installation (conservez les options par défaut).
4. Démarrez le service MongoDB (il démarre automatiquement sur Windows après installation).

### MongoDB Compass
1. Rendez-vous sur https://www.mongodb.com/try/download/compass
2. Téléchargez et installez Compass.
3. Lancez Compass et connectez-vous à `mongodb://localhost:27017` (ou l’URL de votre instance).

## À propos de MongoDB & MongoDB Compass

### MongoDB
MongoDB est une base de données NoSQL orientée documents. Les données sont stockées sous forme de collections (équivalent des tables SQL), chaque collection contenant des documents (équivalent des lignes), au format JSON/BSON.

### MongoDB Compass
MongoDB Compass est une interface graphique officielle pour MongoDB. Elle permet de visualiser, éditer, requêter et analyser les données de vos collections facilement, sans ligne de commande.

---

## Schéma des collections principales

| Collection         | Description                        | Champs principaux                                  |
|-------------------|------------------------------------|----------------------------------------------------|
| users             | Utilisateurs                       | _id, username, email, password, role, createdAt    |
| demandes          | Demandes administratives           | _id, userId, type, status, createdAt, updatedAt    |
| files             | Fichiers stockés (GridFS)          | _id, filename, metadata, uploadDate, userId        |
| payments          | Paiements                          | _id, userId, amount, status, createdAt             |
| notifications     | Notifications envoyées             | _id, userId, type, message, read, createdAt        |
| audits            | Logs d’audit                       | _id, action, userId, date, details                 |

---

### Diagramme textuel de l’architecture MongoDB

```
+---------+      +----------+      +--------+
|  users  |<---->| demandes |<-----| files  |
+---------+      +----------+      +--------+
     |                |                |
     |                |                |
     v                v                v
+---------+      +----------+      +-------------+
|payments |      |notifications|   |   audits    |
+---------+      +----------+      +-------------+
```

- Un utilisateur (`users`) peut avoir plusieurs demandes (`demandes`), fichiers (`files`), paiements (`payments`) et notifications (`notifications`).
- Les audits enregistrent toutes les actions importantes.

---

## Exemple de document (users)
```json
{
  "_id": "ObjectId",
  "username": "alice",
  "email": "alice@email.com",
  "password": "<hash>",
  "role": "admin",
  "createdAt": "2025-06-15T12:00:00Z"
}
```

## Nouvelle architecture (2025)

L’application est désormais organisée en **microservices** indépendants :

- `user-service` : gestion des utilisateurs, authentification, rôles
- `admin-service` : gestion des demandes administratives
- `file-service` : gestion des fichiers (upload, GridFS)
- `payment-notification-service` : paiements et notifications

Chaque service possède son propre dossier, ses routes, modèles et contrôleurs. La communication entre services se fait via HTTP (REST) ou événements (à venir).

### Structure des dossiers
- `user-service/`
- `admin-service/`
- `file-service/`
- `payment-notification-service/`
- `src/` (legacy : ancienne API monolithique, en cours de migration)

## Lancement rapide (prod/dev)
```bash
docker-compose up --build
```
L’API sera disponible sur http://localhost:3000 (ou selon le port configuré)

## Lancement de l'application

### Environnement de développement (local)

1. Installe les dépendances :
   ```bash
   npm install
   ```
2. Lance tous les microservices avec les variables d'environnement de développement :
   ```bash
   npm run local
   ```
   > Cela utilise le fichier `.env` pour la configuration.

### Environnement de production (global)

1. Installe les dépendances :
   ```bash
   npm install
   ```
2. Lance toute l'architecture (services + MongoDB) avec les variables de production :
   ```bash
   npm run prod
   ```
   > Cela utilise le fichier `.env.prod` pour la configuration.

**Remarque :**
- Assure-toi d'avoir bien configuré les fichiers `.env` et `.env.prod` à la racine du projet.
- Pour la production, Docker Compose peut aussi être utilisé si besoin (`docker-compose up --build`).

## Sécurité & Qualité
- Authentification JWT, rôles, guards
- Validation stricte des entrées (express-validator)
- Limitation du poids des fichiers (5 Mo)
- Rate limiting (100 requêtes/15min/IP)
- Logging, audit, gestion d’erreur centralisée

## Endpoints principaux
Voir la documentation rapide fournie dans la conversation (ou demander ici pour un rappel/exemple précis).

## Variables d’environnement
- `MONGO_URI` (par défaut : mongodb://mongo:27017/app)
- `JWT_SECRET` (par défaut : supersecret)

## Packages principaux utilisés

### Dépendances (production)

| Package                  | Rôle principal                                                      |
|--------------------------|--------------------------------------------------------------------|
| express                  | Framework web principal (API REST)                                  |
| mongoose                 | ODM pour MongoDB (modélisation, requêtes)                          |
| mongodb                  | Driver natif MongoDB                                                |
| jsonwebtoken             | Authentification JWT                                                |
| bcryptjs                 | Hashage des mots de passe                                          |
| express-validator        | Validation des entrées utilisateur                                 |
| body-parser              | Parsing des requêtes HTTP (JSON, urlencoded)                       |
| multer                   | Upload de fichiers                                                  |
| multer-gridfs-storage    | Stockage de fichiers dans MongoDB via GridFS                       |
| axios                    | Requêtes HTTP côté serveur (communication inter-services)           |
| cors                     | Gestion du Cross-Origin Resource Sharing                            |

### Dépendances de développement

| Package        | Rôle principal                                 |
|----------------|-----------------------------------------------|
| concurrently   | Lancer plusieurs services en parallèle         |
| cross-env      | Gérer les variables d’environnement cross-OS   |
| dotenv         | Charger les variables d’environnement (.env)   |
| pm2            | Gestionnaire de processus Node.js              |
| eslint         | Linting (qualité du code)                      |
| vitest         | Tests unitaires/Intégration                    |

---

## À propos de Docker

L’application utilise **Docker** et **Docker Compose** pour faciliter le déploiement et l’isolation des services :
- Chaque microservice tourne dans son propre conteneur.
- MongoDB est également lancé dans un conteneur dédié.
- Les fichiers `Dockerfile` et `docker-compose.yml` décrivent la configuration des images, réseaux et volumes.

### Commandes utiles
- `docker-compose up --build` : lance tous les services et MongoDB
- `docker-compose down` : arrête et supprime les conteneurs
- `docker ps` : liste les conteneurs en cours

---

## Gestion des environnements et variables `.env`

L’application utilise des fichiers `.env` pour gérer les variables d’environnement sensibles et spécifiques à chaque contexte (développement, production, test).

### Exemple de fichier `.env`
```
# Adresse de la base MongoDB
MONGO_URI=mongodb://localhost:27017/app

# Clé secrète JWT
JWT_SECRET=supersecret

# Port d’écoute du service
PORT=3000

# Autres variables possibles
# EMAIL_API_KEY=...
# CLOUD_STORAGE_BUCKET=...
```

Chaque microservice peut avoir son propre fichier `.env` (ex : `user-service/.env`, `admin-service/.env`, etc.) pour isoler ses paramètres.

### Bonnes pratiques
- **Ne jamais** versionner les fichiers `.env` (ils sont dans `.gitignore`).
- Utiliser la librairie `dotenv` pour charger automatiquement les variables dans `process.env`.
- Documenter toutes les variables attendues dans le README.

### Utilisation dans le code
```js
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
```

---
Pour toute question ou évolution, demande à GitHub Copilot !
