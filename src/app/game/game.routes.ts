import { Routes } from '@angular/router';

export const GAME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/game-lobby.component').then(m => m.GameLobbyComponent)
  },
  {
    path: 'play',
    loadComponent: () => import('./pages/game-board.component').then(m => m.GameBoardComponent)
  },
  {
    path: 'presenter',
    loadComponent: () => import('./pages/presenter-control.component').then(m => m.PresenterControlComponent)
  },
  {
    path: 'rankings',
    loadComponent: () => import('./pages/rankings.component').then(m => m.RankingsComponent)
  }
];
