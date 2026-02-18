// Modelos de datos para la aplicación

export interface Question {
  id: string;
  text: string;
  category?: string;
  answers: Answer[];
  createdAt: Date;
  usageCount?: number; // Número de veces que se ha usado
  lastUsedAt?: Date; // Última vez que se usó
}

export interface Answer {
  id: string;
  text: string;
  points: number;
  order: number; // 1 = más común
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members?: number;
  score?: number;
}

export interface GameSession {
  id: string;
  teams: Team[];
  currentQuestionIndex: number;
  questions: Question[];
  scores: { [teamId: string]: number };
  status: 'lobby' | 'playing' | 'finished';
  startedAt?: Date;
  endedAt?: Date;
  errorsCount: number; // Errores en la pregunta actual
  maxErrors: number; // Máximo de errores permitidos por pregunta
  consecutiveCorrect: number; // Racha de respuestas correctas
  perfectQuestions: number; // Preguntas completadas sin errores
}

export interface Ranking {
  teamId: string;
  teamName: string;
  teamColor: string;
  gamesPlayed: number;
  gamesWon: number;
  totalPoints: number;
  averagePoints: number;
}
