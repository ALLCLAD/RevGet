import { Component, inject, OnInit, AfterViewInit, HostListener, effect, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { BrandLogoComponent } from '../brand-logo.component';
import { environment } from '../../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, BrandLogoComponent],
  template: `
    <!-- CONTENEUR RACINE EXACT DU TEMPLATE SCREWFAST (MainLayout.astro) :
         bg-neutral-200 en clair, dark:bg-neutral-800 en sombre
    -->
    <div
      id="top"
      class="min-h-screen w-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex flex-col font-sans antialiased selection:bg-yellow-400 selection:text-neutral-700 transition-colors duration-300"
    >
      <!-- CONTENEUR LARGE (max-w-[85rem], px-4 sm:px-6 lg:px-8) -->
      <div class="mx-auto w-full max-w-[85rem] grow px-4 sm:px-6 lg:px-8 flex flex-col">
        
        <!-- HEADER EXACT DU TEMPLATE SCREWFAST (Navbar.astro) -->
        <header class="sticky inset-x-0 top-4 z-40 flex w-full flex-wrap text-sm md:flex-nowrap md:justify-start">
          <nav
            class="relative mx-2 w-full rounded-[36px] border border-yellow-100/40 bg-yellow-50/60 px-4 py-3 backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto dark:border-neutral-700/40 dark:bg-neutral-800/80 dark:backdrop-blur-md transition-colors duration-300 shadow-xs"
            aria-label="Global"
          >
            <!-- SECTION GAUCHE : LOGO + TOGGLE BURGER MOBILE -->
            <div class="flex items-center justify-between w-full md:w-auto">
              <a href="#top" (click)="scrollTo('top', $event)" class="flex items-center outline-hidden group py-1" aria-label="Accueil REVGET">
                <app-brand-logo className="group-hover:opacity-90 transition-opacity" />
              </a>

              <!-- BOUTON MENU MOBILE (< md) -->
              <button
                (click)="toggleMobileMenu()"
                type="button"
                class="flex md:hidden h-8 w-8 items-center justify-center rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition duration-200 cursor-pointer"
                aria-label="Ouvrir le menu de navigation"
              >
                @if (isMobileMenuOpen()) {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                }
              </button>
            </div>

            <!-- LIENS DE NAVIGATION DESKTOP DU TEMPLATE (NavLink.astro) -->
            <div class="hidden md:flex items-center gap-x-1 lg:gap-x-2">
              <a
                href="#top"
                (click)="scrollTo('top', $event)"
                [class.text-orange-500]="activeSection() === 'top'"
                [class.dark:text-orange-400]="activeSection() === 'top'"
                [class.text-neutral-600]="activeSection() !== 'top'"
                [class.dark:text-neutral-400]="activeSection() !== 'top'"
                class="rounded-lg px-3 py-3 text-sm font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-200 cursor-pointer"
              >
                Accueil
              </a>
              <a
                href="#features"
                (click)="scrollTo('features', $event)"
                [class.text-orange-500]="activeSection() === 'features'"
                [class.dark:text-orange-400]="activeSection() === 'features'"
                [class.text-neutral-600]="activeSection() !== 'features'"
                [class.dark:text-neutral-400]="activeSection() !== 'features'"
                class="rounded-lg px-3 py-3 text-sm font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-200 cursor-pointer"
              >
                Fonctionnalités
              </a>
              <a
                href="#showcase"
                (click)="scrollTo('showcase', $event)"
                [class.text-orange-500]="activeSection() === 'showcase'"
                [class.dark:text-orange-400]="activeSection() === 'showcase'"
                [class.text-neutral-600]="activeSection() !== 'showcase'"
                [class.dark:text-neutral-400]="activeSection() !== 'showcase'"
                class="rounded-lg px-3 py-3 text-sm font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-200 cursor-pointer"
              >
                Méthode
              </a>
              <a
                href="#faq"
                (click)="scrollTo('faq', $event)"
                [class.text-orange-500]="activeSection() === 'faq'"
                [class.dark:text-orange-400]="activeSection() === 'faq'"
                [class.text-neutral-600]="activeSection() !== 'faq'"
                [class.dark:text-neutral-400]="activeSection() !== 'faq'"
                class="rounded-lg px-3 py-3 text-sm font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-200 cursor-pointer"
              >
                FAQ
              </a>
            </div>

            <!-- ACTIONS DROITE (Bouton Connexion avec menu défilant type notification + Thème) -->
            <div class="hidden md:flex items-center gap-x-2 md:gap-x-3">
              @if (authService.isAuthenticated()) {
                <a
                  routerLink="/dashboard"
                  class="flex items-center gap-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-orange-500 md:my-5 md:border-s md:border-neutral-300 dark:md:border-neutral-700 md:ps-6 transition duration-200"
                >
                  <svg class="h-4 w-4 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Mon Espace</span>
                </a>
              } @else {
                <!-- Conteneur relatif pour le popover/déroulant de connexion -->
                <div class="relative auth-dropdown-container">
                  <button
                    (click)="uiState.toggleAuthDropdown()"
                    data-auth-trigger="true"
                    type="button"
                    class="flex items-center gap-x-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white md:my-5 md:border-s md:border-neutral-300 dark:md:border-neutral-700 md:ps-6 transition duration-200 cursor-pointer outline-hidden"
                    aria-label="Ouvrir le menu de connexion"
                  >
                    <svg
                      class="h-4 w-4 shrink-0"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Connexion</span>
                    <!-- Petit chevron indicateur de défilement -->
                    <svg
                      class="h-3 w-3 shrink-0 transition-transform duration-200"
                      [class.rotate-180]="uiState.isAuthDropdownOpen()"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  <!-- Menu Défilant Minimaliste (Bouton Google statique unique) -->
                  @if (uiState.isAuthDropdownOpen()) {
                    <div class="absolute right-0 mt-2 w-auto bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50">
                      <div id="google-btn-dropdown-container"></div>
                    </div>
                  }
                </div>
              }

              <!-- ThemeIcon.astro exact de ScrewFast -->
              <button
                (click)="uiState.toggleDarkMode()"
                type="button"
                [attr.aria-label]="uiState.isDarkMode() ? 'Activer le mode clair' : 'Activer le mode sombre'"
                class="flex h-8 w-8 items-center justify-center rounded-full font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-orange-400 dark:hover:text-orange-300 transition duration-300 cursor-pointer outline-hidden"
              >
                @if (uiState.isDarkMode()) {
                  <!-- Icône Soleil quand dark est actif -->
                  <svg class="h-4.5 w-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="m17.66 17.66 1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="m6.34 17.66-1.41 1.41"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                  </svg>
                } @else {
                  <!-- Icône Lune quand light est actif -->
                  <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                }
              </button>
            </div>

            <!-- MENU COLLAPSE POUR MOBILE (< md) -->
            @if (isMobileMenuOpen()) {
              <div class="md:hidden w-full pt-4 pb-2 border-t border-yellow-200/40 dark:border-neutral-700/60 mt-3 flex flex-col gap-1">
                <a
                  href="#top"
                  (click)="scrollTo('top', $event)"
                  [class.text-orange-500]="activeSection() === 'top'"
                  class="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700/50 cursor-pointer"
                >
                  Accueil
                </a>
                <a
                  href="#features"
                  (click)="scrollTo('features', $event)"
                  [class.text-orange-500]="activeSection() === 'features'"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 cursor-pointer"
                >
                  Fonctionnalités
                </a>
                <a
                  href="#showcase"
                  (click)="scrollTo('showcase', $event)"
                  [class.text-orange-500]="activeSection() === 'showcase'"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 cursor-pointer"
                >
                  Méthode
                </a>
                <a
                  href="#faq"
                  (click)="scrollTo('faq', $event)"
                  [class.text-orange-500]="activeSection() === 'faq'"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 cursor-pointer"
                >
                  FAQ
                </a>
                <div class="pt-2 mt-1 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between px-2">
                  <button
                    (click)="uiState.toggleAuthDropdown(); isMobileMenuOpen.set(false)"
                    class="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-orange-500 cursor-pointer"
                  >
                    Connexion
                  </button>
                  <button
                    (click)="uiState.toggleDarkMode()"
                    class="h-8 w-8 flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-400 cursor-pointer"
                  >
                    @if (uiState.isDarkMode()) { ☀️ } @else { 🌙 }
                  </button>
                </div>
              </div>
            }
          </nav>
        </header>

        <!-- CONTENU DU ROUTEUR (LoginComponent / Landing Page) -->
        <main class="grow flex flex-col">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- FOOTER EXACT DU TEMPLATE SCREWFAST (FooterSection.astro) :
           bg-neutral-300 en clair, dark:bg-neutral-900 en sombre
      -->
      <footer class="w-full bg-neutral-300 dark:bg-neutral-900 mt-auto transition-colors duration-300">
        <div class="mx-auto w-full max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-12">
          
          <div class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <!-- Colonne 1 : Brand Logo & Présentation -->
            <div class="col-span-full lg:col-span-1">
              <app-brand-logo className="scale-90 origin-left" />
              <p class="mt-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                Moteur d'apprentissage et de répétition active propulsé par IA pour étudiants exigeants.
              </p>
            </div>

            <!-- Colonne 2 : Plateforme -->
            <div class="col-span-1">
              <h3 class="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Plateforme
              </h3>
              <ul class="mt-4 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#features" (click)="scrollTo('features', $event)" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-150 cursor-pointer">Génération IA</a></li>
                <li><a href="#features" (click)="scrollTo('features', $event)" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-150 cursor-pointer">Mode Sprint Chrono</a></li>
                <li><a href="#showcase" (click)="scrollTo('showcase', $event)" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-150 cursor-pointer">Méthode Active</a></li>
                <li><button (click)="uiState.openAuthDropdown(true)" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-150 text-left cursor-pointer">Espace Étudiant</button></li>
              </ul>
            </div>

            <!-- Colonne 3 : Ressources -->
            <div class="col-span-1">
              <h3 class="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Ressources
              </h3>
              <ul class="mt-4 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#faq" (click)="scrollTo('faq', $event)" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-150 cursor-pointer">Questions Fréquentes</a></li>
                <li><a href="mailto:contact@revget.com" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition duration-150">Contact & Support</a></li>
                <li><span class="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Systèmes opérationnels</span></li>
              </ul>
            </div>

            <!-- Colonne 4 & 5 : Newsletter (Rester informé) -->
            <div class="col-span-full md:col-span-2">
              <h3 class="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Rester informé
              </h3>
              <p class="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                Recevez nos conseils de mémorisation et les nouveautés de l'IA pour vos examens.
              </p>

              <form (submit)="$event.preventDefault()" class="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Entrez votre email étudiant..."
                  class="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:border-orange-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  class="h-10 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 border border-neutral-700 dark:border-neutral-600 text-xs font-semibold transition cursor-pointer whitespace-nowrap shadow-xs"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>

          <!-- Ligne inférieure : Copyright & Mentions -->
          <div class="mt-12 pt-6 border-t border-neutral-400/40 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
            <div>
              © 2026 <strong>REVGET</strong>. Tous droits réservés. L'apprentissage actif propulsé par IA.
            </div>

            <div class="flex items-center gap-5 text-neutral-600 dark:text-neutral-400">
              <a href="#" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition">Confidentialité</a>
              <a href="#" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition">Conditions d'utilisation</a>
              <a href="#" class="hover:text-neutral-800 dark:hover:text-neutral-200 transition">Sécurité</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  `
})
export class PublicLayoutComponent implements OnInit, AfterViewInit {
  readonly authService = inject(AuthService);
  readonly uiState = inject(UiStateService);

