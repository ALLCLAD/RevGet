# 🎓 REVGET (`Rev.get()`)

> **Plateforme de Révision Intelligente par IA générative & Gamification**  
> Transformez vos cours denses (PDF, Word, Markdown) en sessions d'entraînement interactives, stimulantes et ultra-personnalisées.

---

## 🌟 Présentation du Projet

**REVGET** est né d'un constat simple : la révision passive (relire des pages de cours pendant des heures) est inefficace et démotivante.

REVGET est un copilote d'apprentissage intelligent conçu pour tous les étudiants (informatique, médecine, droit, commerce, sciences, etc.). La plateforme combine :
1. **L'IA Multimodale & le RAG (Retrieval-Augmented Generation)** : vos documents de cours sont analysés et indexés en quelques secondes pour générer des QCM pertinents et contextualisés.
2. **La Gamification & le Micro-Learning** : mécanique d'XP, niveaux, badges, modes sprint minutés et jauge de combo pour rendre l'étude addictive et régulière.
3. **Une Expérience Frictionless** : zéro formulaire d'inscription fastidieux, connexion instantanée en 1 clic via Google SSO.

---

## 🏗️ Architecture Globale & Stack Technique

Le projet adopte une architecture **Monorepo** moderne, découplée et conforme aux standards industriels :

```text
Revget/
├── backend/                 # API REST Spring Boot 3.x / Java 21
│   ├── src/main/java/com/revget/api/
│   │   ├── core/            # Config transversale, Sécurité OAuth2, Audit, Exceptions
│   │   └── feature/         # Découpage modulaire Feature-First (user, qcm, ...)
│   └── pom.xml
│
├── frontend/                # Application Client Angular 21.x Standalone
│   ├── src/app/
│   │   ├── core/            # Auth SSO, Interceptors HTTP, Gestion d'état
│   │   ├── shared/          # Composants UI réutilisables (Spartan.ng / Tailwind)
│   │   └── features/        # Pages & parcours fonctionnels (dashboard, qcm-player)
│   └── package.json
│
├── revget-context.md        # Document de gouvernance et règles d'architecture
└── PROJECT_STATUS.md        # Journal d'avancement et roadmap
```

### 🛠️ Technologies Clés

| Composant | Technologie | Description / Rôle |
| :--- | :--- | :--- |
| **Backend** | **Java 21 & Spring Boot 3.x / 4.x** | API REST haute performance, records Java 21, architecture Feature-First. |
| **Frontend** | **Angular 21.x** | Architecture Standalone par défaut, Signals, RxJS, Tailwind CSS & Spartan.ng. |
| **Base de Données** | **NeonDB (PostgreSQL 18 Serverless)** | Base cloud avec extension `pgvector` pour la recherche sémantique vectorielle. |
| **Moteur IA Rapide** | **Groq API (Llama-3)** | Génération quasi-instantanée des questions / explications pour un feedback en temps réel. |
| **Moteur IA Parsing**| **Gemini 1.5 Flash API** | Traitement multimodal lourd des supports de cours volumineux (PDF, schémas, tableaux). |
| **Authentification**| **Google OAuth2 / OIDC** | Authentification stateless vérifiée côté Resource Server avec RBAC (`ROLE_USER`, `ROLE_ADMIN`). |
| **Déploiement** | **Vercel & Render** | Frontend hébergé sur Vercel, Backend déployé sur Render (plan gratuit avec endpoint keep-alive `/api/health`). |

---

## 🔒 Principes Directeurs d'Ingénierie (Lois du Projet)

1. **Sécurité & Masquage des ID techniques** :
   - Les clés primaires séquentielles (`Long id`) restent strictement internes à la base de données.
   - Tous les échanges externes (URLs, DTOs, API) utilisent exclusivement des identifiants publics opaques (`UUID publicId`).
2. **Immuabilité & Contrats de Données** :
   - Tous les DTOs backend sont écrits sous forme de `record` Java 21.
   - Les entités JPA ne sont jamais directement exposées aux contrôleurs REST.
3. **Auditabilité Continue** :
   - Toute entité hérite de `BaseAuditableEntity` pour enregistrer automatiquement la date et l'auteur de chaque création ou modification.
4. **Zéro mot de passe stocké** :
   - Authentification déléguée à 100 % à Google OIDC, réduisant la surface d'attaque et garantissant une ergonomie maximale.

---

## 🚀 Démarrage Rapide en Local

### Prérequis
- **Java 21** (JDK 21+)
- **Node.js** (v20+ ou v24+) & **npm**
- Un compte **Google Cloud Console** (pour le Client ID OAuth2)
- Une instance **NeonDB** (ou PostgreSQL local)

---

### 1. Configuration du Backend

1. Rendez-vous dans le dossier `backend` :
   ```bash
   cd backend
   ```
2. Créez un fichier `.env` basé sur `.env.example` :
   ```env
   SERVER_PORT=8080
   SPRING_DATASOURCE_URL=jdbc:postgresql://<neon-host>/neondb?sslmode=require
   SPRING_DATASOURCE_USERNAME=<votre_user>
   SPRING_DATASOURCE_PASSWORD=<votre_password>
   GOOGLE_CLIENT_ID=<votre_google_client_id>
   ADMIN_EMAILS=votre-email@gmail.com
   ```
3. Lancez les tests unitaires :
   ```bash
   ./mvnw test
   ```
4. Démarrez l'API Spring Boot :
   ```bash
   ./mvnw spring-boot:run
   ```
   L'API est accessible sur `http://localhost:8080`.  
   Endpoint de vérification : `http://localhost:8080/api/health`

---

### 2. Configuration du Frontend

1. Rendez-vous dans le dossier `frontend` :
   ```bash
   cd frontend
   ```
2. Créez un fichier `.env` basé sur `.env.example` :
   ```env
   API_BASE_URL=http://localhost:8080/api
   GOOGLE_CLIENT_ID=<votre_google_client_id>
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Démarrez le serveur de développement :
   ```bash
   npm start
   ```
   L'application est accessible sur `http://localhost:4200`.

---

## 🗺️ Roadmap du Projet

- [x] **Phase 0 : Cadrage & Architecture Monorepo** (Initialisation Spring Boot 3 / Angular 21 Standalone).
- [x] **Phase 1 : Socle Utilisateur, Google SSO & RBAC** (Audit JPA, User Entity, JwtConverter, NeonDB connecté).
- [ ] **Phase 2 : Authentification Frontend & Dashboard** (Google Sign-In Angular, Signals Auth, Interceptor).
- [ ] **Phase 3 : Moteur IA RAG & Ingestion Documentaire** (Upload cours, chunking, Gemini Flash & Groq Llama-3, pgvector).
- [ ] **Phase 4 : Moteur QCM & Gamification** (Session de révision, mode Sprint, calcul d'XP, combos et niveaux).
- [ ] **Phase 5 : Déploiement Cloud & CI/CD** (Pipelines GitHub Actions, Vercel & Render).

---

## 👥 Auteur & Licence

Développé par **charo** dans le cadre du projet **REVGET**.  
Tous droits réservés.
