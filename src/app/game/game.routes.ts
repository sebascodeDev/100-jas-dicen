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
    path: 'rankings',
    loadComponent: () => import('./pages/rankings.component').then(m => m.RankingsComponent)
  }
];
