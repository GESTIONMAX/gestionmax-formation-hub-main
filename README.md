# GestionMax Formation Hub

## Présentation du projet

GestionMax Formation Hub est une plateforme complète de gestion de formations professionnelles avec catalogue de formations WordPress et partenariats externes, développée avec Next.js. La plateforme permet aux utilisateurs de consulter le catalogue des formations disponibles, de planifier des rendez-vous, et aux administrateurs de gérer l'ensemble du processus de formation.

## Architecture technique

### Migration vers Next.js

Ce projet a été migré depuis Vite vers Next.js pour bénéficier des avantages suivants :
- Rendu hybride (Server-Side Rendering et Client-Side Rendering)
- Routing basé sur le système de fichiers
- Optimisation des images et du chargement
- API Routes intégrées
- Meilleure SEO

### Structure des dossiers

```
app/
├── components/         # Composants réutilisables
│   ├── catalogue/      # Composants liés au catalogue de formations
│   ├── providers/      # Fournisseurs de contexte React
│   ├── rendez-vous/    # Composants de gestion des rendez-vous
│   └── ui/             # Composants UI génériques
├── hooks/              # Hooks React personnalisés
├── services/           # Services d'API et utilitaires
├── (routes)/           # Pages et layouts (structure Next.js app router)
└── globals.css         # Styles globaux
```

## Installation et exécution

Pour installer et exécuter le projet localement :

```sh
# Cloner le dépôt Git
git clone <URL_DEPOT_GIT>

# Naviguer dans le répertoire du projet
cd gestionmax-formation-hub

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le serveur de développement sera accessible à `http://localhost:3000` (ou un autre port si 3000 est déjà utilisé).

## Conventions de codage

### Séparation Client/Serveur

Dans Next.js, il est crucial de respecter la séparation entre composants serveur et client :

- Par défaut, tous les composants dans le dossier `app/` sont des **composants serveur**
- Pour les composants qui nécessitent des API navigateur (comme `localStorage`, `window`, etc.), ajoutez la directive `"use client"` en haut du fichier
- Les hooks et services utilisant des API client doivent toujours inclure la directive `"use client"`

### Standards de documentation

Nous utilisons les commentaires JSDoc pour documenter les fonctions et composants :

```typescript
/**
 * @description Description courte de la fonction/composant
 * @note Informations supplémentaires importantes (ex: composant client/serveur)
 * 
 * @param {Type} paramName - Description du paramètre
 * @returns {Type} Description de la valeur retournée
 * 
 * @example
 * // Exemple d'utilisation
 * const result = maFonction(param);
 */
```

## Variables d'environnement

L'application utilise Prisma avec une base de données PostgreSQL. Les variables d'environnement suivantes doivent être disponibles dans un fichier `.env` à la racine du projet :

```bash
# Base de données PostgreSQL avec Prisma
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"

# Serveur d'API (dévelopment local)
API_URL="http://localhost:5000"

# Configuration JWT pour l'authentification
JWT_SECRET="votre-secret-jwt"

# Configuration Next.js
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## Commandes disponibles

Le projet inclut plusieurs commandes npm pour le développement et le déploiement :

```bash
# Démarrer le serveur de développement Next.js
npm run dev

# Construire l'application pour la production
npm run build

# Démarrer l'application construite en local
npm run start

# Vérifier la qualité du code avec ESLint
npm run lint

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations de base de données
npx prisma migrate dev

# Ouvrir Prisma Studio pour gérer la base de données
npx prisma studio
```

## Documentation des principaux hooks et services

Le projet utilise plusieurs hooks et services personnalisés pour centraliser la logique métier. Voici les principaux :

### `useAuth`

Hook de gestion de l'authentification.

```typescript
/**
 * @description Hook d'authentification gérant login, inscription et déconnexion
 * @note Composant client - Doit être utilisé avec AuthClientProvider
 * 
 * @returns {Object} Fonctions et états d'authentification
 * @returns {User|null} user - Utilisateur connecté ou null
 * @returns {Function} login - Connexion avec email/password
 * @returns {Function} register - Inscription
 * @returns {Function} logout - Déconnexion
 */
```

### `useProgrammesFormation`

Hook de gestion des programmes de formation (CRUD).

```typescript
/**
 * @description Gestion des programmes de formation (CRUD)
 * @note Composant client - Utilise les API browser
 * 
 * @returns {Object} Fonctions et états pour gérer les programmes
 * @returns {ProgrammeFormation[]} programmes - Liste des programmes
 * @returns {Function} createProgramme - Création d'un programme
 * @returns {Function} updateProgramme - Mise à jour
 * @returns {Function} deleteProgramme - Suppression
 */
```

### `api` (Service API)

Service centralisé pour les appels API.

```typescript
/**
 * @description Service axios pour les appels API
 * @note Composant client - Utilise localStorage
 * 
 * @example
 * // Récupérer des données
 * const response = await api.get('/endpoint');
 * 
 * // Envoyer des données
 * const response = await api.post('/endpoint', data);
 */
```

### Local development database setup

Make sure you have PostgreSQL installed and running locally. Then, set up your database and run the Prisma migrations:

```bash
# Apply the database migrations
npx prisma migrate dev

# Generate the Prisma client
npx prisma generate

# (Optional) Open Prisma Studio to manage your database
npx prisma studio
```

Prisma Studio provides a visual interface to view and edit your database at `http://localhost:5555`.

## Configuration de la base de données

Assurez-vous d'avoir PostgreSQL installé et exécuté localement. Ensuite, configurez votre base de données :

```bash
# Appliquer les migrations Prisma
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface visuelle pour gérer la BDD)
npx prisma studio
```

Prisma Studio fournit une interface visuelle pour consulter et modifier votre base de données à l'adresse `http://localhost:5555`.

## Technologies utilisées

Ce projet est construit avec :

- **Next.js** - Framework React avec rendu côté serveur et côté client
- **TypeScript** - Pour la sécurité des types
- **Tailwind CSS** - Pour le styling
- **Shadcn UI** - Composants UI accessibles et personnalisables
- **Prisma** - ORM pour la gestion de la base de données
- **React Query** - Pour la gestion des états et du cache des données
- **Framer Motion** - Pour les animations
- **Axios** - Pour les requêtes HTTP

## Plan de documentation du projet

Pour améliorer la visibilité et la maintenabilité du projet, nous suivrons le plan de documentation suivant :

1. **Documentation par module**
   - Chaque dossier principal contiendra un fichier `README.md` expliquant son rôle
   - Documentation des interfaces principales dans des fichiers `.d.ts`

2. **Documentation des fonctions et composants**
   - Tous les hooks, services et composants seront documentés avec JSDoc
   - Exemples d'utilisation fournis pour les API principales

3. **Documentation utilisateur**
   - Manuel d'administration pour la gestion des formations
   - Guide utilisateur pour les fonctionnalités principales

## Déploiement

Pour déployer ce projet :

1. Générer la build de production :
   ```bash
   npm run build
   ```

2. Transférer les fichiers vers votre serveur ou utiliser un service de déploiement comme Vercel ou Netlify qui prend en charge Next.js nativement.
