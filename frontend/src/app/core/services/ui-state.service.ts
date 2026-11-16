import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  readonly isDarkMode = signal<boolean>(false);
  readonly isAuthDropdownOpen = signal<boolean>(false);

  constructor() {
    // Initialise le thème sombre depuis localStorage ou préférences système
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('revget_theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.isDarkMode.set(initialDark);
      this.applyTheme(initialDark);
    }

    // Effet réactif pour synchroniser la classe 'dark' sur le document HTML
    effect(() => {
      const dark = this.isDarkMode();
      this.applyTheme(dark);
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('revget_theme', next ? 'dark' : 'light');
      }
      return next;
    });
  }

  toggleAuthDropdown(): void {
    this.isAuthDropdownOpen.update(prev => !prev);
  }

  openAuthDropdown(scrollToTop: boolean = false): void {
    this.isAuthDropdownOpen.set(true);
    if (scrollToTop && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  closeAuthDropdown(): void {
    this.isAuthDropdownOpen.set(false);
  }

  private applyTheme(dark: boolean): void {
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
