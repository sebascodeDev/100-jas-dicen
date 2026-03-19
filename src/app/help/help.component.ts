import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoundService } from '../shared/services/sound.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen p-6 pb-20">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-5xl font-bold gradient-text mb-4">📖 Guía del Juego</h1>
          <p class="text-xl text-gray-300">Todo lo que necesitas saber para jugar 100 JAS Dicen</p>
        </div>

        <!-- Botón volver -->
        <div class="mb-6">
          <a
            routerLink="/"
            (mouseenter)="soundService.hover()"
            class="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            ← Volver al Inicio
          </a>
        </div>

        <!-- Tabs Navigation -->
        <div class="border-b border-gray-700 flex flex-wrap gap-2 md:gap-0 overflow-x-auto">
          <button
            (click)="selectTab('jugar')"
            (mouseenter)="soundService.hover()"
            class="px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all whitespace-nowrap"
            [ngClass]="{
              'bg-primary text-white border-b-2 border-primary': activeTab() === 'jugar',
              'text-gray-400 hover:text-white': activeTab() !== 'jugar'
            }"
          >
            🎮 Cómo Jugar
          </button>
          <button
            (click)="selectTab('reglas')"
            (mouseenter)="soundService.hover()"
            class="px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all whitespace-nowrap"
            [ngClass]="{
              'bg-secondary text-white border-b-2 border-secondary': activeTab() === 'reglas',
              'text-gray-400 hover:text-white': activeTab() !== 'reglas'
            }"
          >
            📜 Reglas
          </button>
          <button
            (click)="selectTab('equipos')"
            (mouseenter)="soundService.hover()"
            class="px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all whitespace-nowrap"
            [ngClass]="{
              'bg-accent text-gray-900 border-b-2 border-accent': activeTab() === 'equipos',
              'text-gray-400 hover:text-white': activeTab() !== 'equipos'
            }"
          >
            👥 Equipos
          </button>
          <button
            (click)="selectTab('preguntas')"
            (mouseenter)="soundService.hover()"
            class="px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all whitespace-nowrap"
            [ngClass]="{
              'bg-primary text-white border-b-2 border-primary': activeTab() === 'preguntas',
              'text-gray-400 hover:text-white': activeTab() !== 'preguntas'
            }"
          >
            ❓ Preguntas
          </button>
          <button
            (click)="selectTab('markdown')"
            (mouseenter)="soundService.hover()"
            class="px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all whitespace-nowrap"
            [ngClass]="{
              'bg-secondary text-white border-b-2 border-secondary': activeTab() === 'markdown',
              'text-gray-400 hover:text-white': activeTab() !== 'markdown'
            }"
          >
            📄 Formato .md
          </button>
          <button
            (click)="selectTab('presentador')"
            (mouseenter)="soundService.hover()"
            class="px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all whitespace-nowrap"
            [ngClass]="{
              'bg-accent text-gray-900 border-b-2 border-accent': activeTab() === 'presentador',
              'text-gray-400 hover:text-white': activeTab() !== 'presentador'
            }"
          >
            🎬 Presentador
          </button>
        </div>

        <!-- Tab Content -->
        <div class="mt-8">
          <!-- Tab 1: Cómo Jugar -->
          @if (activeTab() === 'jugar') {
            <div class="p-6 rounded-lg border border-primary bg-gray-900/70" [@fadeInOut]>
              <h2 class="text-3xl font-bold text-primary mb-6">🎮 Cómo Jugar</h2>
              <div class="flex flex-col md:flex-row gap-4 items-stretch justify-between">
                <div class="flex-1 text-center">
                  <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white text-2xl font-bold mb-3 glow-pink">1</div>
                  <h3 class="font-bold text-white mb-2">Selecciona Equipos</h3>
                  <p class="text-sm text-gray-400">Elige los equipos que participarán</p>
                </div>
                <div class="hidden md:flex items-center text-2xl text-gray-500">→</div>
                <div class="flex-1 text-center">
                  <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-white text-2xl font-bold mb-3 glow-cyan">2</div>
                  <h3 class="font-bold text-white mb-2">Configura Preguntas</h3>
                  <p class="text-sm text-gray-400">Cantidad y categoría</p>
                </div>
                <div class="hidden md:flex items-center text-2xl text-gray-500">→</div>
                <div class="flex-1 text-center">
                  <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white text-2xl font-bold mb-3 glow-yellow">3</div>
                  <h3 class="font-bold text-white mb-2">Comienza</h3>
                  <p class="text-sm text-gray-400">Cuenta atrás de 3 segundos</p>
                </div>
                <div class="hidden md:flex items-center text-2xl text-gray-500">→</div>
                <div class="flex-1 text-center">
                  <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neonGreen text-white text-2xl font-bold mb-3 glow-green">4</div>
                  <h3 class="font-bold text-white mb-2">Responde</h3>
                  <p class="text-sm text-gray-400">Y gana puntos</p>
                </div>
                <div class="hidden md:flex items-center text-2xl text-gray-500">→</div>
                <div class="flex-1 text-center">
                  <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neonPurple text-white text-2xl font-bold mb-3 glow-purple">🏆</div>
                  <h3 class="font-bold text-white mb-2">¡Gana!</h3>
                  <p class="text-sm text-gray-400">Equipo con más puntos</p>
                </div>
              </div>
            </div>
          }

          <!-- Tab 2: Reglas -->
          @if (activeTab() === 'reglas') {
            <div class="p-6 rounded-lg border border-secondary bg-gray-900/70" [@fadeInOut]>
              <h2 class="text-3xl font-bold text-secondary mb-4">📜 Reglas del Juego</h2>
              <div class="space-y-4">
                <div class="p-4 bg-gray-800/50 rounded-lg">
                  <h3 class="text-xl font-bold text-accent mb-2">⭐ Sistema de Puntos</h3>
                  <ul class="list-disc list-inside space-y-2 ml-4 text-gray-300">
                    <li>Cada respuesta correcta otorga los puntos asignados a esa respuesta</li>
                    <li>Las respuestas más populares suelen valer más puntos</li>
                    <li>Los puntos de cada respuesta se definen al crear o importar las preguntas</li>
                  </ul>
                </div>

                <div class="p-4 bg-gray-800/50 rounded-lg">
                  <h3 class="text-xl font-bold text-yellow-400 mb-4">🔥 Bonos por Racha</h3>
                  <div class="space-y-3">
                    <div class="p-3 rounded-lg bg-gradient-to-r from-pink-900/30 to-pink-900/10 border border-pink-500/50">
                      <div class="flex items-center justify-between">
                        <div class="flex gap-2">
                          <span class="text-2xl text-green-400">✓</span>
                          <span class="text-2xl text-green-400">✓</span>
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-gray-400">2 respuestas correctas</p>
                          <p class="text-2xl font-bold text-pink-400">+5 pts</p>
                        </div>
                      </div>
                    </div>
                    <div class="p-3 rounded-lg bg-gradient-to-r from-yellow-900/30 to-yellow-900/10 border border-yellow-500/50">
                      <div class="flex items-center justify-between">
                        <div class="flex gap-2">
                          <span class="text-2xl text-green-400">✓</span>
                          <span class="text-2xl text-green-400">✓</span>
                          <span class="text-2xl text-green-400">✓</span>
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-gray-400">3-4 respuestas correctas</p>
                          <p class="text-2xl font-bold text-yellow-400">+10 pts</p>
                        </div>
                      </div>
                    </div>
                    <div class="p-3 rounded-lg bg-gradient-to-r from-green-900/30 to-green-900/10 border border-green-500/50">
                      <div class="flex items-center justify-between">
                        <div class="flex gap-2">
                          <span class="text-2xl text-green-400">✓</span>
                          <span class="text-2xl text-green-400">✓</span>
                          <span class="text-2xl text-green-400">✓</span>
                          <span class="text-2xl text-green-400">✓</span>
                          <span class="text-2xl text-green-400">✓</span>
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-gray-400">5+ respuestas correctas</p>
                          <p class="text-2xl font-bold text-green-400">+20 pts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-red-900/30 rounded-lg border border-red-500">
                  <h3 class="text-xl font-bold text-red-400 mb-4">❌ Sistema de Errores</h3>
                  <div class="space-y-3 mb-4">
                    <div class="p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                      <div class="flex items-center justify-between">
                        <div class="flex gap-2">☐ ☐ ☐</div>
                        <span class="text-sm text-gray-400">Sin errores</span>
                      </div>
                    </div>
                    <div class="p-3 rounded-lg bg-orange-900/20 border border-orange-600/50">
                      <div class="flex items-center justify-between">
                        <div class="flex gap-2">❌ ☐ ☐</div>
                        <div class="text-right">
                          <span class="text-sm text-orange-300">1 error</span>
                          <p class="text-lg font-bold text-orange-400">-5 pts</p>
                        </div>
                      </div>
                    </div>
                    <div class="p-3 rounded-lg bg-red-900/25 border border-red-600/50">
                      <div class="flex items-center justify-between">
                        <div class="flex gap-2">❌ ❌ ☐</div>
                        <div class="text-right">
                          <span class="text-sm text-red-300">2 errores</span>
                          <p class="text-lg font-bold text-red-400">-10 pts</p>
                        </div>
                      </div>
                    </div>
                    <div class="p-3 rounded-lg bg-red-900/40 border-2 border-red-500 animate-pulse">
                      <div class="flex items-center justify-between">
                        <div class="flex gap-2">❌ ❌ ❌</div>
                        <div class="text-right">
                          <span class="text-sm text-red-300">3 errores</span>
                          <p class="text-lg font-bold text-red-500">➜ Siguiente</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-red-300">⚠️ Los errores rompen la racha de aciertos</p>
                </div>

                <div class="p-4 bg-green-900/30 rounded-lg border border-green-500">
                  <h3 class="text-xl font-bold text-green-400 mb-2">🏆 Preguntas Perfectas</h3>
                  <p class="text-gray-300">Cuando un equipo completa una pregunta sin cometer errores. Se registra en estadísticas.</p>
                </div>
              </div>
            </div>
          }

          <!-- Tab 3: Crear Equipos -->
          @if (activeTab() === 'equipos') {
            <div class="p-6 rounded-lg border border-accent bg-gray-900/70" [@fadeInOut]>
              <h2 class="text-3xl font-bold text-accent mb-6">👥 Cómo Crear Equipos</h2>
              <div class="grid grid-cols-1 md:grid-cols-5 gap-2 items-stretch">
                <div class="p-3 rounded-lg border border-accent/50 bg-gradient-to-br from-accent/20 to-accent/5 text-center">
                  <p class="text-xs font-bold text-accent mb-1">PASO 1</p>
                  <p class="text-sm text-white font-semibold">Admin</p>
                </div>
                <div class="flex justify-center items-center text-accent">→</div>
                <div class="p-3 rounded-lg border border-accent/50 bg-gradient-to-br from-accent/20 to-accent/5 text-center">
                  <p class="text-xs font-bold text-accent mb-1">PASO 2</p>
                  <p class="text-sm text-white font-semibold">Equipos</p>
                </div>
                <div class="flex justify-center items-center text-accent">→</div>
                <div class="p-3 rounded-lg border border-green-500 bg-gradient-to-br from-green-900/20 to-green-900/5 text-center">
                  <p class="text-xs font-bold text-green-400 mb-1">CREAR</p>
                  <p class="text-sm text-white font-semibold">✓</p>
                </div>
              </div>
              <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-500 mt-6">
                <p class="text-sm">💡 <strong>Tip:</strong> Personaliza el nombre y elige un color distintivo para cada equipo</p>
              </div>
            </div>
          }

          <!-- Tab 4: Crear Preguntas -->
          @if (activeTab() === 'preguntas') {
            <div class="p-6 rounded-lg border border-primary bg-gray-900/70" [@fadeInOut]>
              <h2 class="text-3xl font-bold text-primary mb-6">❓ Cómo Crear Preguntas</h2>

              <div class="mb-8">
                <h3 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-sm">A</span>
                  Método 1: Manual
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-6 gap-2">
                  <div class="p-3 rounded-lg border border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 text-center">
                    <p class="text-xs font-bold text-primary mb-1">PASO 1</p>
                    <p class="text-sm text-white font-semibold">Admin</p>
                  </div>
                  <div class="flex justify-center items-center text-primary">→</div>
                  <div class="p-3 rounded-lg border border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 text-center">
                    <p class="text-xs font-bold text-primary mb-1">PASO 2</p>
                    <p class="text-sm text-white font-semibold">Preguntas</p>
                  </div>
                  <div class="flex justify-center items-center text-primary">→</div>
                  <div class="p-3 rounded-lg border border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 text-center">
                    <p class="text-xs font-bold text-primary mb-1">PASO 3</p>
                    <p class="text-sm text-white font-semibold">+ Nueva</p>
                  </div>
                  <div class="flex justify-center items-center text-primary">→</div>
                  <div class="p-3 rounded-lg border border-green-500 bg-gradient-to-br from-green-900/20 to-green-900/5 text-center">
                    <p class="text-xs font-bold text-green-400 mb-1">GUARDAR</p>
                    <p class="text-sm text-white font-semibold">✓</p>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-700 my-8"></div>

              <div>
                <h3 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold text-sm">B</span>
                  Método 2: Importar .md
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-7 gap-2">
                  <div class="p-3 rounded-lg border border-secondary/50 bg-gradient-to-br from-secondary/20 to-secondary/5 text-center">
                    <p class="text-xs font-bold text-secondary mb-1">PASO 1</p>
                    <p class="text-sm text-white font-semibold">Admin</p>
                  </div>
                  <div class="flex justify-center items-center text-secondary">→</div>
                  <div class="p-3 rounded-lg border border-secondary/50 bg-gradient-to-br from-secondary/20 to-secondary/5 text-center">
                    <p class="text-xs font-bold text-secondary mb-1">PASO 2</p>
                    <p class="text-sm text-white font-semibold">📄 Importar</p>
                  </div>
                  <div class="flex justify-center items-center text-secondary">→</div>
                  <div class="p-3 rounded-lg border border-secondary/50 bg-gradient-to-br from-secondary/20 to-secondary/5 text-center">
                    <p class="text-xs font-bold text-secondary mb-1">PASO 3</p>
                    <p class="text-sm text-white font-semibold">.md</p>
                  </div>
                  <div class="flex justify-center items-center text-secondary">→</div>
                  <div class="p-3 rounded-lg border border-secondary/50 bg-gradient-to-br from-secondary/20 to-secondary/5 text-center">
                    <p class="text-xs font-bold text-secondary mb-1">PASO 4</p>
                    <p class="text-sm text-white font-semibold">Preview</p>
                  </div>
                  <div class="flex justify-center items-center text-secondary">→</div>
                  <div class="p-3 rounded-lg border border-green-500 bg-gradient-to-br from-green-900/20 to-green-900/5 text-center">
                    <p class="text-xs font-bold text-green-400 mb-1">IMPORTAR</p>
                    <p class="text-sm text-white font-semibold">✓</p>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500 mt-6">
                <h4 class="text-sm font-bold text-cyan-400 mb-2">📂 Sistema de Categorías</h4>
                <ul class="list-disc list-inside space-y-1 text-sm ml-2 text-gray-300">
                  <li>Se crean automáticamente al asignarlas</li>
                  <li>Filtra preguntas en Admin</li>
                  <li>Elige categoría en el Lobby</li>
                </ul>
              </div>
            </div>
          }

          <!-- Tab 5: Formato .md -->
          @if (activeTab() === 'markdown') {
            <div class="p-6 rounded-lg border border-secondary bg-gray-900/70" [@fadeInOut]>
              <h2 class="text-3xl font-bold text-secondary mb-4">📄 Formato del Archivo .md</h2>
              <div class="space-y-4">
                <p class="text-gray-300 text-lg">Usa este formato para importar preguntas:</p>

                <div class="p-4 bg-gray-800/80 rounded-lg">
                  <h3 class="text-lg font-bold text-yellow-400 mb-3">Reglas de Formato:</h3>
                  <ul class="list-disc list-inside space-y-2 ml-4 text-gray-300">
                    <li>Usa <code class="px-2 py-1 bg-gray-700 rounded text-pink-400">#</code> para indicar una pregunta</li>
                    <li>Usa <code class="px-2 py-1 bg-gray-700 rounded text-pink-400">-</code> para las respuestas</li>
                    <li><code class="px-2 py-1 bg-gray-700 rounded text-cyan-400">Texto | puntos</code> (con puntos específicos)</li>
                    <li><code class="px-2 py-1 bg-gray-700 rounded text-cyan-400">Texto</code> (puntos automáticos: 40, 30, 20, 10)</li>
                  </ul>
                </div>

                <div class="mt-6">
                  <h3 class="text-xl font-bold text-white mb-3">📝 Ejemplo:</h3>
                  <div class="p-4 bg-black/50 rounded-lg border border-gray-700 overflow-x-auto">
                    <pre class="text-sm text-green-400 font-mono"><span class="text-pink-400"># ¿Cuál es un animal doméstico?</span>

<span class="text-cyan-400">- Perro | 40</span>
<span class="text-cyan-400">- Gato | 35</span>
<span class="text-cyan-400">- Pez | 15</span>

<span class="text-pink-400"># Nombra una fruta popular</span>

<span class="text-cyan-400">- Manzana</span>
<span class="text-cyan-400">- Banana</span>
<span class="text-cyan-400">- Naranja</span></pre>
                  </div>
                </div>

                <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-500">
                  <p class="text-sm">💡 <strong>Tip:</strong> Sin puntos especificados, se asignan automáticamente: 40, 30, 20, 10</p>
                </div>
              </div>
            </div>
          }

          <!-- Tab 6: Ventana Presentador -->
          @if (activeTab() === 'presentador') {
            <div class="p-6 rounded-lg border border-accent bg-gray-900/70" [@fadeInOut]>
              <h2 class="text-3xl font-bold text-accent mb-4">🎬 Ventana de Control del Presentador</h2>
              <div class="space-y-4 text-gray-300">
                <p class="text-lg">
                  La ventana de control del presentador te permite manejar el juego desde una pantalla separada,
                  ideal para proyectar el juego principal mientras controlas desde otro dispositivo.
                </p>

                <h3 class="text-xl font-bold text-white mt-4">Funcionalidades:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="font-bold text-accent mb-1">📱 Revelar Respuestas</p>
                    <p class="text-sm text-gray-400">Muestra las respuestas una por una</p>
                  </div>
                  <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="font-bold text-accent mb-1">🔓 Revelar Todas</p>
                    <p class="text-sm text-gray-400">Muestra todas las respuestas a la vez</p>
                  </div>
                  <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="font-bold text-accent mb-1">❌ Registrar Errores</p>
                    <p class="text-sm text-gray-400">Marca errores del equipo actual</p>
                  </div>
                  <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="font-bold text-accent mb-1">👥 Cambiar Equipo</p>
                    <p class="text-sm text-gray-400">Cambia entre equipos activos</p>
                  </div>
                  <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="font-bold text-accent mb-1">⏭️ Siguiente Pregunta</p>
                    <p class="text-sm text-gray-400">Avanza a la próxima pregunta</p>
                  </div>
                  <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="font-bold text-accent mb-1">🏁 Finalizar</p>
                    <p class="text-sm text-gray-400">Termina la partida y ve resultados</p>
                  </div>
                </div>

                <div class="p-4 bg-green-900/20 rounded-lg border border-green-500 mt-4">
                  <p class="text-sm">
                    ✨ <strong>Ventaja:</strong> Puedes ocultar textos de respuestas en el control
                    para mayor privacidad mientras ves los puntos.
                  </p>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Botón volver inferior -->
        <div class="text-center pt-8">
          <a
            routerLink="/"
            (mouseenter)="soundService.hover()"
            class="inline-block px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold glow-pink hover:bg-pink-600 transition-all transform hover:scale-105"
          >
            ← Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    code {
      font-family: 'Courier New', monospace;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `]
})
export class HelpComponent {
  soundService = inject(SoundService);
  activeTab = signal<string>('jugar');

  selectTab(tabId: string) {
    this.soundService.click();
    this.activeTab.set(tabId);
  }
}
