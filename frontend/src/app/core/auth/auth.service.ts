import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UserResponseDto } from './user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'revget_id_token';
  private readonly USER_KEY = 'revget_user_profile';

  // État Réactif via Angular Signals
  readonly currentUser = signal<UserResponseDto | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  readonly idToken = signal<string | null>(this.getStoredToken());

  constructor() {
    // Si un token est en cache, rafraîchir le profil utilisateur au démarrage
    if (this.idToken()) {
      this.fetchCurrentUser().subscribe({
        error: () => this.logout()
      });
    }
  }

  loginWithGoogle(credential: string): Observable<UserResponseDto> {
    this.saveToken(credential);

    // Récupération du profil auprès du backend (qui crée/met à jour l'utilisateur via le token)
    return this.fetchCurrentUser().pipe(
      tap((user) => {
        this.saveUser(user);
        if (user.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  fetchCurrentUser(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${environment.apiUrl}/users/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.saveUser(user);
      })
    );
  }

  /**
   * Nettoyage complet et robuste de la session locale et des cookies (Anti-Cache & Anti-403)
   */
  clearLocalSession(): void {
    // 1. Réinitialiser le Signal d'état utilisateur (le passer à null)
    this.currentUser.set(null);
    this.idToken.set(null);

    // 2. Exécuter localStorage.clear() et sessionStorage.clear()
    localStorage.clear();
    sessionStorage.clear();

    // 3. Parcourir et forcer l'expiration de tous les cookies du document.cookie
    if (typeof document !== 'undefined' && document.cookie) {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      }
    }
  }

  logout(): void {
    this.clearLocalSession();
    this.router.navigate(['/login']);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.idToken.set(token);
  }

  private saveUser(user: UserResponseDto): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): UserResponseDto | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserResponseDto;
    } catch {
      return null;
    }
  }
}
