# REVGET - Journal de Bord & État d'Avancement du Projet

**Dernière mise à jour :** 16 Novembre 2026  
**Environnement technique :** Java 21, Spring Boot 3.x / 4.x, Angular 21.x Standalone, NeonDB (PostgreSQL + pgvector), Google OAuth2 / OIDC.

---

## 1. Ce qui a été réalisé

### 1.1 Initialisation Globale & Architecture Monorepo
- **Contexte & Règles Fondatrices :** Création du document d'architecture et de règles de développement à la racine : `revget-context.md`.
- **Backend (Spring Boot / Maven / Java 21) :**
  - Génération du projet Spring Boot dans le répertoire `backend/` avec nom officiel `revget-api`.
  - Dépendances intégrées : `webmvc`, `data-jpa`, `postgresql`, `security-oauth2-resource-server`, `validation`, `spring-dotenv`.
  - Mise en place de l'arborescence *Feature-First* :
    - `core/config/`
    - `core/security/`
    - `core/exception/`
    - `feature/qcm/` (controller, dto, mapper, model, repository, service)
    - `feature/user/` (controller, dto, model, repository, service)
- **Frontend (Angular 21.x / SCSS) :**
  - Génération de l'application Angular Standalone dans le répertoire `frontend/` avec nom officiel `revget-ui`.
  - Architecture applicative créée :
    - `core/auth/`
    - `core/http/`
    - `core/state/`
    - `shared/ui/`
    - `features/qcm-player/`
    - `features/dashboard/`

---

### 1.2 Phase 1 Backend : Socle Utilisateur, Google SSO & RBAC
- **Audit JPA Automatique :**
  - Création de `BaseAuditableEntity` (`@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy`).
  - Implémentation de `SecurityAuditorAware` extrayant le profil de l'utilisateur authentifié depuis le JWT Google.
- **Sécurité Stateless & Resource Server :**
  - Configuration de `SecurityConfig` (CORS ouvert, CSRF désactivé, session stateless, validation des tokens Google).
  - Création de `CustomJwtAuthenticationConverter` : convertit les informations du JWT Google en utilisateur applicatif et mappe son rôle en autorité Spring Security (`ROLE_USER`, `ROLE_ADMIN`).
  - Endpoint de santé disponible : `/api/health`.
  - Gestion centralisée des exceptions via `GlobalExceptionHandler` (404, 403, 500).
- **Modèle & Domaine Utilisateur :**
  - Enum `Role` (`USER`, `ADMIN`).
  - Entité `User` : clé primaire `Long id` protégée et privée, exposition exclusive via `UUID publicId`, unicité du `googleId`, compteurs de gamification (`xpTotal`, `currentLevel`).
  - `UserRepository` (recherche par `googleId`, `email`, `publicId`).
  - `UserResponseDto` sous forme de `record` Java 21 (zéro fuite d'entité JPA ni d'ID technique).
  - `UserService` : provisionnement automatique lors de la première connexion Google, promotion automatique en `ADMIN` selon la liste d'emails configurée.
  - `UserController` : endpoint sécurisé `GET /api/users/me`.
- **Validation Qualité :**
  - Tests unitaires automatisés validés avec succès (`UserServiceTest`).

---

### 1.3 Configuration Environnement & Secrets
- **Intégration NeonDB :**
  - Connexion NeonDB PostgreSQL configurée en mode pooled.
- **Gestion des variables d'environnement (`.env`) :**
  - Ajout de `spring-dotenv` pour charger automatiquement `backend/.env` dans Spring Boot.
  - Fichiers `.env` et `.env.example` créés pour le backend et le frontend.
  - Sécurisation des fichiers `.gitignore` pour protéger les clés sensibles (Client Secret, tokens, mots de passe).

---

## 2. Prochaines Étapes Immédiates

### Étape Suivante Recommandée : Phase 2 - Authentification Frontend & Connexion Bout-en-Bout
1. **Intégration Google Sign-In côté Angular 21 (Frontend) :**
   - Mise en place du SDK Google Identity Services (`accounts.google.com/gsi/client`) ou d'une librairie Angular adaptée.
   - Création du `AuthService` Angular avec Signal pour le stockage de l'état de l'utilisateur connecté (`currentUser`).
   - Création d'un composant de Login épuré (utilisant Tailwind CSS et les ressources de `template_assets/`).
   - Création du `HttpInterceptor` Angular pour attacher automatiquement le token `Authorization: Bearer <token>` à chaque requête vers `/api/*`.
2. **Test Bout-en-Bout :**
   - Lancement de `ng serve` et du backend Spring Boot.
   - Connexion via Google SSO, création automatique du compte dans NeonDB, et appel à `GET /api/users/me`.

---

## 3. Feuille de Route Globale (Rappel)
- [x] **Phase 0 :** Initialisation et structure des projets.
- [x] **Phase 1 :** Socle Utilisateur Backend, Google SSO, RBAC et Base de Données.
- [ ] **Phase 2 :** Frontend Auth (Google Sign-In, Interceptor HTTP, Profil Utilisateur & Redirection).
- [ ] **Phase 3 :** Moteur IA & Parsing (Gemini Flash pour l'analyse documentaire & Groq Llama-3 pour la génération ultra-rapide).
- [ ] **Phase 4 :** Moteur QCM & Gamification (Mode Sprint, Combo streak, calcul XP/Niveau).
- [ ] **Phase 5 :** Déploiement & Pipeline CI/CD (Vercel pour le frontend, Render pour le backend).
