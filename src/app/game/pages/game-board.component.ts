import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../shared/services/game.service';
import { SoundService } from '../../shared/services/sound.service';
import { SyncService } from '../../shared/services/sync.service';
import { GameSession, Question, Answer } from '../../models/game.models';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen p-4">
      <!-- Mute Toggle -->
      <div class="fixed top-4 right-4 z-50">
        <button
          (click)="toggleMute()"
          (mouseenter)="soundService.hover()"
          class="px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-400 transition-all"
        >
          {{ soundService.getMuted() ? '🔇 Sonido OFF' : '🔊 Sonido ON' }}
        </button>
      </div>

      @if (game()) {
        @if (game()!.status === 'playing') {
          <!-- Game playing -->
          <div class="max-w-6xl mx-auto space-y-6">
            <!-- Header con puntuaciones -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @for (team of game()!.teams; track team.id) {
                <div class="p-4 rounded-lg border-2 transition-all"
                     [class]="currentTeamIndex() === $index ? 'border-accent glow-yellow' : 'border-gray-700'"
                     [style.background-color]="team.color + '20'">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-full" [style.background-color]="team.color"></div>
                    <h3 class="font-bold">{{ team.name }}</h3>
                  </div>
                  <p class="text-3xl font-bold text-accent">{{ team.score || 0 }} pts</p>
                  @if (currentTeamIndex() === $index) {
                    <p class="text-sm text-accent mt-1">▶ Turno actual</p>
                  }
                </div>
              }
            </div>

            <!-- Panel de estadísticas -->
            <div class="p-4 rounded-lg border border-gray-700 bg-gray-900/50">
              <h3 class="text-lg font-bold mb-3 gradient-text">Estadísticas</h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <p class="text-sm text-gray-400">Errores</p>
                  <p class="text-2xl font-bold" [class]="getErrorsClass()">
                    {{ game()?.errorsCount || 0 }} / {{ game()?.maxErrors || 3 }}
                  </p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-400">Racha Actual</p>
                  <p class="text-2xl font-bold text-accent">
                    {{ game()?.consecutiveCorrect || 0 }}
                    @if (getStreakBonus() > 0) {
                      <span class="text-sm text-yellow-400">+{{ getStreakBonus() }}pts</span>
                    }
                  </p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-400">Preguntas Perfectas</p>
                  <p class="text-2xl font-bold text-green-400">
                    {{ game()?.perfectQuestions || 0 }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Pregunta actual -->
            @if (currentQuestion()) {
              <div class="p-8 rounded-lg border border-primary bg-gray-900/70 glow-pink text-center">
                <p class="text-sm text-gray-400 mb-2">Pregunta {{ currentQuestionNumber() }} de {{ totalQuestions() }}</p>
                <h2 class="text-3xl md:text-4xl font-bold gradient-text">
                  {{ currentQuestion()!.text }}
                </h2>
              </div>

              <!-- Tablero de respuestas -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (answer of currentQuestion()!.answers; track answer.id) {
                  <div
                    [class]="getAnswerCardClass(answer)"
                    class="p-6 rounded-lg border-2 transition-all"
                  >
                    @if (isAnswerRevealed(answer)) {
                      <div class="flex justify-between items-center">
                        <span class="text-xl font-semibold">{{ answer.order }}. {{ answer.text }}</span>
                        <span class="text-2xl font-bold text-accent">{{ answer.points }} pts</span>
                      </div>
                    } @else {
                      <div class="text-center">
                        <span class="text-3xl font-bold text-gray-600">{{ answer.order }}</span>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Mensaje de instrucción -->
              <div class="p-6 rounded-lg border border-secondary bg-gray-900/70 text-center">
                <p class="text-xl text-gray-300">
                  🎬 Usa el <span class="font-bold text-purple-400">Control de Presentador</span> para revelar las respuestas que los jugadores mencionen
                </p>
              </div>

              <!-- Controles -->
              <div class="flex gap-4 justify-center">
                <button
                  (click)="nextTeam()"
                  (mouseenter)="soundService.hover()"
                  class="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Siguiente Equipo
                </button>

                <button
                  (click)="revealAllAnswers()"
                  (mouseenter)="soundService.hover()"
                  class="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                >
                  Revelar Todas
                </button>

                <button
                  (click)="openPresenterWindow()"
                  (mouseenter)="soundService.hover()"
                  class="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-500"
                >
                  🎬 Abrir Control Presentador
                </button>

                <button
                  (click)="nextQuestion()"
                  (mouseenter)="soundService.hover()"
                  class="px-6 py-3 bg-primary text-white rounded glow-pink hover:bg-pink-600"
                >
                  Siguiente Pregunta →
                </button>
              </div>
            }
          </div>
        } @else {
          <!-- Game finished -->
          <div class="max-w-4xl mx-auto text-center space-y-8">
            <h1 class="text-6xl font-bold gradient-text animate-pulse-glow">
              ¡JUEGO TERMINADO!
            </h1>

            @if (winner()) {
              <div class="p-8 rounded-lg border-2 border-accent glow-yellow bg-gray-900/70">
                <h2 class="text-4xl font-bold mb-4">🏆 GANADOR 🏆</h2>
                <div class="flex items-center justify-center gap-4 mb-4">
                  <div class="w-20 h-20 rounded-full" [style.background-color]="winner()!.color"></div>
                  <div>
                    <h3 class="text-3xl font-bold">{{ winner()!.name }}</h3>
                    <p class="text-5xl font-bold text-accent">{{ winner()!.score }} puntos</p>
                  </div>
                </div>
              </div>
            }

            <!-- Resultados finales -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50">
              <h3 class="text-2xl font-bold mb-4">Resultados Finales</h3>
              <div class="space-y-3">
                @for (team of sortedTeams(); track team.id) {
                  <div class="flex justify-between items-center p-4 rounded"
                       [style.background-color]="team.color + '20'">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl font-bold">{{ $index + 1 }}.</span>
                      <div class="w-8 h-8 rounded-full" [style.background-color]="team.color"></div>
                      <span class="text-xl font-semibold">{{ team.name }}</span>
                    </div>
                    <span class="text-2xl font-bold text-accent">{{ team.score }} pts</span>
                  </div>
                }
              </div>
            </div>

            <div class="flex gap-4 justify-center">
              <button (click)="playAgain()" (mouseenter)="soundService.hover()" class="px-8 py-4 bg-primary text-white rounded-lg text-lg glow-pink">
                🎮 Jugar de Nuevo
              </button>
              <a href="/game/rankings" (mouseenter)="soundService.hover()" class="px-8 py-4 bg-secondary text-white rounded-lg text-lg glow-cyan inline-block">
                📊 Ver Rankings
              </a>
              <a href="/" (mouseenter)="soundService.hover()" class="px-8 py-4 bg-gray-700 text-white rounded-lg text-lg inline-block">
                🏠 Ir al Inicio
              </a>
            </div>
          </div>
        }
      } @else {
        <!-- No game in progress -->
        <div class="max-w-2xl mx-auto text-center space-y-6">
          <h2 class="text-4xl font-bold text-primary">No hay juego en curso</h2>
          <p class="text-xl text-gray-300">Por favor, inicia un juego desde el lobby</p>
          <a href="/game" class="inline-block px-8 py-4 bg-primary text-white rounded-lg text-lg glow-pink">
            Ir al Lobby
          </a>
        </div>
      }
    </div>
  `
})
export class GameBoardComponent implements OnInit {
  gameService = inject(GameService);
  soundService = inject(SoundService);
  syncService = inject(SyncService);
  router = inject(Router);

  game = this.gameService.currentGame;
  revealedAnswers = computed(() => new Set(this.syncService.state().revealedAnswers));
  currentTeamIndex = computed(() => this.syncService.state().currentTeamIndex);

  currentQuestion = computed(() => this.gameService.getCurrentQuestion());
  currentQuestionNumber = computed(() => (this.game()?.currentQuestionIndex || 0) + 1);
  totalQuestions = computed(() => this.game()?.questions.length || 0);
  winner = computed(() => this.gameService.getWinner());

  sortedTeams = computed(() => {
    const teams = this.game()?.teams || [];
    return [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));
  });

  ngOnInit() {
    if (!this.game()) {
      this.router.navigate(['/game']);
    } else if (this.game()?.status === 'finished') {
      this.soundService.winner();
    } else {
      // Inicializar sync service con la pregunta actual
      const currentQuestion = this.gameService.getCurrentQuestion();
      if (currentQuestion) {
        this.syncService.setCurrentQuestion(currentQuestion.id);
      }

      // Abrir automáticamente la ventana del presentador
      setTimeout(() => this.openPresenterWindow(), 500);
    }
  }

  toggleMute() {
    this.soundService.toggleMute();
  }

  getErrorsClass(): string {
    const errors = this.game()?.errorsCount || 0;
    const maxErrors = this.game()?.maxErrors || 3;
    if (errors === 0) return 'text-green-400';
    if (errors >= maxErrors - 1) return 'text-red-400 animate-pulse';
    return 'text-yellow-400';
  }

  getStreakBonus(): number {
    const consecutive = this.game()?.consecutiveCorrect || 0;
    if (consecutive >= 5) return 20;
    if (consecutive >= 3) return 10;
    if (consecutive >= 2) return 5;
    return 0;
  }

  isAnswerRevealed(answer: Answer): boolean {
    return this.revealedAnswers().has(answer.id);
  }

  revealAnswer(answer: Answer) {
    if (!this.isAnswerRevealed(answer)) {
      this.soundService.revealAnswer();
      this.syncService.revealAnswer(answer.id);
    }
  }

  allAnswersRevealed(): boolean {
    const question = this.currentQuestion();
    if (!question) return true;
    return question.answers.every(a => this.revealedAnswers().has(a.id));
  }

  getAnswerCardClass(answer: Answer): string {
    return this.isAnswerRevealed(answer)
      ? 'border-accent bg-gray-800 glow-yellow'
      : 'border-gray-700 bg-gray-900/70';
  }

  nextTeam() {
    this.soundService.click();
    const teamCount = this.game()?.teams.length || 0;
    const newIndex = (this.currentTeamIndex() + 1) % teamCount;
    this.syncService.setCurrentTeam(newIndex);
  }

  revealAllAnswers() {
    const question = this.currentQuestion();
    if (!question) return;

    this.soundService.revealAll();
    const allIds = question.answers.map(a => a.id);
    this.syncService.revealAll(allIds);
  }

  nextQuestion() {
    this.soundService.newQuestion();
    this.syncService.setCurrentTeam(0);

    const hasNext = this.gameService.nextQuestion();

    // Resetear estado de sync para nueva pregunta
    const newQuestion = this.gameService.getCurrentQuestion();
    if (newQuestion) {
      this.syncService.setCurrentQuestion(newQuestion.id);
    }

    if (!hasNext) {
      // Juego terminado - el servicio ya lo marca como finished
      this.soundService.winner();
    }
  }

  playAgain() {
    this.soundService.click();
    this.gameService.resetGame();
    this.router.navigate(['/game']);
  }

  openPresenterWindow() {
    const width = 800;
    const height = 600;
    const left = window.screen.width - width - 100;
    const top = 100;

    window.open(
      '/game/presenter',
      'presenter',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes`
    );
  }
}
