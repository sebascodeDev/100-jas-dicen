import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../services/export.service';
import { SoundService } from '../services/sound.service';
import { GameSession } from '../../models/game.models';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="exportResults()"
      (mouseenter)="soundService.hover()"
      [disabled]="isExporting() || !gameSession"
      [class]="getButtonClass()"
      class="px-8 py-4 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none disabled:opacity-50 flex items-center gap-3 justify-center min-w-[250px]"
    >
      @if (isExporting()) {
        <span class="animate-spin">⏳</span>
        <span>Generando...</span>
      } @else if (exportSuccess()) {
        <span>✅</span>
        <span>¡Descargado!</span>
      } @else if (exportError()) {
        <span>❌</span>
        <span>Error - Reintentar</span>
      } @else {
        <span>📥</span>
        <span>Descargar Resultados (PNG)</span>
      }
    </button>

    @if (exportSuccess()) {
      <p class="text-center text-green-400 text-sm mt-2">
        ✨ Imagen descargada exitosamente
      </p>
    }

    @if (exportError()) {
      <p class="text-center text-red-400 text-sm mt-2">
        ⚠️ Error al generar la imagen. Intenta nuevamente.
      </p>
    }
  `,
  styles: []
})
export class ExportButtonComponent {
  @Input() gameSession: GameSession | null = null;

  private exportService = inject(ExportService);
  soundService = inject(SoundService);

  isExporting = signal(false);
  exportSuccess = signal(false);
  exportError = signal(false);

  async exportResults(): Promise<void> {
    if (!this.gameSession || this.isExporting()) {
      return;
    }

    // Reset states
    this.isExporting.set(true);
    this.exportSuccess.set(false);
    this.exportError.set(false);

    try {
      this.soundService.click();

      // Export the results
      await this.exportService.exportGameResults(this.gameSession);

      // Success
      this.isExporting.set(false);
      this.exportSuccess.set(true);
      this.soundService.correctAnswer();

      // Reset success message after 5 seconds
      setTimeout(() => {
        this.exportSuccess.set(false);
      }, 5000);
    } catch (error) {
      console.error('Export error:', error);
      this.isExporting.set(false);
      this.exportError.set(true);
      this.soundService.incorrectAnswer();

      // Reset error message after 5 seconds
      setTimeout(() => {
        this.exportError.set(false);
      }, 5000);
    }
  }

  getButtonClass(): string {
    if (this.isExporting()) {
      return 'bg-gray-600 cursor-wait';
    }

    if (this.exportSuccess()) {
      return 'bg-green-600 glow-green';
    }

    if (this.exportError()) {
      return 'bg-red-600';
    }

    return 'bg-secondary glow-cyan hover:bg-cyan-600';
  }
}
