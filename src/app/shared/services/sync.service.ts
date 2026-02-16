import { Injectable, signal } from '@angular/core';

export interface GameSyncState {
  revealedAnswers: string[];
  currentQuestionId: string | null;
  currentTeamIndex: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly STORAGE_KEY = '100jas_game_sync';
  private syncState = signal<GameSyncState>({
    revealedAnswers: [],
    currentQuestionId: null,
    currentTeamIndex: 0,
    timestamp: Date.now()
  });

  state = this.syncState.asReadonly();

  constructor() {
    this.loadState();

    // Escuchar cambios de otras ventanas
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.STORAGE_KEY && event.newValue) {
          try {
            const newState = JSON.parse(event.newValue) as GameSyncState;
            this.syncState.set(newState);
          } catch (e) {
            console.error('Error parsing sync state:', e);
          }
        }
      });
    }
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (this.isValidState(parsed)) {
          this.syncState.set(parsed);
        }
      } catch (e) {
        console.error('Error loading sync state:', e);
        this.reset();
      }
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;

    const state = this.syncState();
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving sync state:', e);
    }
  }

  private isValidState(obj: any): obj is GameSyncState {
    return obj &&
      Array.isArray(obj.revealedAnswers) &&
      typeof obj.timestamp === 'number';
  }

  // Revelar respuesta
  revealAnswer(answerId: string): void {
    this.syncState.update(state => {
      if (state.revealedAnswers.includes(answerId)) return state;

      return {
        ...state,
        revealedAnswers: [...state.revealedAnswers, answerId],
        timestamp: Date.now()
      };
    });
    this.saveState();
  }

  // Revelar todas las respuestas
  revealAll(answerIds: string[]): void {
    this.syncState.update(state => ({
      ...state,
      revealedAnswers: answerIds,
      timestamp: Date.now()
    }));
    this.saveState();
  }

  // Cambiar pregunta (resetea respuestas reveladas)
  setCurrentQuestion(questionId: string): void {
    this.syncState.update(state => ({
      ...state,
      currentQuestionId: questionId,
      revealedAnswers: [],
      timestamp: Date.now()
    }));
    this.saveState();
  }

  // Cambiar equipo actual
  setCurrentTeam(teamIndex: number): void {
    this.syncState.update(state => ({
      ...state,
      currentTeamIndex: teamIndex,
      timestamp: Date.now()
    }));
    this.saveState();
  }

  // Verificar si una respuesta está revelada
  isAnswerRevealed(answerId: string): boolean {
    return this.syncState().revealedAnswers.includes(answerId);
  }

  // Reset completo
  reset(): void {
    this.syncState.set({
      revealedAnswers: [],
      currentQuestionId: null,
      currentTeamIndex: 0,
      timestamp: Date.now()
    });
    this.saveState();
  }
}
