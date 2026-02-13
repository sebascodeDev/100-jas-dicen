import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../shared/services/game.service';
import { SoundService } from '../../shared/services/sound.service';
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
                    (click)="revealAnswer(answer)"
                    [class]="getAnswerCardClass(answer)"
                    class="p-6 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105"
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

              <!-- Input de respuesta -->
              <div class="p-6 rounded-lg border border-secondary bg-gray-900/70">
                <div class="flex gap-4">
                  <input
                    type="text"
                    [(ngModel)]="playerAnswer"
                    (keyup.enter)="submitAnswer()"
                    placeholder="Escribe tu respuesta..."
                    class="flex-1 px-4 py-3 text-xl bg-gray-800 rounded text-white border border-gray-700 focus:border-secondary focus:outline-none"
                    [disabled]="allAnswersRevealed()"
                  />
                  <button
                    (click)="submitAnswer()"
                    (mouseenter)="soundService.hover()"
                    [disabled]="!playerAnswer.trim() || allAnswersRevealed()"
                    class="px-8 py-3 bg-secondary text-white rounded text-lg font-semibold glow-cyan hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>

                @if (lastAttempt()) {
                  <div class="mt-4 p-4 rounded" [class]="lastAttempt()!.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
                    @if (lastAttempt()!.correct) {
                      ✓ ¡Correcto! +{{ lastAttempt()!.points }} puntos
                    } @else {
                      ✗ Respuesta incorrecta
                    }
                  </div>
                }
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
  router = inject(Router);

  game = this.gameService.currentGame;
  playerAnswer = '';
  revealedAnswers = signal<Set<string>>(new Set());
  currentTeamIndex = signal(0);
  lastAttempt = signal<{ correct: boolean; points: number; bonus?: number } | null>(null);

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
    }
  }

  toggleMute() {
    this.soundService.toggleMute();
  }

  isAnswerRevealed(answer: Answer): boolean {
    return this.revealedAnswers().has(answer.id);
  }

  revealAnswer(answer: Answer) {
    if (!this.isAnswerRevealed(answer)) {
      this.soundService.revealAnswer();
      this.revealedAnswers.update(set => new Set(set).add(answer.id));
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
      : 'border-gray-700 bg-gray-900/70 hover:border-gray-500';
  }

  submitAnswer() {
    if (!this.playerAnswer.trim()) return;

    const result = this.gameService.checkAnswer(this.playerAnswer);
    this.lastAttempt.set(result);

    if (result.correct && result.answerId) {
      // Play correct answer sound
      this.soundService.correctAnswer();

      // Revelar respuesta correcta
      this.revealAnswer({ id: result.answerId } as Answer);

      // Añadir puntos al equipo actual
      const currentTeam = this.game()?.teams[this.currentTeamIndex()];
      if (currentTeam) {
        this.gameService.addPoints(currentTeam.id, result.points);
        this.soundService.addPoints();
      }
    } else {
      // Play incorrect answer sound
      this.soundService.incorrectAnswer();
    }

    this.playerAnswer = '';

    // Auto limpiar mensaje después de 2 segundos
    setTimeout(() => this.lastAttempt.set(null), 2000);
  }

  nextTeam() {
    this.soundService.click();
    const teamCount = this.game()?.teams.length || 0;
    this.currentTeamIndex.update(i => (i + 1) % teamCount);
  }

  revealAllAnswers() {
    const question = this.currentQuestion();
    if (!question) return;

    this.soundService.revealAll();
    const allIds = new Set(question.answers.map(a => a.id));
    this.revealedAnswers.set(allIds);
  }

  nextQuestion() {
    this.soundService.newQuestion();
    this.revealedAnswers.set(new Set());
    this.currentTeamIndex.set(0);
    this.lastAttempt.set(null);
    this.playerAnswer = '';

    const hasNext = this.gameService.nextQuestion();
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
}
