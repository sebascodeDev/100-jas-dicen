import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin-home.component').then(m => m.AdminHomeComponent)
      },
      {
        path: 'questions',
        loadComponent: () => import('./pages/questions-list.component').then(m => m.QuestionsListComponent)
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/teams-list.component').then(m => m.TeamsListComponent)
      }
    ]
  }
];
