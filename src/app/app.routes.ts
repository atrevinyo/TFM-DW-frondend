import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) },

  // Ruta per a dashboard protegida amb AuthGuard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'assignatura/:id',
        loadComponent: () =>
          import('./assignatura/assignatura.component').then((m) => m.AssignaturaComponent),
      },
    ],
  },
  { path: 'registre', loadComponent: () => import('./registre/registre.component').then((m) => m.RegistreComponent) },
  { path: '**', redirectTo: 'login' },

];
