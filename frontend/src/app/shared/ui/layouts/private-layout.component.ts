import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen w-screen overflow-hidden bg-gray-100 font-sans antialiased text-[#1E1E1E]">
      <!-- SIDEBAR GAUCHE AFRIDEV ÉPURÉE (~256px / w-64) -->
      <aside class="w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between shrink-0 z-20 rounded-tr-3xl shadow-sm">
        <div class="flex flex-col">
          <!-- Logo & Brand Header -->
          <div class="h-20 flex items-center px-6 border-b border-gray-100">
            <a routerLink="/dashboard" class="flex items-center gap-2.5 outline-hidden">
              <img src="icon.svg" alt="Revget" class="w-8 h-8 rounded-lg shadow-xs" />
              <span class="text-2xl font-black tracking-tighter uppercase leading-none select-none">
                <span class="text-gray-900">REV</span><span class="text-orange-500">GET</span>
              </span>
            </a>
          </div>

          <!-- Navigation Links Ciblés Rev.get() : Tableau de bord, Mes QCM, Mes Cours, Statistiques -->
          <nav class="p-4 space-y-1.5 text-sm font-semibold">
            <!-- 1. Tableau de bord -->
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-orange-50/80 text-[#FF5A1F] font-bold shadow-xs border-r-4 border-[#FF5A1F]"
              class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>Tableau de bord</span>
            </a>

            <!-- 2. Mes QCM -->
            <a
              href="javascript:void(0)"
              class="flex items-center justify-between px-3.5 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
            >
              <div class="flex items-center gap-3.5">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <span>Mes QCM</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">0</span>
            </a>

            <!-- 3. Mes Cours -->
            <a
              href="javascript:void(0)"
              class="flex items-center justify-between px-3.5 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
            >
              <div class="flex items-center gap-3.5">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>Mes Cours</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5A1F]">PDF</span>
            </a>

            <!-- 4. Statistiques -->
            <a
              href="javascript:void(0)"
              class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span>Statistiques</span>
            </a>

            <!-- 5. Backoffice Admin (Visible UNIQUEMENT si ADMIN) -->
            @if (authService.isAdmin()) {
              <div class="pt-4 mt-4 border-t border-gray-100">
                <span class="px-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Administration</span>
                <a
                  routerLink="/admin"
                  routerLinkActive="bg-purple-50 text-purple-700 font-bold border-r-4 border-purple-600"
                  class="mt-1 flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-purple-600 hover:text-purple-900 hover:bg-purple-50/60 transition-all duration-150"
                >
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>Backoffice</span>
                </a>
              </div>
            }
          </nav>
        </div>

        <!-- Bas de Sidebar : Profil Utilisateur & Bouton Déconnexion -->
        <div class="p-4 border-t border-gray-100 bg-gray-50/60">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              @if (user()?.avatarUrl) {
                <img [src]="user()?.avatarUrl" [alt]="user()?.fullName" class="w-9 h-9 rounded-full ring-2 ring-[#FF5A1F]/20 shrink-0 object-cover" />
              } @else {
                <div class="w-9 h-9 rounded-full bg-orange-100 text-[#FF5A1F] flex items-center justify-center font-bold text-sm shrink-0">
                  {{ user()?.fullName?.charAt(0) || 'U' }}
                </div>
              }
              <div class="flex flex-col truncate">
                <span class="text-xs font-bold text-gray-900 truncate">{{ user()?.fullName || 'Étudiant' }}</span>
                <span class="text-[11px] text-gray-500 truncate">{{ user()?.email }}</span>
              </div>
            </div>

            <!-- Déconnexion -->
            <button
              (click)="authService.logout()"
              title="Déconnexion"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- ZONE PRINCIPALE (HEADER + CONTENT) -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- NAVBAR SUPÉRIEURE (AFRIDEV ÉPURÉE ~64px / h-16) -->
        <header class="h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0 z-10">
          <!-- Barre de recherche discrète -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Rechercher un QCM, cours ou sujet..."
                class="w-full pl-10 pr-4 py-2 bg-gray-50/70 hover:bg-gray-100/60 focus:bg-white text-xs sm:text-sm text-gray-800 rounded-xl border border-gray-200/80 focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/10 focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <!-- Actions de droite : Bouton Créer orange, Notifications, Niveau -->
          <div class="flex items-center gap-4 ml-4">
            <!-- Bouton Créer (Orange #FF5A1F) -->
            <button
              class="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5A1F] hover:bg-[#e04e19] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-[#FF5A1F]/20 active:scale-95 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Créer</span>
            </button>

            <!-- Notifications Cloche -->
            <button
              class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              title="Notifications"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5A1F] rounded-full ring-2 ring-white"></span>
            </button>

            <!-- Profil & Niveau -->
            <div class="flex items-center gap-3 pl-3 border-l border-gray-100">
              <div class="text-right hidden sm:block">
                <p class="text-xs font-bold text-gray-900 leading-tight">{{ user()?.fullName || 'Étudiant' }}</p>
                <p class="text-[10px] font-extrabold text-[#FF5A1F] tracking-wide">Niveau {{ user()?.currentLevel || 1 }}</p>
              </div>
              @if (user()?.avatarUrl) {
                <img [src]="user()?.avatarUrl" [alt]="user()?.fullName" class="w-8 h-8 rounded-full ring-2 ring-gray-100 object-cover" />
              } @else {
                <div class="w-8 h-8 rounded-full bg-orange-100 text-[#FF5A1F] flex items-center justify-center font-bold text-xs">
                  {{ user()?.fullName?.charAt(0) || 'U' }}
                </div>
              }
            </div>
          </div>
        </header>

        <!-- ZONE DE CONTENU PRINCIPALE AÉRÉE (Fond gris très clair bg-gray-50/50, p-8) -->
        <main class="flex-1 overflow-y-auto bg-gray-50/50 p-6 sm:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class PrivateLayoutComponent {
  readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser;
}
