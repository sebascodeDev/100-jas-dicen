import { Injectable, signal } from '@angular/core';
import { GameSession, Question, Team } from '../../models/game.models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGameSignal = signal<GameSession | null>(null);
  currentGame = this.currentGameSignal.asReadonly();

  constructor(private dataService: DataService) {}

  // Iniciar nuevo juego
  startGame(teamIds: string[], questionCount: number = 5): GameSession | null {
    const allQuestions = this.dataService.getQuestions();
    if (allQuestions.length < questionCount) {
      console.error('No hay suficientes preguntas');
      return null;
    }

    const teams = teamIds
      .map(id => this.dataService.getTeam(id))
      .filter((t): t is Team => t !== undefined);

    if (teams.length < 2) {
      console.error('Se necesitan al menos 2 equipos');
      return null;
    }

    // Seleccionar preguntas aleatorias
    const selectedQuestions = this.shuffleArray([...allQuestions])
      .slice(0, questionCount);

    const gameSession: GameSession = {
      id: this.generateId(),
      teams: teams.map(t => ({ ...t, score: 0 })),
      currentQuestionIndex: 0,
      questions: selectedQuestions,
      scores: teams.reduce((acc, team) => ({ ...acc, [team.id]: 0 }), {}),
      status: 'playing',
      startedAt: new Date(),
      errorsCount: 0,
      maxErrors: 3,
      consecutiveCorrect: 0,
      perfectQuestions: 0
    };

    this.currentGameSignal.set(gameSession);
    return gameSession;
  }

  // Obtener pregunta actual
  getCurrentQuestion(): Question | null {
    const game = this.currentGameSignal();
    if (!game || game.status !== 'playing') return null;
    return game.questions[game.currentQuestionIndex] || null;
  }

  // Verificar respuesta
  checkAnswer(answerText: string): { correct: boolean; points: number; answerId?: string; bonus?: number } {
    const game = this.currentGameSignal();
    if (!game) return { correct: false, points: 0 };

    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return { correct: false, points: 0 };

    const normalizedAnswer = answerText.toLowerCase().trim();
    const matchedAnswer = currentQuestion.answers.find(
      a => a.text.toLowerCase().trim() === normalizedAnswer
    );

    if (matchedAnswer) {
      // Calcular bonus por racha
      const streakBonus = this.calculateStreakBonus(game.consecutiveCorrect);
      const totalPoints = matchedAnswer.points + streakBonus;

      return {
        correct: true,
        points: totalPoints,
        answerId: matchedAnswer.id,
        bonus: streakBonus
      };
    }

    return { correct: false, points: 0 };
  }

  // Calcular bonus por racha de respuestas correctas
  private calculateStreakBonus(consecutiveCorrect: number): number {
    if (consecutiveCorrect >= 5) return 20; // 5+ correctas seguidas
    if (consecutiveCorrect >= 3) return 10; // 3-4 correctas seguidas
    if (consecutiveCorrect >= 2) return 5;  // 2 correctas seguidas
    return 0;
  }

  // Registrar error
  registerError(): boolean {
    const game = this.currentGameSignal();
    if (!game) return false;

    const newErrorsCount = game.errorsCount + 1;
    const maxErrorsReached = newErrorsCount >= game.maxErrors;

    this.currentGameSignal.update(g => g ? {
      ...g,
      errorsCount: newErrorsCount,
      consecutiveCorrect: 0 // Resetear racha al fallar
    } : g);

    return maxErrorsReached; // Retorna true si se alcanzó el máximo de errores
  }

  // Registrar respuesta correcta (para racha)
  registerCorrectAnswer(): void {
    this.currentGameSignal.update(game => {
      if (!game) return game;
      return {
        ...game,
        consecutiveCorrect: game.consecutiveCorrect + 1
      };
    });
  }

  // Añadir puntos a un equipo
  addPoints(teamId: string, points: number): void {
    this.currentGameSignal.update(game => {
      if (!game) return game;

      return {
        ...game,
        scores: {
          ...game.scores,
          [teamId]: (game.scores[teamId] || 0) + points
        },
        teams: game.teams.map(t =>
          t.id === teamId ? { ...t, score: (t.score || 0) + points } : t
        )
      };
    });
  }

  // Siguiente pregunta
  nextQuestion(): boolean {
    const game = this.currentGameSignal();
    if (!game) return false;

    // Verificar si la pregunta fue perfecta (sin errores)
    const wasPerfect = game.errorsCount === 0;

    if (game.currentQuestionIndex >= game.questions.length - 1) {
      // Juego terminado
      this.endGame();
      return false;
    }

    this.currentGameSignal.update(g => g ? {
      ...g,
      currentQuestionIndex: g.currentQuestionIndex + 1,
      errorsCount: 0, // Resetear errores para la nueva pregunta
      perfectQuestions: wasPerfect ? g.perfectQuestions + 1 : g.perfectQuestions
    } : g);

    return true;
  }

  // Terminar juego
  endGame(): void {
    const game = this.currentGameSignal();
    if (!game) return;

    // Determinar ganador
    const sortedTeams = game.teams.sort((a, b) => (b.score || 0) - (a.score || 0));
    const winner = sortedTeams[0];

    // Actualizar rankings
    game.teams.forEach(team => {
      const won = team.id === winner.id;
      this.dataService.updateRanking(team.id, won, team.score || 0);
    });

    this.currentGameSignal.update(g => g ? {
      ...g,
      status: 'finished',
      endedAt: new Date()
    } : g);
  }

  // Reiniciar juego
  resetGame(): void {
    this.currentGameSignal.set(null);
  }

  // Obtener ganador
  getWinner(): Team | null {
    const game = this.currentGameSignal();
    if (!game || game.status !== 'finished') return null;

    return game.teams.reduce((prev, current) =>
      (current.score || 0) > (prev.score || 0) ? current : prev
    );
  }

  // Utilidades
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
