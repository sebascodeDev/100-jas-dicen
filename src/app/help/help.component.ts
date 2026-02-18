import { Component, inject } from '@angular/core';
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

        <!-- Sección 1: Cómo Jugar -->
        <div class="p-6 rounded-lg border border-primary bg-gray-900/70">
          <h2 class="text-3xl font-bold text-primary mb-4">🎮 Cómo Jugar</h2>
          <div class="space-y-4 text-gray-300">
            <p class="text-lg">100 JAS Dicen es un juego de preguntas y respuestas donde equipos compiten por puntos.</p>

            <ol class="list-decimal list-inside space-y-3 ml-4">
              <li class="text-lg">
                <strong class="text-white">Selecciona los equipos</strong> que van a participar en el lobby
              </li>
              <li class="text-lg">
                <strong class="text-white">Configura la cantidad de preguntas</strong> que quieres jugar
              </li>
              <li class="text-lg">
                <strong class="text-white">Inicia el juego</strong> - verás un contador de 3 segundos
              </li>
              <li class="text-lg">
                <strong class="text-white">Responde las preguntas correctamente</strong> para ganar puntos
              </li>
              <li class="text-lg">
                <strong class="text-white">El equipo con más puntos al final gana</strong>
              </li>
            </ol>
          </div>
        </div>

        <!-- Sección 2: Reglas del Juego -->
        <div class="p-6 rounded-lg border border-secondary bg-gray-900/70">
          <h2 class="text-3xl font-bold text-secondary mb-4">📜 Reglas del Juego</h2>
          <div class="space-y-4 text-gray-300">
            <div class="p-4 bg-gray-800/50 rounded-lg">
              <h3 class="text-xl font-bold text-accent mb-2">⭐ Sistema de Puntos</h3>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li>Cada respuesta correcta otorga los puntos asignados a esa respuesta</li>
                <li>Las respuestas más populares suelen valer más puntos</li>
                <li>Los puntos de cada respuesta se definen al crear o importar las preguntas</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-800/50 rounded-lg">
              <h3 class="text-xl font-bold text-yellow-400 mb-2">🔥 Bonos por Racha</h3>
              <p class="mb-2 text-sm">Responder correctamente de forma consecutiva dentro de una misma pregunta otorga puntos extra:</p>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li><strong>2 respuestas correctas seguidas:</strong> +5 puntos de bonus</li>
                <li><strong>3-4 respuestas correctas seguidas:</strong> +10 puntos de bonus</li>
                <li><strong>5+ respuestas correctas seguidas:</strong> +20 puntos de bonus</li>
              </ul>
              <p class="mt-2 text-sm text-yellow-300">La racha se reinicia al cometer un error o al cambiar de pregunta.</p>
            </div>

            <div class="p-4 bg-red-900/30 rounded-lg border border-red-500">
              <h3 class="text-xl font-bold text-red-400 mb-2">❌ Sistema de Errores</h3>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li><strong>Máximo 3 errores por pregunta</strong> — al alcanzarlos se avanza automáticamente</li>
                <li>Cada error resta puntos al equipo de forma progresiva:</li>
              </ul>
              <div class="ml-8 mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                <div class="p-2 bg-red-900/40 rounded">
                  <p class="text-red-300 font-bold">1er error</p>
                  <p class="text-white font-bold">-5 pts</p>
                </div>
                <div class="p-2 bg-red-900/40 rounded">
                  <p class="text-red-300 font-bold">2do error</p>
                  <p class="text-white font-bold">-10 pts</p>
                </div>
                <div class="p-2 bg-red-900/40 rounded">
                  <p class="text-red-300 font-bold">3er error</p>
                  <p class="text-white font-bold">-15 pts</p>
                </div>
              </div>
              <p class="mt-2 text-sm text-red-300">Los errores también rompen la racha de respuestas correctas.</p>
            </div>

            <div class="p-4 bg-green-900/30 rounded-lg border border-green-500">
              <h3 class="text-xl font-bold text-green-400 mb-2">🏆 Preguntas Perfectas</h3>
              <p>Una pregunta perfecta es aquella en la que el equipo no cometió ningún error. El contador de preguntas perfectas se muestra en el panel de estadísticas durante el juego.</p>
            </div>
          </div>
        </div>

        <!-- Sección 3: Cómo Crear Equipos -->
        <div class="p-6 rounded-lg border border-accent bg-gray-900/70">
          <h2 class="text-3xl font-bold text-accent mb-4">👥 Cómo Crear Equipos</h2>
          <div class="space-y-4 text-gray-300">
            <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
              <li>
                Ve al <strong class="text-white">Panel Admin</strong> desde el menú principal
              </li>
              <li>
                Haz clic en la pestaña <strong class="text-white">"Equipos"</strong>
              </li>
              <li>
                Haz clic en <strong class="text-white">"+ Nuevo Equipo"</strong>
              </li>
              <li>
                Ingresa:
                <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Nombre del equipo</li>
                  <li>Color distintivo (en formato HEX, ej: #FF5733)</li>
                </ul>
              </li>
              <li>
                Haz clic en <strong class="text-white">"Guardar"</strong>
              </li>
            </ol>

            <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-500 mt-4">
              <p class="text-sm">
                💡 <strong>Tip:</strong> Puedes usar un selector de color online para encontrar el código HEX perfecto para tu equipo.
              </p>
            </div>
          </div>
        </div>

        <!-- Sección 4: Cómo Crear Preguntas -->
        <div class="p-6 rounded-lg border border-primary bg-gray-900/70">
          <h2 class="text-3xl font-bold text-primary mb-4">❓ Cómo Crear Preguntas</h2>
          <div class="space-y-6 text-gray-300">

            <div>
              <h3 class="text-xl font-bold text-white mb-3">Método 1: Crear Manualmente</h3>
              <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
                <li>Ve al <strong class="text-white">Panel Admin</strong></li>
                <li>Haz clic en la pestaña <strong class="text-white">"Preguntas"</strong></li>
                <li>Haz clic en <strong class="text-white">"+ Nueva Pregunta"</strong></li>
                <li>Escribe la pregunta</li>
                <li>
                  (Opcional) Asigna una <strong class="text-cyan-400">categoría</strong>:
                  <ul class="list-disc list-inside ml-6 mt-2 space-y-1 text-base">
                    <li>Selecciona una categoría existente del desplegable</li>
                    <li>O elige <strong>"+ Nueva categoría..."</strong> e ingresa el nombre</li>
                  </ul>
                </li>
                <li>
                  Agrega las respuestas con sus respectivos puntos
                  <ul class="list-disc list-inside ml-6 mt-2 text-base">
                    <li>Haz clic en "+ Respuesta" para añadir más opciones</li>
                  </ul>
                </li>
                <li>Haz clic en <strong class="text-white">"Guardar"</strong></li>
              </ol>
            </div>

            <div>
              <h3 class="text-xl font-bold text-white mb-3">Método 2: Importar desde archivo .md</h3>
              <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
                <li>Ve al <strong class="text-white">Panel Admin → Preguntas</strong></li>
                <li>Haz clic en <strong class="text-white">"📄 Importar .md"</strong></li>
                <li>Selecciona tu archivo .md con el formato correcto</li>
                <li>Revisa la <strong class="text-cyan-400">previsualización</strong> de todas las preguntas encontradas</li>
                <li>
                  Asigna una <strong class="text-cyan-400">categoría</strong> a todas las preguntas importadas:
                  <ul class="list-disc list-inside ml-6 mt-2 space-y-1 text-base">
                    <li>Selecciona una categoría existente del desplegable</li>
                    <li>O elige <strong>"+ Nueva categoría..."</strong> e ingresa el nombre</li>
                    <li>O déjalo vacío para importar sin categoría</li>
                  </ul>
                </li>
                <li>Haz clic en <strong class="text-white">"✓ Importar"</strong> para confirmar — las preguntas duplicadas se omiten automáticamente</li>
              </ol>
            </div>

            <div class="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500">
              <h4 class="text-sm font-bold text-cyan-400 mb-1">📂 Sistema de Categorías</h4>
              <ul class="list-disc list-inside space-y-1 text-sm ml-2">
                <li>Las categorías se crean automáticamente al asignarlas — no requieren configuración previa</li>
                <li>En el admin puedes <strong>filtrar</strong> preguntas por categoría y eliminar todas las de una categoría</li>
                <li>En el <strong>Lobby</strong> puedes elegir una categoría para que solo se usen esas preguntas en la partida</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sección 5: Formato del archivo .md -->
        <div class="p-6 rounded-lg border border-secondary bg-gray-900/70">
          <h2 class="text-3xl font-bold text-secondary mb-4">📄 Formato del Archivo .md</h2>
          <div class="space-y-4 text-gray-300">
            <p class="text-lg">Para importar preguntas desde un archivo Markdown (.md), sigue este formato:</p>

            <div class="p-4 bg-gray-800/80 rounded-lg">
              <h3 class="text-lg font-bold text-yellow-400 mb-3">Reglas de Formato:</h3>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li>Usa <code class="px-2 py-1 bg-gray-700 rounded text-pink-400">#</code> para indicar una pregunta</li>
                <li>Usa <code class="px-2 py-1 bg-gray-700 rounded text-pink-400">-</code> o <code class="px-2 py-1 bg-gray-700 rounded text-pink-400">*</code> para las respuestas</li>
                <li>
                  El formato de respuesta puede ser:
                  <ul class="list-disc list-inside ml-6 mt-2">
                    <li><code class="px-2 py-1 bg-gray-700 rounded text-cyan-400">Texto de respuesta | puntos</code> (con puntos específicos)</li>
                    <li><code class="px-2 py-1 bg-gray-700 rounded text-cyan-400">Texto de respuesta</code> (se asignarán puntos automáticamente: 40, 30, 20, etc.)</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="mt-6">
              <h3 class="text-xl font-bold text-white mb-3">📝 Ejemplo de Archivo .md:</h3>
              <div class="p-4 bg-black/50 rounded-lg border border-gray-700 overflow-x-auto">
                <pre class="text-sm text-green-400 font-mono">
<span class="text-pink-400"># ¿Cuál es un animal doméstico común?</span>

<span class="text-cyan-400">- Perro | 40</span>
<span class="text-cyan-400">- Gato | 35</span>
<span class="text-cyan-400">- Pez | 15</span>
<span class="text-cyan-400">- Pájaro | 10</span>

<span class="text-pink-400"># Nombra una fruta popular</span>

<span class="text-cyan-400">- Manzana | 45</span>
<span class="text-cyan-400">- Banana | 30</span>
<span class="text-cyan-400">- Naranja | 15</span>
<span class="text-cyan-400">- Uva | 10</span>

<span class="text-pink-400"># ¿Qué color es común en la naturaleza?</span>

<span class="text-cyan-400">- Verde</span>
<span class="text-cyan-400">- Azul</span>
<span class="text-cyan-400">- Café</span>
<span class="text-cyan-400">- Blanco</span>
</pre>
              </div>
            </div>

            <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-500 mt-4">
              <p class="text-sm">
                💡 <strong>Tip:</strong> Si no especificas puntos, se asignarán automáticamente en orden descendente (40, 30, 20, 10).
              </p>
            </div>

            <div class="p-4 bg-purple-900/20 rounded-lg border border-purple-500 mt-4">
              <p class="text-sm">
                📌 <strong>Nota:</strong> Asegúrate de dejar una línea en blanco entre cada pregunta para una mejor legibilidad</p>
            </div>
          </div>
        </div>

        <!-- Sección 6: Ventana de Control del Presentador -->
        <div class="p-6 rounded-lg border border-accent bg-gray-900/70">
          <h2 class="text-3xl font-bold text-accent mb-4">🎬 Ventana de Control del Presentador</h2>
          <div class="space-y-4 text-gray-300">
            <p class="text-lg">
              La ventana de control del presentador te permite manejar el juego desde una pantalla separada,
              ideal para proyectar el juego principal mientras controlas todo desde otro dispositivo.
            </p>

            <h3 class="text-xl font-bold text-white mt-4">Cómo usar:</h3>
            <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
              <li>Durante el juego, haz clic en <strong class="text-white">"🎬 Abrir Control de Presentador"</strong></li>
              <li>Se abrirá una nueva ventana con los controles del juego</li>
              <li>Desde ahí puedes:
                <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Revelar respuestas individuales</li>
                  <li>Revelar todas las respuestas</li>
                  <li>Registrar errores</li>
                  <li>Cambiar de equipo activo</li>
                  <li>Avanzar a la siguiente pregunta</li>
                  <li>Finalizar la partida</li>
                </ul>
              </li>
              <li>Los cambios se sincronizan automáticamente con la pantalla principal</li>
            </ol>

            <div class="p-4 bg-green-900/20 rounded-lg border border-green-500 mt-4">
              <p class="text-sm">
                ✨ <strong>Ventaja:</strong> Puedes ocultar los textos de las respuestas en el control del presentador
                para mayor privacidad, pero seguir viendo los puntos.
              </p>
            </div>
          </div>
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
}
