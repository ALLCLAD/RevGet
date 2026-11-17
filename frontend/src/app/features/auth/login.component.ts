import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly uiState = inject(UiStateService);

  readonly openFaq = signal<number | null>(0);

  toggleFaq(index: number): void {
    this.openFaq.update(current => (current === index ? null : index));
  }

  openAuthDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.uiState.openAuthDropdown(true);
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }
}
