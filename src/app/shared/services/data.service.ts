import { Injectable, signal } from '@angular/core';
import { Question, Team, Ranking, Answer } from '../../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Signals para estado reactivo
  private questionsSignal = signal<Question[]>(this.loadQuestions());
  private teamsSignal = signal<Team[]>(this.loadTeams());
  private rankingsSignal = signal<Ranking[]>(this.loadRankings());

  // Exponer como readonly
  questions = this.questionsSignal.asReadonly();
  teams = this.teamsSignal.asReadonly();
  rankings = this.rankingsSignal.asReadonly();

  constructor() {
    // Cargar datos de ejemplo si no hay nada
    if (this.questionsSignal().length === 0) {
      this.initializeDefaultData();
    }
  }

  // ========== QUESTIONS ==========

  getQuestions(): Question[] {
    return this.questionsSignal();
  }

  getQuestion(id: string): Question | undefined {
    return this.questionsSignal().find(q => q.id === id);
  }

  addQuestion(question: Omit<Question, 'id' | 'createdAt'>): Question {
    const newQuestion: Question = {
      ...question,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.questionsSignal.update(questions => [...questions, newQuestion]);
    this.saveQuestions();
    return newQuestion;
  }

  updateQuestion(id: string, updates: Partial<Question>): boolean {
    const index = this.questionsSignal().findIndex(q => q.id === id);
    if (index === -1) return false;

    this.questionsSignal.update(questions => {
      const updated = [...questions];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    this.saveQuestions();
    return true;
  }

  deleteQuestion(id: string): boolean {
    const filtered = this.questionsSignal().filter(q => q.id !== id);
    if (filtered.length === this.questionsSignal().length) return false;

    this.questionsSignal.set(filtered);
    this.saveQuestions();
    return true;
  }

  // ========== TEAMS ==========

  getTeams(): Team[] {
    return this.teamsSignal();
  }

  getTeam(id: string): Team | undefined {
    return this.teamsSignal().find(t => t.id === id);
  }

  addTeam(team: Omit<Team, 'id'>): Team {
    const newTeam: Team = {
      ...team,
      id: this.generateId()
    };
    this.teamsSignal.update(teams => [...teams, newTeam]);
    this.saveTeams();
    return newTeam;
  }

  updateTeam(id: string, updates: Partial<Team>): boolean {
    const index = this.teamsSignal().findIndex(t => t.id === id);
    if (index === -1) return false;

    this.teamsSignal.update(teams => {
      const updated = [...teams];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    this.saveTeams();
    return true;
  }

  deleteTeam(id: string): boolean {
    const filtered = this.teamsSignal().filter(t => t.id !== id);
    if (filtered.length === this.teamsSignal().length) return false;

    this.teamsSignal.set(filtered);
    this.saveTeams();
    return true;
  }

  // ========== RANKINGS ==========

  getRankings(): Ranking[] {
    return this.rankingsSignal().sort((a, b) => b.totalPoints - a.totalPoints);
  }

  updateRanking(teamId: string, won: boolean, points: number): void {
    const index = this.rankingsSignal().findIndex(r => r.teamId === teamId);

    if (index === -1) {
      // Crear nuevo ranking
      const team = this.getTeam(teamId);
      if (!team) return;

      const newRanking: Ranking = {
        teamId,
        teamName: team.name,
        teamColor: team.color,
        gamesPlayed: 1,
        gamesWon: won ? 1 : 0,
        totalPoints: points,
        averagePoints: points
      };
      this.rankingsSignal.update(rankings => [...rankings, newRanking]);
    } else {
      // Actualizar ranking existente
      this.rankingsSignal.update(rankings => {
        const updated = [...rankings];
        const ranking = updated[index];
        ranking.gamesPlayed++;
        if (won) ranking.gamesWon++;
        ranking.totalPoints += points;
        ranking.averagePoints = ranking.totalPoints / ranking.gamesPlayed;
        return updated;
      });
    }
    this.saveRankings();
  }

  // ========== PERSISTENCE ==========

  private loadQuestions(): Question[] {
    const data = localStorage.getItem('100jas_questions');
    return data ? JSON.parse(data) : [];
  }

  private saveQuestions(): void {
    localStorage.setItem('100jas_questions', JSON.stringify(this.questionsSignal()));
  }

  private loadTeams(): Team[] {
    const data = localStorage.getItem('100jas_teams');
    return data ? JSON.parse(data) : [];
  }

  private saveTeams(): void {
    localStorage.setItem('100jas_teams', JSON.stringify(this.teamsSignal()));
  }

  private loadRankings(): Ranking[] {
    const data = localStorage.getItem('100jas_rankings');
    return data ? JSON.parse(data) : [];
  }

  private saveRankings(): void {
    localStorage.setItem('100jas_rankings', JSON.stringify(this.rankingsSignal()));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ========== INITIAL DATA ==========

  private initializeDefaultData(): void {
    // Preguntas de ejemplo
    const sampleQuestions: Question[] = [
      {
        id: this.generateId(),
        text: '¿Nombre algo que la gente hace en la playa?',
        category: 'Playa',
        answers: [
          { id: '1', text: 'Nadar', points: 40, order: 1 },
          { id: '2', text: 'Tomar el sol', points: 30, order: 2 },
          { id: '3', text: 'Jugar voleibol', points: 15, order: 3 },
          { id: '4', text: 'Construir castillos de arena', points: 10, order: 4 },
          { id: '5', text: 'Surfear', points: 5, order: 5 }
        ],
        createdAt: new Date()
      },
      {
        id: this.generateId(),
        text: '¿Qué compras en el supermercado cada semana?',
        category: 'Compras',
        answers: [
          { id: '1', text: 'Pan', points: 35, order: 1 },
          { id: '2', text: 'Leche', points: 25, order: 2 },
          { id: '3', text: 'Frutas', points: 20, order: 3 },
          { id: '4', text: 'Huevos', points: 12, order: 4 },
          { id: '5', text: 'Arroz', points: 8, order: 5 }
        ],
        createdAt: new Date()
      }
    ];

    // Equipos de ejemplo
    const sampleTeams: Team[] = [
      { id: this.generateId(), name: 'Equipo Rojo', color: '#ef4444', members: 0 },
      { id: this.generateId(), name: 'Equipo Azul', color: '#3b82f6', members: 0 },
      { id: this.generateId(), name: 'Equipo Verde', color: '#10b981', members: 0 }
    ];

    this.questionsSignal.set(sampleQuestions);
    this.teamsSignal.set(sampleTeams);
    this.saveQuestions();
    this.saveTeams();
  }
}
