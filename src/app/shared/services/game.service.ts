import { Injectable, signal } from '@angular/core';
import { GameSession, Question, Team } from '../../models/game.models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly STORAGE_KEY = '100jas_current_game';
  private currentGameSignal = signal<GameSession | null>(null);
  currentGame = this.currentGameSignal.asReadonly();

  constructor(private dataService: DataService) {
    // Cargar juego guardado si existe
    this.loadGame();

    // Escuchar cambios de otras ventanas
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.STORAGE_KEY && event.newValue) {
          try {
            const game = JSON.parse(event.newValue) as GameSession;
            this.currentGameSignal.set(game);
          } catch (e) {
            console.error('Error loading game from storage:', e);
          }
        }
      });
    }
  }

  private loadGame(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const game = JSON.parse(stored) as GameSession;
        this.currentGameSignal.set(game);
      } catch (e) {
        console.error('Error loading game:', e);
      }
    }
  }

  private saveGame(): void {
    if (typeof window === 'undefined') return;

    const game = this.currentGameSignal();
    if (game) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(game));
      } catch (e) {
        console.error('Error saving game:', e);
      }
    }
  }

  // Iniciar nuevo juego
  startGame(teamIds: string[], questionCount: number = 5, category?: string): GameSession | null {
    // Usar el sistema de tracking de uso para obtener preguntas
    const availableQuestions = this.dataService.getAvailableQuestions({
      category,
      excludeRecentDays: 7,
      minRequired: questionCount
    });

    if (availableQuestions.length < questionCount) {
      console.error('No hay suficientes preguntas disponibles');
      return null;
    }

    const teams = teamIds
      .map(id => this.dataService.getTeam(id))
      .filter((t): t is Team => t !== undefined);

    if (teams.length < 2) {
      console.error('Se necesitan al menos 2 equipos');
      return null;
    }

    // Seleccionar preguntas (ya ordenadas por menor uso)
    const selectedQuestions = availableQuestions.slice(0, questionCount);

    // Inicializar contadores de errores y rachas por equipo
    const teamErrorsCount: { [teamId: string]: number } = {};
    const teamConsecutiveCorrect: { [teamId: string]: number } = {};
    teams.forEach(team => {
      teamErrorsCount[team.id] = 0;
      teamConsecutiveCorrect[team.id] = 0;
    });

    const gameSession: GameSession = {
      id: this.generateId(),
      teams: teams.map(t => ({ ...t, score: 0 })),
      currentQuestionIndex: 0,
      questions: selectedQuestions,
      scores: teams.reduce((acc, team) => ({ ...acc, [team.id]: 0 }), {}),
      status: 'playing',
      startedAt: new Date(),
      teamErrorsCount,
      maxErrors: 3,
      teamConsecutiveCorrect,
      perfectQuestions: 0
    };

    this.currentGameSignal.set(gameSession);
    this.saveGame();
    return gameSession;
  }

  // Obtener pregunta actual
  getCurrentQuestion(): Question | null {
    const game = this.currentGameSignal();
    if (!game || game.status !== 'playing') return null;
    return game.questions[game.currentQuestionIndex] || null;
  }

  // Verificar respuesta
  checkAnswer(answerText: string, teamId: string): { correct: boolean; points: number; answerId?: string; bonus?: number } {
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
      const streakBonus = this.calculateStreakBonus(teamId);
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
  calculateStreakBonus(teamId: string): number {
    const game = this.currentGameSignal();
    if (!game) return 0;

    const consecutiveCorrect = game.teamConsecutiveCorrect[teamId] || 0;
    if (consecutiveCorrect >= 5) return 20; // 5+ correctas seguidas
    if (consecutiveCorrect >= 3) return 10; // 3-4 correctas seguidas
    if (consecutiveCorrect >= 2) return 5;  // 2 correctas seguidas
    return 0;
  }

  // Reiniciar errores de un equipo específico
  resetTeamErrors(teamId: string): void {
    this.currentGameSignal.update(game => {
      if (!game) return game;
      return {
        ...game,
        teamErrorsCount: {
          ...game.teamErrorsCount,
          [teamId]: 0
        },
        teamConsecutiveCorrect: {
          ...game.teamConsecutiveCorrect,
          [teamId]: 0
        }
      };
    });
    this.saveGame();
  }

  // Registrar error para un equipo
  registerError(teamId: string): boolean {
    const game = this.currentGameSignal();
    if (!game) return false;

    const currentErrorsCount = game.teamErrorsCount[teamId] || 0;
    const newErrorsCount = currentErrorsCount + 1;
    const maxErrorsReached = newErrorsCount >= game.maxErrors;

    this.currentGameSignal.update(g => g ? {
      ...g,
      teamErrorsCount: {
        ...g.teamErrorsCount,
        [teamId]: newErrorsCount
      },
      teamConsecutiveCorrect: {
        ...g.teamConsecutiveCorrect,
        [teamId]: 0 // Resetear racha al fallar
      }
    } : g);

    this.saveGame();
    return maxErrorsReached; // Retorna true si se alcanzó el máximo de errores
  }

  // Obtener penalización por error
  getErrorPenalty(teamId: string): number {
    const game = this.currentGameSignal();
    if (!game) return 0;

    // Penalización progresiva: 5, 10, 15 puntos
    const errorCount = game.teamErrorsCount[teamId] || 0;
    return errorCount === 0 ? 5 : errorCount * 5;
  }

  // Registrar respuesta correcta (para racha)
  registerCorrectAnswer(teamId: string): void {
    this.currentGameSignal.update(game => {
      if (!game) return game;
      return {
        ...game,
        teamConsecutiveCorrect: {
          ...game.teamConsecutiveCorrect,
          [teamId]: (game.teamConsecutiveCorrect[teamId] || 0) + 1
        }
      };
    });
    this.saveGame();
  }

  // Añadir puntos a un equipo
  addPoints(teamId: string, points: number): void {
    this.currentGameSignal.update(game => {
      if (!game) return game;

      // Calcular nueva puntuación, asegurando que no sea negativa
      const currentScore = game.scores[teamId] || 0;
      const newScore = Math.max(0, currentScore + points);

      return {
        ...game,
        scores: {
          ...game.scores,
          [teamId]: newScore
        },
        teams: game.teams.map(t =>
          t.id === teamId ? { ...t, score: newScore } : t
        )
      };
    });
    this.saveGame();
  }

  // Siguiente pregunta
  nextQuestion(): boolean {
    const game = this.currentGameSignal();
    if (!game) return false;

    // Verificar si la pregunta fue perfecta (sin errores para todos los equipos)
    const wasPerfect = game.teams.every(team => !game.teamErrorsCount[team.id] || game.teamErrorsCount[team.id] === 0);

    if (game.currentQuestionIndex >= game.questions.length - 1) {
      // Juego terminado
      this.endGame();
      return false;
    }

    // Inicializar nuevos contadores de errores por equipo
    const newTeamErrorsCount: { [teamId: string]: number } = {};
    const newTeamConsecutiveCorrect: { [teamId: string]: number } = {};
    game.teams.forEach(team => {
      newTeamErrorsCount[team.id] = 0;
      newTeamConsecutiveCorrect[team.id] = 0;
    });

    this.currentGameSignal.update(g => g ? {
      ...g,
      currentQuestionIndex: g.currentQuestionIndex + 1,
      teamErrorsCount: newTeamErrorsCount,
      teamConsecutiveCorrect: newTeamConsecutiveCorrect,
      perfectQuestions: wasPerfect ? g.perfectQuestions + 1 : g.perfectQuestions
    } : g);

    this.saveGame();
    return true;
  }

  // Terminar juego
  endGame(): void {
    const game = this.currentGameSignal();
    if (!game) return;

    // Marcar preguntas como usadas
    const questionIds = game.questions.map(q => q.id);
    this.dataService.markQuestionsAsUsed(questionIds);

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

    this.saveGame();
  }

  // Reiniciar juego
  resetGame(): void {
    this.currentGameSignal.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
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
