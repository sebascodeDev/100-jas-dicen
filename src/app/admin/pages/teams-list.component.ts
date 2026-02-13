import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { SoundService } from '../../shared/services/sound.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold text-secondary">Equipos</h2>
        <button (click)="toggleAddForm()" (mouseenter)="soundService.hover()" class="px-4 py-2 bg-secondary text-white rounded glow-cyan">
          {{ showAddForm ? 'Cancelar' : '+ Nuevo Equipo' }}
        </button>
      </div>

      @if (showAddForm) {
        <div class="p-6 rounded-lg border border-secondary bg-gray-900/70">
          <h3 class="text-xl font-bold mb-4">Nuevo Equipo</h3>
          <div class="space-y-4">
            <input type="text" placeholder="Nombre del equipo..." [(ngModel)]="newTeam.name"
              class="w-full px-4 py-2 bg-gray-800 rounded text-white border border-gray-700">

            <div class="flex gap-4 items-center">
              <label class="text-gray-300">Color:</label>
              <input type="color" [(ngModel)]="newTeam.color"
                class="w-20 h-10 bg-gray-800 rounded border border-gray-700 cursor-pointer">
              <span class="px-4 py-2 rounded text-white" [style.background-color]="newTeam.color">
                {{newTeam.color}}
              </span>
            </div>

            <button (click)="saveTeam()" (mouseenter)="soundService.hover()" class="px-4 py-2 bg-secondary rounded text-white">
              Guardar Equipo
            </button>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (team of teams(); track team.id) {
          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 hover:border-secondary transition-all">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full" [style.background-color]="team.color"></div>
                <h3 class="text-xl font-semibold">{{team.name}}</h3>
              </div>
              <button (click)="deleteTeam(team.id)" (mouseenter)="soundService.hover()" class="text-red-500 hover:text-red-400">
                🗑️
              </button>
            </div>

            <div class="text-sm text-gray-400">
              Color: <span class="font-mono">{{team.color}}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class TeamsListComponent {
  dataService = inject(DataService);
  soundService = inject(SoundService);
  teams = this.dataService.teams;

  showAddForm = false;
  newTeam = { name: '', color: '#3b82f6' };

  toggleAddForm() {
    this.soundService.click();
    this.showAddForm = !this.showAddForm;
  }

  saveTeam() {
    if (!this.newTeam.name.trim()) return;

    this.dataService.addTeam({
      name: this.newTeam.name.trim(),
      color: this.newTeam.color,
      members: 0
    });

    this.soundService.correctAnswer(); // Success sound
    this.showAddForm = false;
    this.newTeam = { name: '', color: '#3b82f6' };
  }

  deleteTeam(id: string) {
    if (confirm('¿Eliminar este equipo?')) {
      this.soundService.click();
      this.dataService.deleteTeam(id);
    }
  }
}
