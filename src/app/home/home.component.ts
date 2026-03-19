import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SoundService } from '../shared/services/sound.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Hero Section -->
      <section class="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <div class="text-center space-y-8 max-w-4xl">
        <!-- Título -->
        <h1 class="text-6xl md:text-8xl font-bold gradient-text animate-pulse-glow">
          100 JAS DICEN
        </h1>

        <p class="text-xl md:text-2xl text-gray-300">
          El juego de preguntas más emocionante del CJ Noroeste
        </p>

        <!-- Botones principales -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <a
            routerLink="/game"
            (mouseenter)="soundService.hover()"
            class="px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold glow-pink hover:bg-pink-600 transition-all transform hover:scale-105"
          >
            🎮 Jugar Ahora
          </a>

          <a
            routerLink="/admin"
            (mouseenter)="soundService.hover()"
            class="px-8 py-4 bg-secondary text-white rounded-lg text-lg font-semibold glow-cyan hover:bg-cyan-600 transition-all transform hover:scale-105"
          >
            ⚙️ Panel Admin
          </a>

          <a
            routerLink="/help"
            (mouseenter)="soundService.hover()"
            class="px-8 py-4 bg-accent text-white rounded-lg text-lg font-semibold glow-yellow hover:bg-yellow-600 transition-all transform hover:scale-105"
          >
            📖 Cómo Jugar
          </a>
        </div>

        <!-- Botón Changelog -->
        <div class="mt-6">
          <button
            (click)="openChangelog()"
            (mouseenter)="soundService.hover()"
            class="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg text-sm font-semibold border border-gray-600 hover:border-gray-400 hover:text-white transition-all transform hover:scale-105"
          >
            📋 Ver Changelog y Actualizaciones
          </button>
        </div>

        <!-- Características -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur">
            <h3 class="text-xl font-bold text-primary mb-2">🎲 Equipos Personalizados</h3>
            <p class="text-gray-400">Crea equipos con nombres y colores únicos</p>
          </div>

          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur">
            <h3 class="text-xl font-bold text-secondary mb-2">❓ Preguntas Ilimitadas</h3>
            <p class="text-gray-400">Agrega tantas preguntas como quieras</p>
          </div>

          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur">
            <h3 class="text-xl font-bold text-accent mb-2">🏆 Sistema de Rankings</h3>
            <p class="text-gray-400">Sigue las puntuaciones y estadísticas</p>
          </div>
        </div>
      </div>
      </section>

      <!-- ¿Qué es 100 JAS DICEN? Section -->
      <section class="py-16 px-4 bg-gray-900/30">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text text-center mb-12">
            ¿Qué es 100 JAS DICEN?
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Card 1 -->
            <div class="p-6 rounded-lg border border-pink-500/30 bg-gray-900/70 backdrop-blur hover:border-pink-500 transition-all">
              <div class="text-4xl mb-3">🎯</div>
              <h3 class="text-xl font-bold text-primary mb-2">Trivia por Equipos</h3>
              <p class="text-gray-300">Compite en equipos respondiendo preguntas de opción múltiple. Demuestra quién sabe más.</p>
            </div>
            <!-- Card 2 -->
            <div class="p-6 rounded-lg border border-cyan-500/30 bg-gray-900/70 backdrop-blur hover:border-cyan-500 transition-all">
              <div class="text-4xl mb-3">🏃</div>
              <h3 class="text-xl font-bold text-secondary mb-2">Velocidad = Puntos</h3>
              <p class="text-gray-300">Quien responda primero gana más puntos. Responder en 4ta posición vale menos, pero aún suma.</p>
            </div>
            <!-- Card 3 -->
            <div class="p-6 rounded-lg border border-yellow-500/30 bg-gray-900/70 backdrop-blur hover:border-yellow-500 transition-all">
              <div class="text-4xl mb-3">⚡</div>
              <h3 class="text-xl font-bold text-accent mb-2">Racha de Aciertos</h3>
              <p class="text-gray-300">Mientras más respuestas correctas seguidas, mayor bonificación. Hasta +20 puntos por racha.</p>
            </div>
            <!-- Card 4 -->
            <div class="p-6 rounded-lg border border-purple-500/30 bg-gray-900/70 backdrop-blur hover:border-purple-500 transition-all">
              <div class="text-4xl mb-3">❌</div>
              <h3 class="text-xl font-bold text-neonPurple mb-2">Manejo de Errores</h3>
              <p class="text-gray-300">Máximo 3 errores por pregunta. Luego cede el turno al siguiente equipo.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Game Flow Section -->
      <section class="py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text text-center mb-12">
            Flujo del Juego
          </h2>
          <div class="space-y-6">
            <!-- Flow steps -->
            <div class="flex flex-col md:flex-row gap-6 items-center justify-center">
              <!-- Step 1 -->
              <div class="flex-1 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold mb-3 glow-pink">
                  1
                </div>
                <h3 class="text-lg font-bold text-primary mb-2">Crear Equipos</h3>
                <p class="text-gray-400 text-sm">Personaliza nombres y colores únicos para cada equipo</p>
              </div>
              <div class="hidden md:block text-2xl text-gray-500">→</div>
              <!-- Step 2 -->
              <div class="flex-1 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-white text-2xl font-bold mb-3 glow-cyan">
                  2
                </div>
                <h3 class="text-lg font-bold text-secondary mb-2">Elegir Preguntas</h3>
                <p class="text-gray-400 text-sm">Selecciona categoría, cantidad y comienza a jugar</p>
              </div>
              <div class="hidden md:block text-2xl text-gray-500">→</div>
              <!-- Step 3 -->
              <div class="flex-1 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold mb-3 glow-yellow">
                  3
                </div>
                <h3 class="text-lg font-bold text-accent mb-2">¡A Jugar!</h3>
                <p class="text-gray-400 text-sm">Equipos responden preguntas de opción múltiple</p>
              </div>
              <div class="hidden md:block text-2xl text-gray-500">→</div>
              <!-- Step 4 -->
              <div class="flex-1 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neonGreen text-white text-2xl font-bold mb-3 glow-green">
                  4
                </div>
                <h3 class="text-lg font-bold text-neonGreen mb-2">Ver Resultados</h3>
                <p class="text-gray-400 text-sm">Ranking final, estadísticas y exporta como imagen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Scoring System Section -->
      <section class="py-16 px-4 bg-gray-900/30">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text text-center mb-12">
            Sistema de Puntuación
          </h2>
          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/70 mb-8">
            <p class="text-gray-300 mb-6">Los puntos dependen del <strong>orden de respuesta correcta</strong>:</p>
            <table class="w-full text-center">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="py-3 px-4 text-accent font-bold">Posición</th>
                  <th class="py-3 px-4 text-accent font-bold">Puntos</th>
                  <th class="py-3 px-4 text-accent font-bold">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-gray-800">
                  <td class="py-3 px-4 font-bold">1ª Respuesta</td>
                  <td class="py-3 px-4 text-neonGreen font-bold text-lg">40 pts</td>
                  <td class="py-3 px-4 text-gray-300">La más rápida y correcta</td>
                </tr>
                <tr class="bg-gray-900/50">
                  <td class="py-3 px-4 font-bold">2ª Respuesta</td>
                  <td class="py-3 px-4 text-cyan-400 font-bold text-lg">30 pts</td>
                  <td class="py-3 px-4 text-gray-300">Segunda más rápida</td>
                </tr>
                <tr class="bg-gray-800">
                  <td class="py-3 px-4 font-bold">3ª Respuesta</td>
                  <td class="py-3 px-4 text-yellow-400 font-bold text-lg">20 pts</td>
                  <td class="py-3 px-4 text-gray-300">Tercera opción</td>
                </tr>
                <tr class="bg-gray-900/50">
                  <td class="py-3 px-4 font-bold">4ª Respuesta</td>
                  <td class="py-3 px-4 text-pink-400 font-bold text-lg">10 pts</td>
                  <td class="py-3 px-4 text-gray-300">Última correcta</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Example -->
          <div class="p-6 rounded-lg border border-cyan-500/50 bg-gray-900/70">
            <h3 class="text-xl font-bold text-cyan-400 mb-4">📌 Ejemplo:</h3>
            <p class="text-gray-300 mb-4"><strong>Pregunta:</strong> "¿Cuál es la capital de Colombia?"</p>
            <div class="space-y-2">
              <div class="flex justify-between items-center p-3 bg-gray-800 rounded border-l-4 border-green-500">
                <span class="text-gray-300"><strong>Equipo A:</strong> Bogotá (1ª)</span>
                <span class="text-green-400 font-bold text-lg">+40 pts</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-900/50 rounded border-l-4 border-cyan-500">
                <span class="text-gray-300"><strong>Equipo B:</strong> Cartagena (2ª)</span>
                <span class="text-cyan-400 font-bold text-lg">+30 pts</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-800 rounded border-l-4 border-yellow-500">
                <span class="text-gray-300"><strong>Equipo C:</strong> Medellín (3ª)</span>
                <span class="text-yellow-400 font-bold text-lg">+20 pts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Streak Bonus Section -->
      <section class="py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text text-center mb-12">
            Bonos por Racha de Aciertos
          </h2>
          <p class="text-gray-300 text-center mb-8">Mientras más respuestas correctas seguidas, mayor bonificación:</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Bonus 1 -->
            <div class="p-6 rounded-lg border-2 border-pink-500/50 bg-gray-900/70 hover:border-pink-500 transition-all text-center">
              <div class="text-5xl mb-3 glow-pink">⚡</div>
              <h3 class="text-2xl font-bold text-pink-400 mb-2">2 Aciertos</h3>
              <p class="text-4xl font-bold text-pink-400 mb-2">+5 pts</p>
              <p class="text-sm text-gray-400">Bonus al completar 2 respuestas correctas seguidas en la misma pregunta</p>
            </div>
            <!-- Bonus 2 -->
            <div class="p-6 rounded-lg border-2 border-yellow-500/50 bg-gray-900/70 hover:border-yellow-500 transition-all text-center">
              <div class="text-5xl mb-3 glow-yellow">⚡⚡</div>
              <h3 class="text-2xl font-bold text-yellow-400 mb-2">3-4 Aciertos</h3>
              <p class="text-4xl font-bold text-yellow-400 mb-2">+10 pts</p>
              <p class="text-sm text-gray-400">El doble del bonus por desempeño consistente</p>
            </div>
            <!-- Bonus 3 -->
            <div class="p-6 rounded-lg border-2 border-green-500/50 bg-gray-900/70 hover:border-green-500 transition-all text-center">
              <div class="text-5xl mb-3 glow-green">⚡⚡⚡</div>
              <h3 class="text-2xl font-bold text-green-400 mb-2">5+ Aciertos</h3>
              <p class="text-4xl font-bold text-green-400 mb-2">+20 pts</p>
              <p class="text-sm text-gray-400">Máximo bonus por perfección excepcional</p>
            </div>
          </div>

          <!-- Example Calculation -->
          <div class="p-6 rounded-lg border border-purple-500/50 bg-gray-900/70">
            <h3 class="text-xl font-bold text-purple-400 mb-4">📊 Ejemplo de Cálculo:</h3>
            <p class="text-gray-300 mb-4">Un equipo responde correctamente en las primeras 3 respuestas (40 + 30 + 20):</p>
            <div class="bg-gray-800 p-4 rounded space-y-2 text-gray-300 font-mono text-sm">
              <div>40 pts (1ª respuesta) <span class="text-yellow-400">✓</span></div>
              <div>+ 30 pts (2ª respuesta) <span class="text-yellow-400">✓</span></div>
              <div>+ 20 pts (3ª respuesta) <span class="text-yellow-400">✓</span></div>
              <div>+ 10 pts (bonus racha 3-4) <span class="text-green-400">🎁</span></div>
              <div class="border-t border-gray-600 pt-2 text-cyan-400 font-bold">= 100 pts totales</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Error System Section -->
      <section class="py-16 px-4 bg-gray-900/30">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text text-center mb-12">
            Sistema de Errores
          </h2>

          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/70 mb-8">
            <h3 class="text-xl font-bold text-gray-200 mb-6">Máximo <span class="text-red-400">3 errores</span> por pregunta por equipo</h3>

            <!-- Error progression visual -->
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-400 mb-2">Sin errores:</p>
                <div class="flex gap-2">
                  <span class="text-2xl">☐</span>
                  <span class="text-2xl">☐</span>
                  <span class="text-2xl">☐</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">1 Error incurrido:</p>
                <div class="flex gap-2">
                  <span class="text-2xl">❌</span>
                  <span class="text-2xl">☐</span>
                  <span class="text-2xl">☐</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">2 Errores incurridos:</p>
                <div class="flex gap-2">
                  <span class="text-2xl">❌</span>
                  <span class="text-2xl">❌</span>
                  <span class="text-2xl">☐</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">3 Errores = Cambio de turno:</p>
                <div class="flex gap-2 items-center">
                  <span class="text-2xl">❌</span>
                  <span class="text-2xl">❌</span>
                  <span class="text-2xl">❌</span>
                  <span class="text-xl ml-3 text-red-400">→ Siguiente equipo</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Penalty Table -->
          <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/70 mb-8">
            <h3 class="text-lg font-bold text-gray-200 mb-4">Penalización por Error:</h3>
            <table class="w-full text-center">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="py-3 px-4 text-red-400 font-bold">Error #</th>
                  <th class="py-3 px-4 text-red-400 font-bold">Penalización</th>
                  <th class="py-3 px-4 text-red-400 font-bold">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-gray-800">
                  <td class="py-3 px-4 font-bold">1er Error</td>
                  <td class="py-3 px-4 text-red-400 font-bold text-lg">-5 pts</td>
                  <td class="py-3 px-4 text-gray-300">Pequeña penalización</td>
                </tr>
                <tr class="bg-gray-900/50">
                  <td class="py-3 px-4 font-bold">2do Error</td>
                  <td class="py-3 px-4 text-orange-400 font-bold text-lg">-10 pts</td>
                  <td class="py-3 px-4 text-gray-300">Penalización moderada</td>
                </tr>
                <tr class="bg-gray-800">
                  <td class="py-3 px-4 font-bold">3er Error</td>
                  <td class="py-3 px-4 text-red-500 font-bold text-lg">-15 pts</td>
                  <td class="py-3 px-4 text-gray-300">Mayor penalización + cambio turno</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Example -->
          <div class="p-6 rounded-lg border border-red-500/50 bg-gray-900/70">
            <h3 class="text-xl font-bold text-red-400 mb-4">📌 Ejemplo:</h3>
            <p class="text-gray-300 mb-4">Un equipo tiene 50 puntos y comete 2 errores:</p>
            <div class="bg-gray-800 p-4 rounded space-y-2 text-gray-300 font-mono text-sm">
              <div>50 pts (Puntos actuales) <span class="text-yellow-400">⭐</span></div>
              <div>- 5 pts (1er error) <span class="text-red-400">❌</span></div>
              <div>- 10 pts (2do error) <span class="text-red-400">❌</span></div>
              <div class="border-t border-gray-600 pt-2 text-cyan-400 font-bold">= 35 pts (nuevo total)</div>
              <div class="text-yellow-400 mt-2">⚠️ Al intentar 3er error, cambio automático al siguiente equipo</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Perfect Questions Section -->
      <section class="py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <div class="p-8 rounded-lg border-2 border-green-500/50 bg-gradient-to-r from-green-900/20 to-emerald-900/20 text-center">
            <div class="text-6xl mb-4">🏆</div>
            <h2 class="text-3xl font-bold text-green-400 mb-3">Preguntas Perfectas</h2>
            <p class="text-gray-300 text-lg mb-4">
              Cuando un equipo completa una pregunta <strong>sin cometer ningún error</strong>
            </p>
            <p class="text-gray-400">El sistema registra esta marca especial y la muestra en las estadísticas finales 🌟</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 px-4 bg-gray-900/30">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text text-center mb-12">
            Características Principales
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Feature 1 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-primary transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-primary mb-2">🎲 Equipos Personalizados</h3>
              <p class="text-gray-400">Crea equipos con nombres y colores únicos para tu competencia</p>
            </div>
            <!-- Feature 2 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-secondary transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-secondary mb-2">❓ Preguntas Ilimitadas</h3>
              <p class="text-gray-400">Agrega, importa y gestiona tantas preguntas como necesites</p>
            </div>
            <!-- Feature 3 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-accent transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-accent mb-2">🏆 Rankings en Vivo</h3>
              <p class="text-gray-400">Sigue las puntuaciones y estadísticas actualizadas en tiempo real</p>
            </div>
            <!-- Feature 4 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-neonPurple transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-neonPurple mb-2">👨‍💼 Ventana Presentador</h3>
              <p class="text-gray-400">Control remoto sincronizado para gestionar el juego desde otra pantalla</p>
            </div>
            <!-- Feature 5 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-neonGreen transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-neonGreen mb-2">📥 Exportar Resultados</h3>
              <p class="text-gray-400">Descarga los resultados finales como imagen PNG de alta calidad</p>
            </div>
            <!-- Feature 6 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-cyan-400 transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-cyan-400 mb-2">📂 Importación Markdown</h3>
              <p class="text-gray-400">Carga masivas de preguntas desde archivos .md con categorías</p>
            </div>
            <!-- Feature 7 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-pink-400 transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-pink-400 mb-2">🔊 Efectos de Sonido</h3>
              <p class="text-gray-400">Audio feedback para todas las acciones e hitos alcanzados</p>
            </div>
            <!-- Feature 8 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-yellow-400 transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-yellow-400 mb-2">📱 100% Responsive</h3>
              <p class="text-gray-400">Funciona perfectamente en móviles, tablets y pantallas grandes</p>
            </div>
            <!-- Feature 9 -->
            <div class="p-6 rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur hover:border-purple-400 transition-all transform hover:scale-105">
              <h3 class="text-xl font-bold text-purple-400 mb-2">🎯 Fácil de Usar</h3>
              <p class="text-gray-400">Interfaz intuitiva que no requiere capacitación especial</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text mb-6">
            ¿Listo para Jugar?
          </h2>
          <p class="text-xl text-gray-300 mb-10">
            Comienza ahora y diviértete con tu equipo en 100 JAS DICEN
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              routerLink="/game"
              (mouseenter)="soundService.hover()"
              class="px-12 py-5 bg-primary text-white rounded-lg text-xl font-bold glow-pink hover:bg-pink-600 transition-all transform hover:scale-110 shadow-lg"
            >
              🎮 ¡Jugar Ahora!
            </a>
            <a
              routerLink="/help"
              (mouseenter)="soundService.hover()"
              class="px-10 py-5 bg-gray-800 text-gray-300 rounded-lg text-lg font-semibold border border-gray-600 hover:border-accent hover:text-accent transition-all transform hover:scale-105"
            >
              📖 Ver Rules Completas
            </a>
          </div>
        </div>
      </section>

      <!-- Modal Changelog (existing) -->
    @if (showChangelog()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        (click)="closeChangelog()"
      >
        <div
          class="bg-gray-900 rounded-xl border-2 border-gray-700 max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center z-10">
            <h2 class="text-3xl font-bold gradient-text">📋 Changelog y Actualizaciones</h2>
            <button
              (click)="closeChangelog()"
              (mouseenter)="soundService.hover()"
              class="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:border-red-500 hover:text-red-400 transition-all"
            >
              ✕ Cerrar
            </button>
          </div>

          <!-- Contenido scrolleable -->
          <div class="overflow-y-auto max-h-[calc(80vh-200px)] p-6 space-y-6">
            <!-- v1.4.0 -->
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="text-2xl font-bold text-blue-400 mb-2">v1.4.0 - Landing Page Mejorada y Guía Visual con Pestañas</h3>
              <p class="text-sm text-gray-400 mb-3">Marzo 2026</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Landing Page Completa:</strong> Nueva página de inicio (/) con 10+ secciones visuales que explican el juego: ¿Qué es?, Flujo de Juego (4 pasos), Sistema de Puntuación (tabla), Bonos por Racha (3 niveles), Sistema de Errores (visual progresivo), Preguntas Perfectas, y Características expandidas</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Guía con Pestañas Interactivas:</strong> Página de ayuda completamente rediseñada con 6 pestañas organizadas: 🎮 Cómo Jugar, 📜 Reglas, 👥 Equipos, ❓ Preguntas, 📄 Formato .md, 🎬 Presentador. Navegación fluida usando Angular signals</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Gráficos y Visualización:</strong> Tablas HTML con puntuación, indicadores de error (☐→❌ con progresión), flujos numerados con círculos de color, ejemplos de cálculos con detalles visuales, badges de bonos (+5/+10/+20 pts)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Ejemplos Educativos:</strong> Cada sección incluye ejemplos claros: cálculo de puntos de équipes, racha de aciertos con suma visual, penalización progresiva de errores, y flujo completo del juego</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-yellow-400 mt-1">🔧</span>
                  <span><strong>Bug Fix - Puntos No-Negativos:</strong> Implementado Math.max(0, currentScore + points) en GameService.addPoints() para garantizar que los puntos nunca sean negativos, independientemente de la penalización aplicada</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>UX y Responsividad:</strong> Diseño completamente responsivo con secciones bien espaciadas, colores consistentes (neon gradient), efectos de sonido en botones, y navegación intuitiva para nuevos usuarios</span>
                </li>
              </ul>
            </div>

            <!-- v1.3.0 -->
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="text-2xl font-bold text-purple-400 mb-2">v1.3.0 - Categorías e Importación Mejorada</h3>
              <p class="text-sm text-gray-400 mb-3">Febrero 2026</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Sistema de Categorías:</strong> Asigna categorías a las preguntas al crearlas o importarlas. Las categorías se crean automáticamente</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Filtro por Categoría en Admin:</strong> Filtra la lista de preguntas por categoría y elimina todas las preguntas de una categoría con un clic</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Filtro por Categoría en Lobby:</strong> Elige qué categoría de preguntas se usará en la partida</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Previsualización de Importación:</strong> Modal que muestra todas las preguntas del archivo .md antes de confirmar la importación</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Categoría durante Importación:</strong> Selecciona o crea una categoría para todas las preguntas del archivo al momento de importar</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Detección de Duplicados Mejorada:</strong> Informa cuántas preguntas fueron omitidas por duplicadas y cuántas se importaron exitosamente</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Seguimiento de Uso:</strong> Cada pregunta registra cuántas veces fue usada y cuándo fue la última vez. El sistema prioriza preguntas menos recientes</span>
                </li>
              </ul>
            </div>

            <!-- v1.2.1 -->
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="text-2xl font-bold text-green-400 mb-2">v1.2.1 - Correcciones Críticas</h3>
              <p class="text-sm text-gray-400 mb-3">Febrero 2026</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-2">
                  <span class="text-yellow-400 mt-1">🔧</span>
                  <span><strong>Memory Leak Corregido:</strong> Los nodos de audio ahora se desconectan correctamente después de reproducirse, eliminando consumo progresivo de memoria en sesiones largas</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-yellow-400 mt-1">🔧</span>
                  <span><strong>Sistema de Rachas Arreglado:</strong> La racha de aciertos ahora se resetea correctamente entre preguntas, asegurando que los bonos (+5, +10, +20 pts) se calculen solo dentro de cada pregunta</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Modal de Changelog:</strong> Nueva ventana de actualizaciones accesible desde la página principal</span>
                </li>
              </ul>
            </div>

            <!-- v1.2.0 -->
            <div class="border-l-4 border-pink-500 pl-4">
              <h3 class="text-2xl font-bold text-pink-400 mb-2">v1.2.0 - Minimalismo y Exportación</h3>
              <p class="text-sm text-gray-400 mb-3">Febrero 2026</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Exportación PNG:</strong> Descarga los resultados del juego como imagen PNG de alta calidad</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Diseño Minimalista:</strong> PNG con diseño limpio, tipografía profesional y sin elementos decorativos</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Optimización:</strong> Archivo PNG más ligero (800x900px) con escala de grises y colores sutiles</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-400 mt-1">🗑️</span>
                  <span><strong>Eliminado:</strong> Sistema de música de fondo (simplificación de la experiencia)</span>
                </li>
              </ul>
            </div>

            <!-- v1.1.0 -->
            <div class="border-l-4 border-cyan-500 pl-4">
              <h3 class="text-2xl font-bold text-cyan-400 mb-2">v1.1.0 - Ventana Presentador y Sistema de Puntos</h3>
              <p class="text-sm text-gray-400 mb-3">Enero 2026</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Ventana Presentador:</strong> Control remoto del juego desde una ventana emergente sincronizada</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Sistema de Errores:</strong> Máximo 3 errores por pregunta, avance automático al alcanzarlos</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Rachas de Aciertos:</strong> Bonus por respuestas consecutivas correctas (+5, +10, +20 pts)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Estadísticas en Vivo:</strong> Panel con errores, racha actual y preguntas perfectas</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Penalización:</strong> Resta de puntos progresiva por respuestas incorrectas (5, 10, 15 pts)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Sonidos Especiales:</strong> Efectos de audio para bonus y máximo de errores alcanzado</span>
                </li>
              </ul>
            </div>

            <!-- v1.0.5 -->
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="text-2xl font-bold text-yellow-400 mb-2">v1.0.5 - Mejoras de Experiencia</h3>
              <p class="text-sm text-gray-400 mb-3">Diciembre 2025</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Página de Ayuda:</strong> Guía completa sobre cómo jugar y reglas del juego</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Countdown Timer:</strong> Cuenta regresiva de 3 segundos antes de iniciar la partida</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Importación Markdown:</strong> Carga masiva de preguntas desde archivos .md</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Contador de Preguntas:</strong> Muestra el total de preguntas disponibles en el admin</span>
                </li>
              </ul>
            </div>

            <!-- v1.0.0 -->
            <div class="border-l-4 border-gray-500 pl-4">
              <h3 class="text-2xl font-bold text-gray-400 mb-2">v1.0.0 - Lanzamiento Inicial</h3>
              <p class="text-sm text-gray-400 mb-3">Noviembre 2025</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Juego Base:</strong> Mecánica completa del juego "100 JAS Dicen"</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Gestión de Equipos:</strong> Creación y personalización de equipos con colores</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Gestión de Preguntas:</strong> CRUD completo de preguntas con múltiples respuestas</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Sistema de Rankings:</strong> Estadísticas y clasificación de equipos</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Efectos de Sonido:</strong> Audio feedback para todas las acciones del juego</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-1">✅</span>
                  <span><strong>Diseño Responsive:</strong> Interfaz adaptable a diferentes tamaños de pantalla</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 text-center">
            <p class="text-sm text-gray-400">
              Desarrollado para <span class="text-primary font-semibold">CJ Noroeste</span> •
              Powered by <span class="text-cyan-400">Angular 21</span>
            </p>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class HomeComponent {
  soundService = inject(SoundService);
  showChangelog = signal(false);

  openChangelog() {
    this.soundService.click();
    this.showChangelog.set(true);
  }

  closeChangelog() {
    this.soundService.click();
    this.showChangelog.set(false);
  }
}
