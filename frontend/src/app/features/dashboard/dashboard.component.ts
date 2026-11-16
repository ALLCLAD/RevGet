import { Component, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SlicePipe],
  template: `
    <div class="space-y-8 max-w-6xl mx-auto">
      <!-- 1. Encart d'accueil épuré & subtil (Pas de gros blocs de couleur agressive) -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100/60 text-[#FF5A1F] text-xs font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]"></span>
              Espace Révision
            </span>
            <span class="text-xs text-gray-400">•</span>
            <span class="text-xs text-gray-500 font-mono">
              ID: {{ user()?.publicId | slice:0:8 }}
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
            Bonjour, {{ user()?.fullName || 'Étudiant' }} ! 👋
          </h1>
          <p class="text-sm text-gray-500">
            Prêt pour une nouvelle session ? Choisissez une action ou importez un support de cours.
          </p>
        </div>

        <!-- Badges discrets Gamification / XP -->
        <div class="flex items-center gap-3">
          <div class="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-center min-w-[90px]">
            <p class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">XP Total</p>
            <p class="text-xl font-black text-gray-900 mt-0.5">{{ user()?.xpTotal || 0 }}</p>
          </div>
          <div class="px-4 py-3 bg-orange-50/60 rounded-2xl border border-orange-100 text-center min-w-[90px]">
            <p class="text-[10px] font-bold uppercase text-[#FF5A1F] tracking-wider">Niveau</p>
            <p class="text-xl font-black text-[#FF5A1F] mt-0.5">{{ user()?.currentLevel || 1 }}</p>
          </div>
        </div>
      </div>

      <!-- 2. Actions Rapides Minimalistes (3 cartes aérées, hover:shadow-md hover:-translate-y-1) -->
      <div>
        <h2 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
          Actions rapides
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Carte 1 : Mode Sprint QCM -->
          <div class="group bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 class="text-base font-bold text-gray-900 group-hover:text-[#FF5A1F] transition-colors">
                Mode Sprint QCM
              </h3>
              <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                10 questions chronométrées pour tester vos réflexes et ancrer vos connaissances rapidement.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span>Lancer le sprint</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <!-- Carte 2 : Importer un Cours (PDF) -->
          <div class="group bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                📄
              </div>
              <h3 class="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                Importer un Cours PDF
              </h3>
              <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                Téléversez vos supports pour que l'IA génère des fiches de synthèse et questionnaires ciblés.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Uploader un document</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <!-- Carte 3 : Examen Blanc -->
          <div class="group bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 class="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                Examen Blanc
              </h3>
              <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                Mise en conditions réelles avec notation officielle, coefficient et corrigé détaillé.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Configurer l'épreuve</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Empty State Moderne & Accueillant (Pas de faux contenu artificiel) -->
      <div class="bg-white rounded-3xl p-10 border border-gray-100 shadow-xs text-center space-y-4">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 text-2xl">
          📚
        </div>
        <div class="max-w-md mx-auto space-y-1.5">
          <h3 class="text-base font-bold text-gray-900">Aucune session en cours</h3>
          <p class="text-xs text-gray-500 leading-relaxed">
            Vous n'avez pas encore généré de QCM aujourd'hui. Commencez par importer un support de cours ou lancez un sprint rapide pour tester vos acquis.
          </p>
        </div>
        <div class="pt-2">
          <button class="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e19] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all">
            Créer ma première session →
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser;
}
