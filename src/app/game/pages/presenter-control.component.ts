import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../shared/services/game.service';
import { SyncService } from '../../shared/services/sync.service';
import { SoundService } from '../../shared/services/sound.service';
import { Answer } from '../../models/game.models';

@Component({
  selector: 'app-presenter-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6 p-4 bg-purple-900/50 rounded-lg border border-purple-500">
          <h1 class="text-2xl font-bold gradient-text">
            🎬 Control de Presentador
          </h1>
          <p class="text-sm text-gray-400 mt-2">
            Controla el juego desde esta ventana. Los cambios se sincronizan automáticamente.
          </p>
        </div>

        @if (currentQuestion()) {
          <!-- Pregunta actual -->
          <div class="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p class="text-sm text-gray-400">Pregunta Actual</p>
            <h2 class="text-xl font-bold mt-2">{{ currentQuestion()!.text }}</h2>
          </div>

          <!-- Respuestas -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold">Respuestas</h3>
              <button
                (click)="toggleAnswersVisibility()"
                class="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                {{ showAnswersText() ? '👁️ Ocultar Textos' : '👁️‍🗨️ Mostrar Textos' }}
              </button>
            </div>
            @for (answer of sortedAnswers(); track answer.id) {
              <div
                (click)="toggleAnswer(answer)"
                class="p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-102"
                [class]="getAnswerClass(answer)"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-4">
                    <span class="text-2xl font-bold text-gray-500">{{ answer.order }}</span>
                    <div>
                      @if (showAnswersText()) {
                        <span class="text-lg font-semibold">{{ answer.text }}</span>
                        @if (!isRevealed(answer)) {
                          <span class="ml-2 text-sm text-yellow-400">(Oculta)</span>
                        }
                      } @else {
                        <span class="text-lg font-semibold text-gray-600">***</span>
                      }
                    </div>
                  </div>
                  <span class="text-xl font-bold">{{ answer.points }} pts</span>
                </div>
              </div>
            }
          </div>

          <!-- Controles -->
          <div class="space-y-4 mb-6">
            <div class="grid grid-cols-3 gap-4">
              <button
                (click)="registerIncorrectAnswer()"
                class="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-500 font-semibold transition-colors"
              >
                ✗ Respuesta Incorrecta
              </button>

              <button
                (click)="revealAll()"
                class="px-6 py-3 bg-yellow-600 rounded-lg hover:bg-yellow-500 font-semibold transition-colors"
              >
                Revelar Todas
              </button>

              <button
                (click)="nextQuestion()"
                class="px-6 py-3 bg-pink-600 rounded-lg hover:bg-pink-500 font-semibold transition-colors"
              >
                Siguiente Pregunta →
              </button>
            </div>

            <button
              (click)="endGame()"
              class="w-full px-6 py-3 bg-red-700 rounded-lg hover:bg-red-600 font-semibold transition-colors border-2 border-red-500"
            >
              🏁 Finalizar Partida
            </button>
          </div>

          <!-- Equipo actual -->
          <div class="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p class="text-sm text-gray-400 mb-3">Equipo Actual</p>
            <div class="flex gap-2">
              @for (team of game()?.teams || []; track team.id) {
                <button
                  (click)="setCurrentTeam($index)"
                  class="flex-1 p-3 rounded-lg border-2 transition-all"
                  [class]="currentTeamIndex() === $index ? 'border-accent bg-gray-700' : 'border-gray-600 hover:border-gray-500'"
                  [style.background-color]="team.color + '20'"
                >
                  <div class="flex items-center gap-2 justify-center">
                    <div class="w-6 h-6 rounded-full" [style.background-color]="team.color"></div>
                    <span class="font-semibold">{{ team.name }}</span>
                  </div>
                  <p class="text-xl font-bold text-accent mt-1">{{ team.score || 0 }} pts</p>
                </button>
              }
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 class="font-semibold mb-3">Estadísticas</h3>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-sm text-gray-400">Errores</p>
                <p class="text-2xl font-bold" [class]="getErrorsClass()">
                  {{ game()?.errorsCount || 0 }} / {{ game()?.maxErrors || 3 }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Racha</p>
                <p class="text-2xl font-bold text-yellow-400">
                  {{ game()?.consecutiveCorrect || 0 }}
                  @if (getStreakBonus() > 0) {
                    <span class="text-sm">+{{ getStreakBonus() }}pts</span>
                  }
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Perfectas</p>
                <p class="text-2xl font-bold text-green-400">
                  {{ game()?.perfectQuestions || 0 }}
                </p>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-12">
            <p class="text-xl text-gray-400">No hay juego activo</p>
            <p class="text-sm text-gray-500 mt-2">Inicia un juego desde la pantalla principal</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .gradient-text {
      background: linear-gradient(135deg, #ec4899, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `]
})
export class PresenterControlComponent {
  gameService = inject(GameService);
  syncService = inject(SyncService);
  soundService = inject(SoundService);

  game = this.gameService.currentGame;
  currentQuestion = computed(() => this.gameService.getCurrentQuestion());
  currentTeamIndex = computed(() => this.syncService.state().currentTeamIndex);

  // Control de visibilidad de textos de respuestas (por defecto ocultos)
  showAnswersText = signal(false);

  sortedAnswers = computed(() => {
    const question = this.currentQuestion();
    if (!question) return [];
    return [...question.answers].sort((a, b) => a.order - b.order);
  });

  isRevealed(answer: Answer): boolean {
    return this.syncService.isAnswerRevealed(answer.id);
  }

  getAnswerClass(answer: Answer): string {
    return this.isRevealed(answer)
      ? 'border-green-500 bg-green-900/30'
      : 'border-gray-600 bg-gray-800 hover:border-gray-500';
  }

  toggleAnswersVisibility() {
    this.showAnswersText.update(visible => !visible);
  }

  toggleAnswer(answer: Answer) {
    // Solo procesar si NO está revelada
    if (!this.isRevealed(answer)) {
      // Registrar respuesta correcta para bonus de racha
      this.gameService.registerCorrectAnswer();

      // Reproducir sonido de respuesta correcta
      this.soundService.correctAnswer();

      // Revelar la respuesta
      this.syncService.revealAnswer(answer.id);

      // Obtener equipo actual
      const currentTeam = this.game()?.teams[this.currentTeamIndex()];
      if (currentTeam) {
        // Calcular bonus por racha
        const consecutiveCorrect = this.game()?.consecutiveCorrect || 0;
        const bonus = this.calculateStreakBonus(consecutiveCorrect);
        const totalPoints = answer.points + bonus;

        // Agregar puntos al equipo actual
        this.gameService.addPoints(currentTeam.id, totalPoints);
        this.soundService.addPoints();

        // Reproducir sonido de bonus si hay
        if (bonus > 0) {
          this.soundService.addBonus();
        }
      }
    }
  }

  calculateStreakBonus(consecutiveCorrect: number): number {
    if (consecutiveCorrect >= 5) return 20;
    if (consecutiveCorrect >= 3) return 10;
    if (consecutiveCorrect >= 2) return 5;
    return 0;
  }

  revealAll() {
    const question = this.currentQuestion();
    if (!question) return;

    const allIds = question.answers.map(a => a.id);
    this.syncService.revealAll(allIds);
  }

  nextQuestion() {
    const hasNext = this.gameService.nextQuestion();
    if (hasNext) {
      const newQuestion = this.gameService.getCurrentQuestion();
      if (newQuestion) {
        this.syncService.setCurrentQuestion(newQuestion.id);
      }
    }
  }

  setCurrentTeam(index: number) {
    this.syncService.setCurrentTeam(index);
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

  registerIncorrectAnswer() {
    // Registrar error y verificar si se alcanzó el máximo
    const maxErrorsReached = this.gameService.registerError();
    const penalty = this.gameService.getErrorPenalty();

    // Aplicar penalización al equipo actual
    const currentTeam = this.game()?.teams[this.currentTeamIndex()];
    if (currentTeam && penalty > 0) {
      this.gameService.addPoints(currentTeam.id, -penalty);
    }

    // Reproducir sonido de respuesta incorrecta
    this.soundService.incorrectAnswer();

    // Si se alcanzó el máximo de errores, avanzar a siguiente pregunta
    if (maxErrorsReached) {
      setTimeout(() => {
        this.soundService.maxErrors();
        this.nextQuestion();
      }, 1500);
    }
  }

  endGame() {
    // Mostrar confirmación
    const confirmed = confirm(
      '¿Estás seguro de que deseas finalizar la partida?\n\n' +
      'Esto terminará el juego inmediatamente y mostrará los resultados finales.'
    );

    if (confirmed) {
      // Finalizar el juego
      this.gameService.endGame();

      // Reproducir sonido de ganador
      this.soundService.winner();
    }
  }
}
