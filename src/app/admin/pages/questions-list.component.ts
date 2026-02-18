import { Component, inject, ElementRef, ViewChild, computed, signal } from '@angular/core';
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
            {{ filteredQuestions().length }} {{ filteredQuestions().length === 1 ? 'pregunta' : 'preguntas' }}
          </span>
          @if (selectedQuestionIds().length > 0) {
            <span class="px-3 py-1 bg-pink-600 text-white rounded-full text-sm font-semibold">
              {{ selectedQuestionIds().length }} seleccionada(s)
            </span>
          }
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

      <!-- Import/Duplicate status message -->
      @if (importMessage) {
        <div class="p-4 rounded-lg" [class]="importMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : importMessage.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'">
          {{ importMessage.text }}
        </div>
      }

      <!-- Preview Modal -->
      @if (showPreview()) {
        <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div class="bg-gray-900 rounded-lg border-2 border-primary max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="p-6 border-b border-gray-700">
              <h2 class="text-2xl font-bold text-primary">Vista Previa de Importación</h2>
              <p class="text-gray-400 mt-2">{{ previewQuestions().length }} pregunta(s) encontrada(s)</p>
            </div>

            <!-- Category Selection -->
            <div class="p-6 border-b border-gray-700 bg-gray-800/50">
              <h3 class="text-lg font-semibold mb-3">Asignar Categoría</h3>
              <div class="flex gap-3">
                <select
                  [(ngModel)]="previewCategoryOption"
                  (change)="onPreviewCategoryChange()"
                  class="flex-1 px-4 py-2 bg-gray-800 rounded text-white border border-gray-700"
                >
                  <option value="">Sin categoría</option>
                  <option value="_custom">+ Nueva categoría...</option>
                  @for (category of availableCategories(); track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
                @if (previewCategoryOption === '_custom') {
                  <input
                    type="text"
                    placeholder="Nombre de la nueva categoría"
                    [(ngModel)]="previewCustomCategory"
                    class="flex-1 px-4 py-2 bg-gray-800 rounded text-white border border-gray-700"
                  />
                }
              </div>
            </div>

            <!-- Questions Preview List -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              @for (question of previewQuestions(); track $index) {
                <div class="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
                  <div class="flex items-start gap-3 mb-3">
                    <span class="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-bold">{{ $index + 1 }}</span>
                    <h4 class="flex-1 font-semibold">{{ question.text }}</h4>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 ml-8">
                    @for (answer of question.answers; track $index) {
                      <div class="px-3 py-1 bg-gray-900/50 rounded text-sm flex justify-between">
                        <span>{{ answer.text }}</span>
                        <span class="text-accent font-bold">{{ answer.points }} pts</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Footer Actions -->
            <div class="p-6 border-t border-gray-700 flex justify-between items-center">
              <button
                (click)="cancelPreview()"
                (mouseenter)="soundService.hover()"
                class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                ✕ Cancelar
              </button>
              <div class="text-sm text-gray-400">
                @if (getFinalPreviewCategory()) {
                  Se importarán en la categoría: <span class="text-cyan-400 font-semibold">{{ getFinalPreviewCategory() }}</span>
                } @else {
                  Se importarán sin categoría
                }
              </div>
              <button
                (click)="confirmImport()"
                (mouseenter)="soundService.hover()"
                class="px-6 py-3 bg-primary text-white rounded-lg glow-pink hover:bg-pink-600"
              >
                ✓ Importar {{ previewQuestions().length }} Pregunta(s)
              </button>
            </div>
          </div>
        </div>
      }

      @if (showAddForm) {
        <div class="p-6 rounded-lg border border-primary bg-gray-900/70">
          <h3 class="text-xl font-bold mb-4">Nueva Pregunta</h3>
          <div class="space-y-4">
            <input type="text" placeholder="Pregunta..." #questionInput
              class="w-full px-4 py-2 bg-gray-800 rounded text-white border border-gray-700">

            <!-- Category Input -->
            <div>
              <label class="block text-sm text-gray-400 mb-2">Categoría (opcional):</label>
              <div class="flex gap-2">
                <select
                  [(ngModel)]="newQuestionCategory"
                  class="flex-1 px-4 py-2 bg-gray-800 rounded text-white border border-gray-700"
                >
                  <option value="">Sin categoría</option>
                  <option value="_custom">+ Nueva categoría...</option>
                  @for (category of availableCategories(); track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
                @if (newQuestionCategory === '_custom') {
                  <input
                    type="text"
                    placeholder="Nombre de categoría"
                    [(ngModel)]="customCategory"
                    class="flex-1 px-4 py-2 bg-gray-800 rounded text-white border border-gray-700"
                  />
                }
              </div>
            </div>

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

      <!-- Filtros y acciones masivas -->
      <div class="p-4 rounded-lg border border-gray-700 bg-gray-900/50">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <!-- Filtro por categoría -->
          <div class="flex items-center gap-3">
            <label class="text-sm text-gray-400">Filtrar:</label>
            <select
              [(ngModel)]="filterCategory"
              (change)="onFilterChange()"
              (mouseenter)="soundService.hover()"
              class="px-3 py-1 bg-gray-800 rounded text-white border border-gray-700 text-sm"
            >
              <option value="">Todas las categorías</option>
              @for (category of availableCategories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>

          <!-- Acciones de selección -->
          <div class="flex gap-2">
            <button
              (click)="selectAll()"
              (mouseenter)="soundService.hover()"
              class="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
            >
              ✓ Seleccionar todas
            </button>
            <button
              (click)="deselectAll()"
              (mouseenter)="soundService.hover()"
              class="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
            >
              ✗ Deseleccionar todas
            </button>
          </div>

          <!-- Botones de eliminación -->
          <div class="flex gap-2">
            @if (selectedQuestionIds().length > 0) {
              <button
                (click)="deleteSelected()"
                (mouseenter)="soundService.hover()"
                class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                🗑️ Eliminar seleccionadas ({{ selectedQuestionIds().length }})
              </button>
            }
            @if (filterCategory()) {
              <button
                (click)="deleteCategory()"
                (mouseenter)="soundService.hover()"
                class="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                🗑️ Eliminar categoría
              </button>
            }
            <button
              (click)="deleteAll()"
              (mouseenter)="soundService.hover()"
              class="px-3 py-1 bg-red-800 text-white rounded text-sm hover:bg-red-900"
            >
              🗑️ Eliminar todas
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        @if (filteredQuestions().length === 0) {
          <div class="p-8 rounded-lg border border-gray-700 bg-gray-900/50 text-center">
            <p class="text-xl text-gray-400 mb-4">📝 No hay preguntas disponibles</p>
            <p class="text-sm text-gray-500">
              Crea una nueva pregunta o importa un archivo .md para comenzar
            </p>
          </div>
        }
        @for (question of filteredQuestions(); track question.id) {
          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50">
            <div class="flex justify-between items-start mb-4">
              <div class="flex gap-3 flex-1">
                <!-- Checkbox de selección -->
                <input
                  type="checkbox"
                  [checked]="isSelected(question.id)"
                  (change)="toggleSelection(question.id)"
                  class="mt-1 w-5 h-5 cursor-pointer"
                />
                <div class="flex-1">
                  <h3 class="text-xl font-semibold">{{question.text}}</h3>
                  <div class="flex gap-3 mt-2">
                    @if (question.category) {
                      <span class="px-2 py-1 bg-cyan-600/30 text-cyan-400 rounded text-xs">
                        📂 {{ question.category }}
                      </span>
                    }
                    @if (question.usageCount && question.usageCount > 0) {
                      <span class="px-2 py-1 bg-purple-600/30 text-purple-400 rounded text-xs">
                        🔢 Usada {{ question.usageCount }} {{ question.usageCount === 1 ? 'vez' : 'veces' }}
                      </span>
                    }
                    @if (question.lastUsedAt) {
                      <span class="px-2 py-1 bg-gray-600/30 text-gray-400 rounded text-xs">
                        🕐 {{ formatLastUsed(question.lastUsedAt) }}
                      </span>
                    }
                  </div>
                </div>
              </div>
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
  importMessage: { type: 'success' | 'error' | 'warning'; text: string } | null = null;
  newAnswers: Array<{text: string, points: number}> = [
    {text: '', points: 40},
    {text: '', points: 30},
    {text: '', points: 20}
  ];
  newQuestionCategory = '';
  customCategory = '';

  // Filtrado y selección
  filterCategory = signal<string>('');
  selectedQuestionIds = signal<string[]>([]);

  // Preview de importación
  showPreview = signal<boolean>(false);
  previewQuestions = signal<Array<{ text: string; answers: Array<{ text: string; points: number }> }>>([]);
  previewCategoryOption = '';
  previewCustomCategory = '';

  // Computed values
  availableCategories = computed(() => this.dataService.getCategories());

  filteredQuestions = computed(() => {
    const category = this.filterCategory();
    if (!category) return this.questions();
    return this.questions().filter(q => q.category === category);
  });

  toggleAddForm() {
    this.soundService.click();
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      // Reset category inputs
      this.newQuestionCategory = '';
      this.customCategory = '';
    }
  }

  addAnswerField() {
    this.soundService.click();
    this.newAnswers.push({text: '', points: 10});
  }

  saveQuestion(text: string) {
    if (!text.trim()) {
      this.showImportMessage('error', '⚠️ La pregunta no puede estar vacía');
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
      this.showImportMessage('error', '⚠️ Debes agregar al menos una respuesta');
      return;
    }

    // Determinar categoría final
    let category: string | undefined = undefined;
    if (this.newQuestionCategory === '_custom' && this.customCategory.trim()) {
      category = this.customCategory.trim();
    } else if (this.newQuestionCategory && this.newQuestionCategory !== '_custom') {
      category = this.newQuestionCategory;
    }

    // Verificar duplicados
    if (this.dataService.isDuplicateQuestion(text.trim(), category)) {
      this.showImportMessage('error', '❌ Esta pregunta ya existe en la misma categoría');
      return;
    }

    const questionData = {
      text: text.trim(),
      answers,
      category
    };

    console.log('Datos a guardar:', questionData);

    const savedQuestion = this.dataService.addQuestion(questionData);

    if (savedQuestion) {
      console.log('Pregunta guardada:', savedQuestion);
      console.log('Preguntas en signal:', this.dataService.getQuestions());

      this.soundService.correctAnswer(); // Success sound
      this.showAddForm = false;
      this.newAnswers = [{text: '', points: 40}, {text: '', points: 30}, {text: '', points: 20}];
      this.newQuestionCategory = '';
      this.customCategory = '';
      this.showImportMessage('success', '✅ Pregunta creada correctamente');
    } else {
      this.showImportMessage('error', '❌ Error al guardar la pregunta');
    }
  }

  deleteQuestion(id: string) {
    if (confirm('¿Eliminar esta pregunta?')) {
      this.soundService.click();
      const deleted = this.dataService.deleteQuestion(id);
      if (deleted) {
        this.showImportMessage('success', '✅ Pregunta eliminada');
        // Remover de selección si estaba seleccionada
        this.selectedQuestionIds.update(ids => ids.filter(qid => qid !== id));
      }
    }
  }

  // Métodos de selección
  toggleSelection(id: string) {
    this.soundService.click();
    this.selectedQuestionIds.update(ids => {
      if (ids.includes(id)) {
        return ids.filter(qid => qid !== id);
      } else {
        return [...ids, id];
      }
    });
  }

  isSelected(id: string): boolean {
    return this.selectedQuestionIds().includes(id);
  }

  selectAll() {
    this.soundService.click();
    const allIds = this.filteredQuestions().map(q => q.id);
    this.selectedQuestionIds.set(allIds);
  }

  deselectAll() {
    this.soundService.click();
    this.selectedQuestionIds.set([]);
  }

  onFilterChange() {
    this.soundService.click();
    // Deseleccionar al cambiar filtro
    this.deselectAll();
  }

  // Métodos de eliminación masiva
  deleteSelected() {
    const count = this.selectedQuestionIds().length;
    if (confirm(`¿Eliminar ${count} pregunta(s) seleccionada(s)?`)) {
      this.soundService.click();
      const deleted = this.dataService.deleteQuestions(this.selectedQuestionIds());
      this.selectedQuestionIds.set([]);
      this.showImportMessage('success', `✅ ${deleted} pregunta(s) eliminada(s)`);
    }
  }

  deleteCategory() {
    const category = this.filterCategory();
    if (!category) return;

    if (confirm(`¿Eliminar TODAS las preguntas de la categoría "${category}"?`)) {
      this.soundService.click();
      const deleted = this.dataService.deleteQuestionsByCategory(category);
      this.selectedQuestionIds.set([]);
      this.filterCategory.set('');
      this.showImportMessage('success', `✅ ${deleted} pregunta(s) de "${category}" eliminada(s)`);
    }
  }

  deleteAll() {
    const count = this.questions().length;
    if (confirm(`¿Eliminar TODAS las ${count} preguntas? Esta acción no se puede deshacer.`)) {
      if (confirm('¿Estás completamente seguro? Se perderán TODAS las preguntas.')) {
        this.soundService.click();
        const deleted = this.dataService.deleteAllQuestions();
        this.selectedQuestionIds.set([]);
        this.filterCategory.set('');
        this.showImportMessage('success', `✅ ${deleted} pregunta(s) eliminada(s)`);
      }
    }
  }

  formatLastUsed(date: Date): string {
    const now = new Date();
    const lastUsed = new Date(date);
    const diffMs = now.getTime() - lastUsed.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
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
      const parsedQuestions: Array<{ text: string; answers: Array<{ text: string; points: number }> }> = [];

      for (const line of lines) {
        // Check if line is a question (starts with #)
        if (line.startsWith('#')) {
          // Save previous question if exists
          if (currentQuestion && currentAnswers.length > 0) {
            parsedQuestions.push({
              text: currentQuestion,
              answers: [...currentAnswers]
            });
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
        parsedQuestions.push({
          text: currentQuestion,
          answers: [...currentAnswers]
        });
      }

      if (parsedQuestions.length > 0) {
        // Mostrar modal de preview
        this.previewQuestions.set(parsedQuestions);
        this.previewCategoryOption = '';
        this.previewCustomCategory = '';
        this.showPreview.set(true);
      } else {
        this.showImportMessage('error', 'No se encontraron preguntas válidas en el archivo');
      }
    } catch (error) {
      console.error('Error parsing markdown:', error);
      this.showImportMessage('error', 'Error al procesar el archivo. Verifica el formato.');
    }
  }

  getFinalPreviewCategory(): string {
    if (this.previewCategoryOption === '_custom') {
      return this.previewCustomCategory.trim();
    }
    return this.previewCategoryOption;
  }

  onPreviewCategoryChange() {
    if (this.previewCategoryOption !== '_custom') {
      this.previewCustomCategory = '';
    }
  }

  cancelPreview() {
    this.soundService.click();
    this.showPreview.set(false);
    this.previewQuestions.set([]);
    this.previewCategoryOption = '';
    this.previewCustomCategory = '';
  }

  confirmImport() {
    this.soundService.click();
    const questions = this.previewQuestions();
    const category = this.getFinalPreviewCategory() || undefined;

    let imported = 0;
    let duplicates = 0;

    for (const q of questions) {
      if (this.dataService.isDuplicateQuestion(q.text, category)) {
        duplicates++;
        continue;
      }

      const formattedAnswers = q.answers.map((a, i) => ({
        id: `${Date.now()}-${i}-${Math.random()}`,
        text: a.text,
        points: a.points,
        order: i + 1
      }));

      const result = this.dataService.addQuestion({
        text: q.text,
        answers: formattedAnswers,
        category
      });

      if (result) imported++;
    }

    this.showPreview.set(false);
    this.previewQuestions.set([]);
    this.previewCategoryOption = '';
    this.previewCustomCategory = '';

    if (duplicates > 0 && imported > 0) {
      this.showImportMessage('warning', `✅ ${imported} pregunta(s) importada(s). ${duplicates} duplicada(s) omitida(s).`);
    } else if (duplicates > 0 && imported === 0) {
      this.showImportMessage('warning', `⚠️ Todas las preguntas ya existen (${duplicates} duplicada(s)).`);
    } else {
      this.soundService.correctAnswer();
      this.showImportMessage('success', `✅ ${imported} pregunta(s) importada(s)${category ? ` en "${category}"` : ''}.`);
    }
  }

  private addParsedQuestion(questionText: string, answers: Array<{ text: string; points: number }>): boolean {
    // Verificar duplicados
    if (this.dataService.isDuplicateQuestion(questionText)) {
      return false;
    }

    const formattedAnswers = answers.map((a, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      text: a.text,
      points: a.points,
      order: i + 1
    }));

    const result = this.dataService.addQuestion({
      text: questionText,
      answers: formattedAnswers
    });

    return result !== null;
  }

  private showImportMessage(type: 'success' | 'error' | 'warning', text: string) {
    this.importMessage = { type, text };
    setTimeout(() => {
      this.importMessage = null;
    }, 5000);
  }
}
