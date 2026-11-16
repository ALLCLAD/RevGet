# CONTEXTE PROJET : REVGET (Rev.get())
**Type :** Plateforme de Révision Intelligente par IA (RAG & Parsing)
**Cible :** Étudiants de toutes filières (Informatique, Droit, Médecine, etc.)
**Environnement :** Java 21, Spring Boot 3.x, Angular 21.x.

## 1. Piliers d'Architecture Locaux (Backend)
- **Feature-First :** Découpage strict par domaine métier (feature/nom_feature/).
- **Authentification SSO :** Connexion 'Frictionless' via Google SSO (OAuth2/OIDC). Zéro gestion de mots de passe locaux.
- **Sécurité & Exposition :** L'ID technique (Long) reste privé. Exposition EXCLUSIVE via un champ `UUID publicId`.
- **Contrat de données :** Utilisation stricte des `record` Java pour les DTOs.
- **Auditabilité :** Entités JPA avec Audit automatique (@CreatedDate, @CreatedBy, etc.).

## 2. UX, Gamification & Design (Frontend)
- **Design System :** Utilisation de Spartan.ng, Tailwind CSS, et composants Standalone Angular 21 (Control Flow @if/@for).
- **Ressources UI :** Pour toute création de composant visuel, consulte OBLIGATOIREMENT le dossier `template_assets/` à la racine pour t'inspirer du design et récupérer le code HTML/CSS de base.
- **Réactivité :** RxJS pour les flux asynchrones complexes (Timer Mode Sprint) et Angular Signals pour l'état local synchrone (Score, XP).
- **Gamification :** XP, Niveaux, et Jauge de Combo (Streak).

## 3. Moteur IA & Base de Données
- **Double Pipeline IA :** 
  - Pipeline A (RAG/Génération Rapide) : `Groq API` (Llama-3).
  - Pipeline B (Parsing lourd de PDF/Word) : `Gemini 1.5 Flash API`.
- **Base de Données :** `NeonDB` (PostgreSQL Serverless) avec l'extension `pgvector` pour le stockage des embeddings RAG.

## 4. CI/CD & Déploiement
- **Frontend :** Vercel.
- **Backend :** Render (Plan Gratuit) avec endpoint `/api/health` et RAM limitée (`-Xmx256m`).

## 5. Charte Graphique & Palette Officielle (Inspiration ScrewFast)
- **Fond Global (Light Mode) :** `bg-neutral-200` (Gris minéral chaud doux `#e5e5e5`, jamais de blanc pur `#fff`).
- **Fond Global (Dark Mode) :** `dark:bg-neutral-800` (Charbon minéral chaud `#262626`, jamais de noir absolu `#000`).
- **Capsule Navbar (Light) :** `border border-yellow-100/40 bg-yellow-50/60 backdrop-blur-md rounded-[36px]` (capsule ambrée translucide).
- **Capsule Navbar (Dark) :** `dark:border-neutral-700/40 dark:bg-neutral-800/80 dark:backdrop-blur-md`.
- **Showcase Container :** `rounded-2xl bg-neutral-100 dark:bg-white/[.075]`.
- **Footer :** `bg-neutral-300 dark:bg-neutral-900`.
- **Typographie Titres :** `text-neutral-800 dark:text-neutral-200 font-extrabold`.
- **Typographie Textes :** `text-neutral-700 dark:text-neutral-300` / `text-neutral-600 dark:text-neutral-400`.
- **Bordures & Séparateurs :** `border-neutral-300 dark:border-neutral-700` et `divide-neutral-300 dark:divide-neutral-700`.
- **Dominance des tons sombres :** Les teintes sombres dominent (`neutral-900` / `neutral-800`). L'orange est modéré et strictement réservé aux accents fins (logo, survols, cube filaire).
- **Boutons Primaires (Teinte Thème Sombre) :** Boutons sombres élégants calibrés sur la couleur du thème sombre `bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 border border-neutral-700 dark:border-neutral-600 font-semibold shadow-xs` (jamais de noir pur `#000` ni `#171717`).
- **Format Ergonomique des Boutons Google :** Hauteur fine et professionnelle `h-11 px-5` (au lieu de boutons surdimensionnés).
- **Menu Déroulant Google (Design Minimaliste Épuré) :** Bloc épuré `absolute right-0 mt-2 w-auto bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50` contenant exclusivement `<div id="google-btn-dropdown-container"></div>` avec bouton officiel Google `{ theme: 'outline', size: 'large', type: 'standard', text: 'continue_with', width: 240 }`. Zéro fioriture, zéro texte superflu, One-Tap désactivé.
- **Déclenchement Google :** Chaque bouton "Continuer avec Google" sur la page ouvre directement le menu déroulant de la navbar sans fermeture intempestive (grâce à `data-auth-trigger` et `stopPropagation`).
- **Navigation & Smooth Scrolling :** Tous les liens de la navbar (Desktop et Mobile) ainsi que du footer renvoient directement vers les sections clés (`#top`, `#features`, `#showcase`, `#faq`) via une méthode dédiée `scrollTo(sectionId, event)` qui applique un défilement fluide (`behavior: 'smooth'`) et compense la hauteur de la navbar sticky (offset de 96px). Le lien actif est mis en surbrillance orange dynamiquement au défilement via `@HostListener('window:scroll')`.
- **Copywriting :** Proscrire les mentions répétitives racoleuses ("100% gratuit", "sans mot de passe"). Focus sur la pédagogie, l'efficacité de la restitution active et les résultats aux examens.

