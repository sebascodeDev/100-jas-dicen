import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SoundService } from '../shared/services/sound.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
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
    </div>

    <!-- Modal Changelog -->
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
