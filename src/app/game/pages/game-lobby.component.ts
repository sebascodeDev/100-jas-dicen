import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { GameService } from '../../shared/services/game.service';
import { SoundService } from '../../shared/services/sound.service';
import { Team } from '../../models/game.models';

@Component({
  selector: 'app-game-lobby',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen p-4">
      <!-- Countdown overlay -->
      @if (showCountdown()) {
        <div class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div class="text-center">
            <div class="text-9xl font-bold gradient-text animate-pulse">
              {{ countdownNumber() }}
            </div>
            <p class="text-2xl text-gray-300 mt-8">Preparando el juego...</p>
          </div>
        </div>
      }

      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-5xl font-bold gradient-text mb-4">Lobby de Juego</h1>
          <p class="text-xl text-gray-300">Selecciona los equipos que van a jugar</p>
        </div>

        <!-- Equipos disponibles -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (team of teams(); track team.id) {
            <button
              (click)="toggleTeam(team)"
              (mouseenter)="soundService.hover()"
              [class]="getTeamCardClass(team)"
              class="p-6 rounded-lg border-2 transition-all transform hover:scale-105"
            >
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                     [style.background-color]="team.color">
                  {{ team.name.charAt(0) }}
                </div>
                <div class="flex-1 text-left">
                  <h3 class="text-xl font-bold">{{ team.name }}</h3>
                  <p class="text-sm text-gray-400">{{ team.color }}</p>
                </div>
                @if (isTeamSelected(team)) {
                  <div class="text-3xl">✓</div>
                }
              </div>
            </button>
          }
        </div>

        <!-- Equipos seleccionados -->
        @if (selectedTeams().length > 0) {
          <div class="p-6 rounded-lg border border-primary bg-gray-900/70">
            <h3 class="text-2xl font-bold text-primary mb-4">
              Equipos Seleccionados ({{ selectedTeams().length }})
            </h3>
            <div class="flex flex-wrap gap-3">
              @for (team of selectedTeams(); track team.id) {
                <div class="px-4 py-2 rounded-full flex items-center gap-2"
                     [style.background-color]="team.color">
                  <span class="text-white font-semibold">{{ team.name }}</span>
                  <button (click)="toggleTeam(team)" class="text-white hover:text-gray-200">✕</button>
                </div>
              }
            </div>
          </div>
        }

        <!-- Configuración del juego -->
        <div class="p-6 rounded-lg border border-secondary bg-gray-900/70">
          <h3 class="text-2xl font-bold text-secondary mb-4">Configuración</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">Cantidad de preguntas:</label>
              <input
                type="number"
                min="1"
                max="10"
                [(value)]="questionCount"
                (input)="updateQuestionCount($event)"
                class="w-32 px-4 py-2 bg-gray-800 rounded text-white border border-gray-700"
              />
            </div>
            <p class="text-sm text-gray-400">
              Preguntas disponibles: {{ availableQuestions() }}
            </p>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-4 justify-center">
          <a href="/" (mouseenter)="soundService.hover()" class="px-8 py-4 bg-gray-700 text-white rounded-lg text-lg hover:bg-gray-600">
            ← Volver al Inicio
          </a>

          <button
            (click)="startGame()"
            (mouseenter)="soundService.hover()"
            [disabled]="!canStartGame()"
            [class]="canStartGame() ? 'bg-primary glow-pink hover:bg-pink-600' : 'bg-gray-600 cursor-not-allowed'"
            class="px-8 py-4 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
          >
            🎮 Iniciar Juego
          </button>
        </div>

        @if (!canStartGame()) {
          <p class="text-center text-yellow-400">
            ⚠️ Necesitas seleccionar al menos 2 equipos para iniciar
          </p>
        }
      </div>
    </div>
  `
})
export class GameLobbyComponent {
  dataService = inject(DataService);
  gameService = inject(GameService);
  soundService = inject(SoundService);
  router = inject(Router);

  teams = this.dataService.teams;
  selectedTeams = signal<Team[]>([]);
  questionCount = 5;

  showCountdown = signal(false);
  countdownNumber = signal(3);

  availableQuestions() {
    return this.dataService.getQuestions().length;
  }

  toggleTeam(team: Team) {
    this.soundService.click();
    const selected = this.selectedTeams();
    const index = selected.findIndex(t => t.id === team.id);

    if (index >= 0) {
      // Quitar equipo
      this.selectedTeams.set(selected.filter(t => t.id !== team.id));
    } else {
      // Agregar equipo
      this.selectedTeams.set([...selected, team]);
    }
  }

  isTeamSelected(team: Team): boolean {
    return this.selectedTeams().some(t => t.id === team.id);
  }

  getTeamCardClass(team: Team): string {
    const isSelected = this.isTeamSelected(team);
    return isSelected
      ? 'border-primary bg-gray-800 glow-pink'
      : 'border-gray-700 bg-gray-900/50 hover:border-gray-500';
  }

  updateQuestionCount(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    if (!isNaN(value) && value > 0) {
      this.questionCount = value;
    }
  }

  canStartGame(): boolean {
    return this.selectedTeams().length >= 2 &&
           this.availableQuestions() >= this.questionCount;
  }

  startGame() {
    if (!this.canStartGame()) return;

    // Iniciar countdown
    this.showCountdown.set(true);
    this.countdownNumber.set(3);

    const countdown = setInterval(() => {
      const current = this.countdownNumber();
      if (current > 1) {
        this.soundService.click();
        this.countdownNumber.set(current - 1);
      } else {
        clearInterval(countdown);
        this.soundService.gameStart();
        this.showCountdown.set(false);

        // Iniciar juego
        const teamIds = this.selectedTeams().map(t => t.id);
        const game = this.gameService.startGame(teamIds, this.questionCount);

        if (game) {
          this.router.navigate(['/game/play']);
        } else {
          alert('Error al iniciar el juego. Verifica que haya suficientes preguntas.');
        }
      }
    }, 1000);
  }
}