## 6. Stratégie Sécurité, Anti-Cache & Google SSO
- **Balises Meta Anti-Cache (index.html) :**
  - `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">`
  - `<meta http-equiv="Pragma" content="no-cache">`
  - `<meta http-equiv="Expires" content="0">`
- **Nettoyage de Session (AuthService.clearLocalSession) :**
  - Réinitialisation des Signals (`currentUser.set(null)`, `idToken.set(null)`).
  - Nettoyage total : `localStorage.clear()` et `sessionStorage.clear()`.
  - Expiration forcée de l'ensemble des cookies du `document.cookie` (root path et hostname).
- **Intercepteur HTTP Anti-Cache (no-cache.interceptor.ts) :**
  - Fonctionnel (`HttpInterceptorFn`) attaché à toutes les requêtes HTTP sortantes avec headers `Cache-Control`, `Pragma`, `Expires`.
  - Déclaré dans `app.config.ts` au sein de `withInterceptors([noCacheInterceptor, authInterceptor])`.
- **Flux Google SSO Sans One Tap (Anti-FedCM) :**
  - Aucun appel automatique à `google.accounts.id.prompt()` au chargement pour éviter les conflits FedCM et les cool-downs navigateur.
  - Démarche OAuth 2.0 standard : clic utilisateur redirigeant vers la page Google ou déclenchant le bouton officiel, avec capture du token JWT (`id_token`) dans `ngOnInit` via URL hash.

## 7. Bilan des Réalisations Validées (Landing Page & Google Auth)
- **Hero Section :** Intégration de l'image réelle `hero.jpg`, titre fort sur la restitution active, bouton d'action sombre ergonomique ouvrant le menu déroulant Google.
- **Section Fonctionnalités (`#features`) :** 4 blocs produits concrets (Génération IA ultra-rapide, Mode sprint chronométré, Suivi de progression & XP, Rétroaction pédagogique immédiate).
- **Section Méthode (`#showcase`) :** Intégration de l'image de travail réelle `showcase.jpg`, bloc explicatif sur la mémorisation active par QCM, cube filaire repositionné pour une lisibilité optimale.
- **Section FAQ (`#faq`) :** 5 questions/réponses pertinentes sur le RAG, les formats de documents (PDF, Word), la confidentialité des cours et le ciblage par chapitres.
- **Menu Déroulant Connexion :** Format minimaliste épuré (`bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50`) hébergeant exclusivement le bouton officiel Google `renderButton` en mode outline 240px.
- **Navigation & Défilement :** Smooth scroll avec offset 96px sur Accueil, Fonctionnalités, Méthode, FAQ, surbrillance dynamique du lien actif, et menu mobile responsive.

## 8. Statut Post-Connexion (À Traiter dans la Prochaine Phase)
- **Espaces Intérieurs (Non Validés / À Construire) :**
  - Dashboard Étudiant : upload de documents, sélection des cours, lancement des quiz, affichage des statistiques XP et streak.
  - Mode Sprint : chronomètre interactif, validation des réponses, restitution active.
  - Backoffice Admin : gestion des utilisateurs, suivi des quotas d'API et modération.
- *Note :* Seuls la Landing Page, le design system global, et le mécanisme d'authentification Google SSO (frontend et validation backend) sont finalisés et opérationnels à ce stade. Tout le flux post-connexion sera abordé lors des prochains développements.
