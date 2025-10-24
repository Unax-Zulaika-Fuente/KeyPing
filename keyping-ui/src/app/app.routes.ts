import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'passwords', loadComponent: () => import('./pages/passwords/passwords').then(m => m.PasswordsComponent) },
  { path: 'add', loadComponent: () => import('./pages/add-password/add-password').then(m => m.AddPasswordComponent) },
  { path: '**', redirectTo: 'dashboard' }
];
