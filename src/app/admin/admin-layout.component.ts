import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SoundService } from '../shared/services/sound.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="min-h-screen">
      <!-- Header -->
      <header class="bg-gray-900/80 backdrop-blur border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold gradient-text">Admin Panel</h1>
            <nav class="flex gap-4">
              <a routerLink="/" (mouseenter)="soundService.hover()" class="text-gray-300 hover:text-white">← Inicio</a>
              <a routerLink="/admin/questions" (mouseenter)="soundService.hover()" routerLinkActive="text-primary" class="text-gray-300 hover:text-white">Preguntas</a>
              <a routerLink="/admin/teams" (mouseenter)="soundService.hover()" routerLinkActive="text-secondary" class="text-gray-300 hover:text-white">Equipos</a>
              <a routerLink="/game/rankings" (mouseenter)="soundService.hover()" class="text-gray-300 hover:text-white">Rankings</a>
            </nav>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="max-w-7xl mx-auto px-4 py-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  soundService = inject(SoundService);
}
