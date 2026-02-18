import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext | null = null;
  private isMuted = false;

  constructor() {
    // Initialize AudioContext on first user interaction
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  private play(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3): void {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    // Clean up nodes after sound finishes to prevent memory leaks
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  // Sound effect for correct answer reveal
  correctAnswer(): void {
    if (!this.audioContext || this.isMuted) return;

    // Pleasant ascending chime
    const now = this.audioContext.currentTime;
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.frequency.value = 523.25; // C5
    oscillator2.frequency.value = 659.25; // E5
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 0.4);
    oscillator2.stop(now + 0.4);

    // Clean up nodes after sound finishes
    oscillator1.onended = () => {
      oscillator1.disconnect();
      oscillator2.disconnect();
      gainNode.disconnect();
    };
  }

  // Sound effect for incorrect answer
  incorrectAnswer(): void {
    if (!this.audioContext || this.isMuted) return;

    // Buzzer sound
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 100;
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);

    // Clean up nodes after sound finishes
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  // Sound effect for revealing an answer
  revealAnswer(): void {
    if (!this.audioContext || this.isMuted) return;

    // Whoosh sound
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);

    // Clean up nodes after sound finishes
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  // Sound effect for game start
  gameStart(): void {
    if (!this.audioContext || this.isMuted) return;

    // Fanfare sound
    const now = this.audioContext.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C chord

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + index * 0.1;
      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);

      // Clean up nodes after sound finishes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });
  }

  // Sound effect for winner announcement
  winner(): void {
    if (!this.audioContext || this.isMuted) return;

    // Victory fanfare
    const now = this.audioContext.currentTime;
    const melody = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.15 },  // E5
      { freq: 783.99, time: 0.3 },   // G5
      { freq: 1046.50, time: 0.45 }  // C6
    ];

    melody.forEach(note => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine';

      const startTime = now + note.time;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);

      // Clean up nodes after sound finishes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });
  }

  // Sound effect for button click
  click(): void {
    this.play(800, 0.05, 'sine', 0.15);
  }

  // Sound effect for question change
  newQuestion(): void {
    if (!this.audioContext || this.isMuted) return;

    // Rising tone
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.3);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);

    // Clean up nodes after sound finishes
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  // Sound effect for revealing all answers
  revealAll(): void {
    if (!this.audioContext || this.isMuted) return;

    // Dramatic reveal
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(1000, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.5);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);

    // Clean up nodes after sound finishes
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  // Sound effect for hover
  hover(): void {
    this.play(600, 0.03, 'sine', 0.08);
  }

  // Sound effect for adding points
  addPoints(): void {
    if (!this.audioContext || this.isMuted) return;

    // Cash register sound
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 880;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);

    // Clean up nodes after sound finishes
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  // Sound effect for streak bonus
  addBonus(): void {
    if (!this.audioContext || this.isMuted) return;

    // Arpeggio ascendente (C5-E5-G5)
    const now = this.audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + i * 0.05;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);

      // Clean up nodes after sound finishes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });
  }

  // Sound effect for maximum errors reached
  maxErrors(): void {
    if (!this.audioContext || this.isMuted) return;

    // Sonido dramático descendente
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.8);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    oscillator.start(now);
    oscillator.stop(now + 0.8);

    // Clean up nodes after sound finishes
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }
}
