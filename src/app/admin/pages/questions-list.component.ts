import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { SoundService } from '../../shared/services/sound.service';
import { Question } from '../../models/game.models';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <h2 class="text-3xl font-bold text-primary">Preguntas</h2>
          <span class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
            {{ questions().length }} {{ questions().length === 1 ? 'pregunta' : 'preguntas' }}
          </span>
        </div>
        <div class="flex gap-3">
          <button (click)="triggerFileInput()" (mouseenter)="soundService.hover()" class="px-4 py-2 bg-secondary text-white rounded glow-cyan">
            📄 Importar .md
          </button>
          <button (click)="toggleAddForm()" (mouseenter)="soundService.hover()" class="px-4 py-2 bg-primary text-white rounded glow-pink">
            {{ showAddForm ? 'Cancelar' : '+ Nueva Pregunta' }}
          </button>
        </div>
      </div>

      <!-- Hidden file input -->
      <input
        type="file"
        #fileInput
        accept=".md"
        (change)="onFileSelected($event)"
        class="hidden"
      />

      <!-- Import status message -->
      @if (importMessage) {
        <div class="p-4 rounded-lg" [class]="importMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
          {{ importMessage.text }}
        </div>
      }

      @if (showAddForm) {
        <div class="p-6 rounded-lg border border-primary bg-gray-900/70">
          <h3 class="text-xl font-bold mb-4">Nueva Pregunta</h3>
          <div class="space-y-4">
            <input type="text" placeholder="Pregunta..." #questionInput
              class="w-full px-4 py-2 bg-gray-800 rounded text-white border border-gray-700">

            <div class="space-y-2">
              @for (answer of newAnswers; track $index) {
                <div class="flex gap-2">
                  <input type="text" placeholder="Respuesta {{$index + 1}}"
                    class="flex-1 px-4 py-2 bg-gray-800 rounded text-white border border-gray-700"
                    [(ngModel)]="answer.text">
                  <input type="number" placeholder="Puntos"
                    class="w-24 px-4 py-2 bg-gray-800 rounded text-white border border-gray-700"
                    [(ngModel)]="answer.points">
                </div>
              }
            </div>

            <div class="flex gap-2">
              <button (click)="addAnswerField()" (mouseenter)="soundService.hover()" class="px-4 py-2 bg-gray-700 rounded">+ Respuesta</button>
              <button (click)="saveQuestion(questionInput.value)" (mouseenter)="soundService.hover()" class="px-4 py-2 bg-primary rounded">Guardar</button>
            </div>
          </div>
        </div>
      }

      <div class="space-y-4">
        @if (questions().length === 0) {
          <div class="p-8 rounded-lg border border-gray-700 bg-gray-900/50 text-center">
            <p class="text-xl text-gray-400 mb-4">📝 No hay preguntas disponibles</p>
            <p class="text-sm text-gray-500">
              Crea una nueva pregunta o importa un archivo .md para comenzar
            </p>
          </div>
        }
        @for (question of questions(); track question.id) {
          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-semibold">{{question.text}}</h3>
              <button (click)="deleteQuestion(question.id)" (mouseenter)="soundService.hover()" class="text-red-500 hover:text-red-400">
                🗑️
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              @for (answer of question.answers; track answer.id) {
                <div class="px-3 py-2 bg-gray-800/50 rounded flex justify-between">
                  <span>{{answer.text}}</span>
                  <span class="text-accent font-bold">{{answer.points}} pts</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class QuestionsListComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  dataService = inject(DataService);
  soundService = inject(SoundService);
  questions = this.dataService.questions;

  showAddForm = false;
  importMessage: { type: 'success' | 'error'; text: string } | null = null;
  newAnswers: Array<{text: string, points: number}> = [
    {text: '', points: 40},
    {text: '', points: 30},
    {text: '', points: 20}
  ];

  toggleAddForm() {
    this.soundService.click();
    this.showAddForm = !this.showAddForm;
  }

  addAnswerField() {
    this.soundService.click();
    this.newAnswers.push({text: '', points: 10});
  }

  saveQuestion(text: string) {
    if (!text.trim()) {
      console.warn('Pregunta vacía, no se guardará');
      return;
    }

    console.log('Guardando pregunta:', text);
    console.log('Respuestas actuales:', this.newAnswers);

    const answers = this.newAnswers
      .filter(a => a.text.trim())
      .map((a, i) => ({
        id: `${Date.now()}-${i}`,
        text: a.text.trim(),
        points: Number(a.points) || 0,
        order: i + 1
      }));

    console.log('Respuestas procesadas:', answers);

    if (answers.length === 0) {
      console.warn('No hay respuestas válidas');
      return;
    }

    const questionData = {
      text: text.trim(),
      answers
    };

    console.log('Datos a guardar:', questionData);

    const savedQuestion = this.dataService.addQuestion(questionData);

    console.log('Pregunta guardada:', savedQuestion);
    console.log('Preguntas en signal:', this.dataService.getQuestions());

    this.soundService.correctAnswer(); // Success sound
    this.showAddForm = false;
    this.newAnswers = [{text: '', points: 40}, {text: '', points: 30}, {text: '', points: 20}];
  }

  deleteQuestion(id: string) {
    if (confirm('¿Eliminar esta pregunta?')) {
      this.soundService.click();
      this.dataService.deleteQuestion(id);
    }
  }

  triggerFileInput() {
    this.soundService.click();
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file type
    if (!file.name.endsWith('.md')) {
      this.showImportMessage('error', 'Por favor selecciona un archivo .md válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.parseMarkdownQuestions(content);
    };
    reader.onerror = () => {
      this.showImportMessage('error', 'Error al leer el archivo');
    };
    reader.readAsText(file);

    // Clear the input so the same file can be selected again
    input.value = '';
  }

  parseMarkdownQuestions(content: string) {
    try {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line);
      let currentQuestion: string | null = null;
      let currentAnswers: Array<{ text: string; points: number }> = [];
      let questionsAdded = 0;

      for (const line of lines) {
        // Check if line is a question (starts with #)
        if (line.startsWith('#')) {
          // Save previous question if exists
          if (currentQuestion && currentAnswers.length > 0) {
            this.addParsedQuestion(currentQuestion, currentAnswers);
            questionsAdded++;
          }

          // Start new question
          currentQuestion = line.replace(/^#+\s*/, '').trim();
          currentAnswers = [];
        }
        // Check if line is an answer (starts with - or *)
        else if (line.startsWith('-') || line.startsWith('*')) {
          const answerLine = line.replace(/^[-*]\s*/, '').trim();

          // Parse format: "Answer text | points"
          const parts = answerLine.split('|').map(p => p.trim());

          if (parts.length === 2) {
            const text = parts[0];
            const points = parseInt(parts[1]);

            if (text && !isNaN(points)) {
              currentAnswers.push({ text, points });
            }
          } else if (parts.length === 1) {
            // Default points if not specified
            currentAnswers.push({
              text: parts[0],
              points: 40 - (currentAnswers.length * 10)
            });
          }
        }
      }

      // Save last question
      if (currentQuestion && currentAnswers.length > 0) {
        this.addParsedQuestion(currentQuestion, currentAnswers);
        questionsAdded++;
      }

      if (questionsAdded > 0) {
        this.soundService.correctAnswer();
        this.showImportMessage('success', `✅ ${questionsAdded} pregunta(s) importada(s) correctamente`);
      } else {
        this.showImportMessage('error', 'No se encontraron preguntas válidas en el archivo');
      }
    } catch (error) {
      console.error('Error parsing markdown:', error);
      this.showImportMessage('error', 'Error al procesar el archivo. Verifica el formato.');
    }
  }

  private addParsedQuestion(questionText: string, answers: Array<{ text: string; points: number }>) {
    const formattedAnswers = answers.map((a, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      text: a.text,
      points: a.points,
      order: i + 1
    }));

    this.dataService.addQuestion({
      text: questionText,
      answers: formattedAnswers
    });
  }

  private showImportMessage(type: 'success' | 'error', text: string) {
    this.importMessage = { type, text };
    setTimeout(() => {
      this.importMessage = null;
    }, 5000);
  }
}
