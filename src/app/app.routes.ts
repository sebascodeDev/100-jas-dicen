import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'help',
    loadComponent: () => import('./help/help.component').then(m => m.HelpComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.routes').then(m => m.GAME_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
