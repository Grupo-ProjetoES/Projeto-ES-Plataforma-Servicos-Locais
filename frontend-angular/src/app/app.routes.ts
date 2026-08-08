import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rootGuard } from './core/guards/root.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [rootGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
];
