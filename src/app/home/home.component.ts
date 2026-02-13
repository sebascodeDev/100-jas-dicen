import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SoundService } from '../shared/services/sound.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
      <div class="text-center space-y-8 max-w-4xl">
        <!-- Título -->
        <h1 class="text-6xl md:text-8xl font-bold gradient-text animate-pulse-glow">
          100 JAS DICEN
        </h1>

        <p class="text-xl md:text-2xl text-gray-300">
          El juego de preguntas más emocionante con temática de casino
        </p>

        <!-- Botones principales -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <a
            routerLink="/game"
            (mouseenter)="soundService.hover()"
            class="px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold glow-pink hover:bg-pink-600 transition-all transform hover:scale-105"
          >
            🎮 Jugar Ahora
          </a>

          <a
            routerLink="/admin"
            (mouseenter)="soundService.hover()"
            class="px-8 py-4 bg-secondary text-white rounded-lg text-lg font-semibold glow-cyan hover:bg-cyan-600 transition-all transform hover:scale-105"
          >
            ⚙️ Panel Admin
          </a>
        </div>

        <!-- Características -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur">
            <h3 class="text-xl font-bold text-primary mb-2">🎲 Equipos Personalizados</h3>
            <p class="text-gray-400">Crea equipos con nombres y colores únicos</p>
          </div>

          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur">
            <h3 class="text-xl font-bold text-secondary mb-2">❓ Preguntas Ilimitadas</h3>
            <p class="text-gray-400">Agrega tantas preguntas como quieras</p>
          </div>

          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur">
            <h3 class="text-xl font-bold text-accent mb-2">🏆 Sistema de Rankings</h3>
            <p class="text-gray-400">Sigue las puntuaciones y estadísticas</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  soundService = inject(SoundService);
}
