import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { GameSession, Team } from '../../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  /**
   * Export game results as PNG image
   */
  async exportGameResults(gameSession: GameSession): Promise<void> {
    try {
      console.log('ExportService: Starting export with session:', gameSession);

      // Create the HTML element with results
      const resultsElement = this.createResultsHTML(gameSession);

      // Append to body (hidden)
      document.body.appendChild(resultsElement);

      // Wait a frame for rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('ExportService: Converting to canvas...');

      // Convert to canvas
      const canvas = await html2canvas(resultsElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        width: 800,
        height: 900
      });

      console.log('ExportService: Canvas created, dimensions:', canvas.width, 'x', canvas.height);

      // Remove the temporary element
      document.body.removeChild(resultsElement);

      console.log('ExportService: Downloading image...');

      // Download the image
      this.downloadImage(canvas, `100JAS-Results-${this.formatDate(new Date())}.png`);

      console.log('ExportService: Export complete!');
    } catch (error) {
      console.error('Error exporting results:', error);
      throw error;
    }
  }

  /**
   * Create HTML element with game results
   */
  private createResultsHTML(gameSession: GameSession): HTMLElement {
    console.log('Creating results HTML for session:', gameSession);

    const container = document.createElement('div');
    container.style.cssText = `
      width: 800px;
      height: 900px;
      background: #ffffff;
      padding: 50px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #111111;
      position: absolute;
      left: -10000px;
      top: 0;
    `;

    // Get sorted teams
    const allTeamsSorted = [...gameSession.teams].sort((a, b) => (b.score || 0) - (a.score || 0));
    const winner = allTeamsSorted[0];

    console.log('Winner:', winner);
    console.log('All teams sorted:', allTeamsSorted);

    // Header
    const header = `
      <div style="text-align: center; margin-bottom: 50px;">
        <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 10px 0; color: #111111; letter-spacing: -0.5px;">
          RESULTADOS DEL JUEGO
        </h1>
        <p style="font-size: 16px; font-weight: 400; color: #666666; margin: 0;">
          ${this.formatDate(gameSession.endedAt || new Date())}
        </p>
      </div>
    `;

    // Winner section
    const winnerHTML = `
      <div style="margin-bottom: 50px; padding-bottom: 40px; border-bottom: 1px solid #e5e7eb;">
        <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; color: #999999; margin: 0 0 25px 0; text-align: center;">
          GANADOR
        </p>
        <div style="text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <div style="width: 4px; height: 4px; background: ${winner.color}; border-radius: 50%;"></div>
            <span style="font-size: 28px; font-weight: 700; color: #111111;">${winner.name}</span>
          </div>
          <p style="font-size: 24px; font-weight: 500; color: #666666; margin: 0;">
            ${winner.score || 0} puntos
          </p>
        </div>
      </div>
    `;

    // Full standings
    let standingsHTML = '<div>';
    standingsHTML += '<p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; color: #999999; margin: 0 0 25px 0;">CLASIFICACIÓN</p>';

    allTeamsSorted.forEach((team, index) => {
      const borderBottom = index < allTeamsSorted.length - 1 ? 'border-bottom: 1px solid #f5f5f5;' : '';
      standingsHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; ${borderBottom}">
          <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 18px; font-weight: 400; color: #999999; min-width: 25px;">${index + 1}</span>
            <div style="width: 4px; height: 4px; background: ${team.color}; border-radius: 50%;"></div>
            <span style="font-size: 18px; font-weight: 500; color: #111111;">${team.name}</span>
          </div>
          <span style="font-size: 18px; font-weight: 500; color: #666666;">${team.score || 0} pts</span>
        </div>
      `;
    });

    standingsHTML += '</div>';

    // Footer
    const footer = `
      <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; font-weight: 400; color: #999999; margin: 0;">
          100 JAS Dicen
        </p>
      </div>
    `;

    container.innerHTML = header + winnerHTML + standingsHTML + footer;
    return container;
  }

  /**
   * Get top 3 teams sorted by score
   */
  private getTopThree(teams: Team[]): Team[] {
    return [...teams]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3);
  }

  /**
   * Download canvas as PNG image
   */
  private downloadImage(canvas: HTMLCanvasElement, filename: string): void {
    try {
      console.log('Converting canvas to blob...');
      canvas.toBlob(blob => {
        if (blob) {
          console.log('Blob created, size:', blob.size, 'bytes');
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          console.log('Triggering download:', filename);
          link.click();
          URL.revokeObjectURL(url);
          console.log('Download triggered successfully');
        } else {
          console.error('Failed to create blob from canvas');
          throw new Error('Failed to create blob from canvas');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error in downloadImage:', error);
      throw error;
    }
  }

  /**
   * Format date as string
   */
  private formatDate(date: Date | string | undefined, includeTime: boolean = false): string {
    // Handle undefined or null
    if (!date) {
      return this.formatDate(new Date(), includeTime);
    }

    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Validate date
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return this.formatDate(new Date(), includeTime);
    }

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    if (includeTime) {
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    return `${day}/${month}/${year}`;
  }
}
