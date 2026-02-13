import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { SoundService } from '../../shared/services/sound.service';
import { Ranking } from '../../models/game.models';

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen p-4">
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-5xl font-bold gradient-text mb-4">🏆 Rankings</h1>
          <p class="text-xl text-gray-300">Tabla de posiciones de todos los tiempos</p>
        </div>

        <!-- Estadísticas generales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-lg border border-primary bg-gray-900/50 text-center">
            <h3 class="text-lg text-gray-400 mb-2">Total de Equipos</h3>
            <p class="text-4xl font-bold text-primary">{{ totalTeams() }}</p>
          </div>

          <div class="p-6 rounded-lg border border-secondary bg-gray-900/50 text-center">
            <h3 class="text-lg text-gray-400 mb-2">Total de Partidas</h3>
            <p class="text-4xl font-bold text-secondary">{{ totalGames() }}</p>
          </div>

          <div class="p-6 rounded-lg border border-accent bg-gray-900/50 text-center">
            <h3 class="text-lg text-gray-400 mb-2">Puntos Totales</h3>
            <p class="text-4xl font-bold text-accent">{{ totalPoints() }}</p>
          </div>
        </div>

        <!-- Tabla de rankings -->
        @if (rankings().length > 0) {
          <div class="rounded-lg border border-gray-700 bg-gray-900/50 overflow-hidden">
            <!-- Header de tabla -->
            <div class="bg-gray-800 px-6 py-4 grid grid-cols-7 gap-4 font-bold text-gray-300 border-b border-gray-700">
              <div class="text-center">Pos</div>
              <div class="col-span-2">Equipo</div>
              <div class="text-center">Partidas</div>
              <div class="text-center">Victorias</div>
              <div class="text-center">Puntos</div>
              <div class="text-center">Promedio</div>
            </div>

            <!-- Filas de rankings -->
            @for (ranking of rankings(); track ranking.teamId; let i = $index) {
              <div
                class="px-6 py-4 grid grid-cols-7 gap-4 items-center hover:bg-gray-800/50 transition-colors border-b border-gray-700/50"
                [class.bg-yellow-500/10]="i === 0"
                [class.bg-gray-700/20]="i === 1"
                [class.bg-orange-900/10]="i === 2"
              >
                <!-- Posición -->
                <div class="text-center">
                  @if (i === 0) {
                    <span class="text-3xl">🥇</span>
                  } @else if (i === 1) {
                    <span class="text-3xl">🥈</span>
                  } @else if (i === 2) {
                    <span class="text-3xl">🥉</span>
                  } @else {
                    <span class="text-xl font-bold text-gray-500">{{ i + 1 }}</span>
                  }
                </div>

                <!-- Equipo -->
                <div class="col-span-2 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                       [style.background-color]="ranking.teamColor">
                    {{ ranking.teamName.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg">{{ ranking.teamName }}</h3>
                    <p class="text-sm text-gray-400">{{ ranking.teamColor }}</p>
                  </div>
                </div>

                <!-- Partidas jugadas -->
                <div class="text-center">
                  <span class="text-lg font-semibold">{{ ranking.gamesPlayed }}</span>
                </div>

                <!-- Victorias -->
                <div class="text-center">
                  <span class="text-lg font-semibold text-green-400">{{ ranking.gamesWon }}</span>
                  <span class="text-sm text-gray-500 ml-1">
                    ({{ getWinRate(ranking) }}%)
                  </span>
                </div>

                <!-- Puntos totales -->
                <div class="text-center">
                  <span class="text-xl font-bold text-accent">{{ ranking.totalPoints }}</span>
                </div>

                <!-- Promedio -->
                <div class="text-center">
                  <span class="text-lg font-semibold text-secondary">
                    {{ ranking.averagePoints.toFixed(1) }}
                  </span>
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- Sin datos -->
          <div class="p-12 rounded-lg border border-gray-700 bg-gray-900/50 text-center">
            <p class="text-2xl text-gray-400 mb-4">📊 Aún no hay estadísticas</p>
            <p class="text-gray-500">Juega algunas partidas para ver los rankings</p>
            <a href="/game" (mouseenter)="soundService.hover()" class="inline-block mt-6 px-6 py-3 bg-primary text-white rounded glow-pink">
              Jugar Ahora
            </a>
          </div>
        }

        <!-- Top 3 Destacado -->
        @if (rankings().length >= 3) {
          <div class="p-6 rounded-lg border border-accent bg-gray-900/50">
            <h3 class="text-2xl font-bold text-accent mb-4 text-center">🌟 Top 3 Equipos</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              @for (ranking of rankings().slice(0, 3); track ranking.teamId; let i = $index) {
                <div class="p-6 rounded-lg text-center relative"
                     [style.background-color]="ranking.teamColor + '20'"
                     [class.border-2]="i === 0"
                     [class.border-accent]="i === 0">
                  @if (i === 0) {
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-accent text-black rounded-full text-sm font-bold">
                      CAMPEÓN
                    </div>
                  }
                  <div class="text-4xl mb-2">
                    {{ i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉' }}
                  </div>
                  <div class="w-16 h-16 rounded-full mx-auto mb-3"
                       [style.background-color]="ranking.teamColor"></div>
                  <h4 class="text-xl font-bold mb-2">{{ ranking.teamName }}</h4>
                  <p class="text-3xl font-bold text-accent mb-1">{{ ranking.totalPoints }} pts</p>
                  <p class="text-sm text-gray-400">
                    {{ ranking.gamesWon }}/{{ ranking.gamesPlayed }} victorias
                  </p>
                </div>
              }
            </div>
          </div>
        }

        <!-- Botones de navegación -->
        <div class="flex gap-4 justify-center">
          <a href="/" (mouseenter)="soundService.hover()" class="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600">
            🏠 Inicio
          </a>
          <a href="/game" (mouseenter)="soundService.hover()" class="px-6 py-3 bg-primary text-white rounded glow-pink hover:bg-pink-600">
            🎮 Jugar
          </a>
          <a href="/admin" (mouseenter)="soundService.hover()" class="px-6 py-3 bg-secondary text-white rounded glow-cyan hover:bg-cyan-600">
            ⚙️ Admin
          </a>
        </div>
      </div>
    </div>
  `
})
export class RankingsComponent {
  dataService = inject(DataService);
  soundService = inject(SoundService);

  rankings = computed(() => this.dataService.getRankings());

  totalTeams = computed(() => this.rankings().length);

  totalGames = computed(() =>
    this.rankings().reduce((sum, r) => sum + r.gamesPlayed, 0)
  );

  totalPoints = computed(() =>
    this.rankings().reduce((sum, r) => sum + r.totalPoints, 0)
  );

  getWinRate(ranking: Ranking): number {
    if (ranking.gamesPlayed === 0) return 0;
    return Math.round((ranking.gamesWon / ranking.gamesPlayed) * 100);
  }
}