  readonly activeSection = signal<string>('top');
  readonly isMobileMenuOpen = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.uiState.isAuthDropdownOpen()) {
        setTimeout(() => this.renderGoogleButton(), 50);
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  /**
   * Défilement fluide (Smooth Scroll) vers la section cible avec compensation de la navbar sticky
   */
  scrollTo(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isMobileMenuOpen.set(false);
    this.activeSection.set(sectionId);

    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', ' ');
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const navOffset = 96;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  }

  /**
   * Détection dynamique de la section visible au défilement pour mettre en surbrillance le lien de nav actif
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    const sections = ['faq', 'showcase', 'features'];
    const scrollPosition = window.pageYOffset + 150;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          this.activeSection.set(id);
          return;
        }
      }
    }

    if (window.pageYOffset < 300) {
      this.activeSection.set('top');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.uiState.isAuthDropdownOpen()) return;
    const target = event.target as HTMLElement;
    if (target.closest('.auth-dropdown-container') || target.closest('[data-auth-trigger]')) {
      return;
    }
    this.uiState.closeAuthDropdown();
  }

  ngOnInit(): void {
    this.checkOAuthCallback();
  }

  ngAfterViewInit(): void {
    this.initGoogleSSO();
  }

  private checkOAuthCallback(): void {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash && hash.includes('id_token=')) {
      const rawHash = hash.startsWith('#') ? hash.substring(1) : hash;
      const params = new URLSearchParams(rawHash);
      const idToken = params.get('id_token');

      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        this.authService.loginWithGoogle(idToken).subscribe({
          next: () => this.uiState.closeAuthDropdown(),
          error: (err) => console.error('[Revget Google SSO Error]', err)
        });
      }
    }
  }

  private initGoogleSSO(): void {
    if (this.authService.isAuthenticated()) return;

    if (typeof google === 'undefined' || !google.accounts?.id) {
      setTimeout(() => this.initGoogleSSO(), 250);
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: { credential: string }) => {
          if (response?.credential) {
            this.authService.loginWithGoogle(response.credential).subscribe({
              next: () => this.uiState.closeAuthDropdown(),
              error: (err) => console.error('[Revget Google SSO Error]', err)
            });
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (this.uiState.isAuthDropdownOpen()) {
        this.renderGoogleButton();
      }
    } catch (err: any) {
      console.warn('[Revget Google SSO Init Warning]', err);
    }
  }

  private renderGoogleButton(): void {
    if (typeof google === 'undefined' || !google.accounts?.id) return;
    const container = document.getElementById('google-btn-dropdown-container');
    if (container) {
      container.innerHTML = '';
      google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        width: 240
      });
    }
  }
}
