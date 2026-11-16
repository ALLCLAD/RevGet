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
