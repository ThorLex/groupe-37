# Application Microservices Express + MongoDB (Entreprise)

## Prérequis
- Docker & Docker Compose
- Node.js (pour développement local)

## Lancement rapide (prod/dev)
```bash
docker-compose up --build
```
L’API sera disponible sur http://localhost:3000

## Structure des dossiers
- `src/user` : gestion utilisateurs (auth, rôles)
- `src/demande` : gestion des demandes
- `src/file` : gestion des fichiers (GridFS)
- `src/payment` : paiements (mock ou réel)
- `src/notification` : notifications (mock ou réel)
- `src/audit` : logs d’audit
- `src/common` : middlewares, guards, config

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

## Pour aller plus loin
- Brancher un vrai service email/SMS/paiement
- Ajouter des tests automatisés (Jest/Mocha)
- Déployer sur un cloud sécurisé

---
Pour toute question ou évolution, demande à GitHub Copilot !
