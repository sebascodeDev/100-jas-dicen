import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <h2 class="text-4xl font-bold gradient-text">Bienvenido al Panel Admin</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a routerLink="/admin/questions" class="block p-8 rounded-lg border border-gray-700 bg-gray-900/50 hover:border-primary transition-all glow-pink">
          <h3 class="text-2xl font-bold text-primary mb-2">❓ Gestionar Preguntas</h3>
          <p class="text-gray-400">Crea, edita y elimina preguntas para el juego</p>
        </a>

        <a routerLink="/admin/teams" class="block p-8 rounded-lg border border-gray-700 bg-gray-900/50 hover:border-secondary transition-all glow-cyan">
          <h3 class="text-2xl font-bold text-secondary mb-2">👥 Gestionar Equipos</h3>
          <p class="text-gray-400">Administra los equipos y sus colores</p>
        </a>
      </div>
    </div>
  `
})
export class AdminHomeComponent {}
