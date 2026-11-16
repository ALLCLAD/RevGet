import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 text-sm py-3 px-4 sm:px-6 lg:px-8">
      <nav class="max-w-7xl w-full mx-auto flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/dashboard" class="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
          <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500 text-neutral-950 font-black text-base shadow-sm">
            R
          </span>
          <span>Rev<span class="text-orange-400">.get()</span></span>
        </a>

        <!-- Liens & Actions -->
        <div class="flex items-center gap-3">
          @if (authService.currentUser(); as user) {
            <!-- Bouton Backoffice si Admin -->
            @if (authService.isAdmin()) {
              <a
                routerLink="/admin"
                routerLinkActive="bg-orange-500/20 text-orange-400 border-orange-500/40"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 transition-all shadow-xs"
              >
                <span>⚙️</span>
                <span>Backoffice</span>
              </a>
            }

            <!-- Profil utilisateur / XP -->
            <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700/80 rounded-full text-xs text-neutral-300">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-medium">Niv. {{ user.currentLevel }}</span>
              <span class="text-neutral-500">|</span>
              <span class="text-orange-400 font-semibold">{{ user.xpTotal }} XP</span>
            </div>

            <!-- Avatar & Nom -->
            <div class="flex items-center gap-2">
              @if (user.avatarUrl) {
                <img
                  [src]="user.avatarUrl"
                  [alt]="user.fullName"
                  class="w-8 h-8 rounded-full border border-neutral-700 object-cover"
                />
              } @else {
                <div class="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center font-bold text-xs">
                  {{ user.fullName ? user.fullName[0].toUpperCase() : 'U' }}
                </div>
              }
              <span class="hidden md:inline-block text-xs font-medium text-neutral-200">
                {{ user.fullName }}
              </span>
            </div>

            <!-- Bouton Déconnexion -->
            <button
              type="button"
              (click)="authService.logout()"
              class="inline-flex items-center justify-center p-2 text-xs font-medium rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="Se déconnecter"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          } @else {
            <a
              routerLink="/login"
              class="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 text-neutral-950 hover:bg-orange-400 transition"
            >
              Connexion
            </a>
          }
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
}
