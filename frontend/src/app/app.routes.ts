import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';
import { PublicLayoutComponent } from './shared/ui/layouts/public-layout.component';
import { PrivateLayoutComponent } from './shared/ui/layouts/private-layout.component';

export const routes: Routes = [
  // Layout Public (ScrewFast)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent)
      }
    ]
  },

  // Layout Privé Authentifié (Afridev)
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/backoffice/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'login'
  }
];
