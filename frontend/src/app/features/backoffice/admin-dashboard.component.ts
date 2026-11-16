import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-2">
            <span>🛡️ Espace Réservé Administrateur</span>
          </div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Console de Gestion Backoffice</h1>
          <p class="text-sm text-gray-500 mt-1">
            Gérez les cours, surveillez la consommation de tokens d'IA et auditez les étudiants.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">Connecté en tant que :</span>
          <span class="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
            {{ user()?.email }}
          </span>
        </div>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Utilisateurs</p>
          <p class="text-2xl font-black text-gray-900 mt-2">1</p>
          <span class="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ +100% ce mois</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">QCM Générés IA</p>
          <p class="text-2xl font-black text-gray-900 mt-2">0</p>
          <span class="text-xs text-gray-400 mt-1 inline-block">Prêt pour Phase 3</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Tokens IA Consommés</p>
          <p class="text-2xl font-black text-gray-900 mt-2">0</p>
          <span class="text-xs text-gray-400 mt-1 inline-block">Gemini / Groq</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Santé API Spring</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <span class="text-base font-bold text-gray-900">En ligne (8081)</span>
          </div>
          <span class="text-xs text-emerald-600 font-medium mt-1 inline-block">NeonDB connecté</span>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser;
}
