# 100 JAS DICEN - Juego de Preguntas Casino

Aplicación completa de juego de preguntas estilo "100 Ecuatorianos Dicen" desarrollada con **Angular 21**, **TailwindCSS** y almacenamiento local. Sin sistema de login, con paneles separados para administración y juego.

## ESTADO: 100% FUNCIONAL

Servidor local en: **http://localhost:4200**

---

## ULTIMAS ACTUALIZACIONES

- **Sistema de categorías** en preguntas: asignar categoría al crear o importar, filtrar por categoría en el lobby y en el panel admin
- **Importación .md mejorada**: modal de previsualización antes de confirmar, selección de categoría existente o nueva durante la importación, detección de duplicados con conteo
- **Exportación de resultados a PNG**: descarga automática con `html2canvas` al finalizar la partida
- **Sistema de presentador**: ventana separada que controla el juego (`/game/board?presenter=true`), sincronización entre pestañas via localStorage
- **Countdown antes de iniciar**: animación de cuenta regresiva al arrancar la partida
- **Página de ayuda** (`/help`): instrucciones completas del juego y guía de formatos
- **Seguimiento de uso de preguntas**: contador de veces usada y fecha de último uso, selección inteligente que prioriza preguntas menos recientes
- **Angular 21**: actualización de versión del framework

---

## CARACTERISTICAS IMPLEMENTADAS

### Landing Page (`/`)

- Diseño con tema casino (fondo oscuro + gradientes neón)
- Navegación a Panel Admin, Juego y Ayuda
- Animaciones y efectos glow

### Panel Admin (`/admin`)

**Gestión de Preguntas** (`/admin/questions`):

- Lista de todas las preguntas con categoría, contador de uso y fecha de último uso
- Filtrar preguntas por categoría
- Selección múltiple y eliminación masiva
- Eliminar por categoría o eliminar todas
- Crear nueva pregunta manualmente con respuestas y puntos
- Asignar categoría al crear (existente o nueva)
- **Importar preguntas desde archivo .md**:
  - Modal de previsualización con todas las preguntas parseadas
  - Selección de categoría existente o creación de una nueva durante la importación
  - Detección de duplicados: omite preguntas repetidas e informa el conteo
  - Compatible con formato `# Pregunta` / `- Respuesta | puntos`

**Gestión de Equipos** (`/admin/teams`):

- Lista de equipos con color personalizado
- Crear equipo con nombre y color picker
- Eliminar equipos
- 3 equipos de ejemplo pre-cargados (Rojo, Azul, Verde)

### Panel Juego (`/game`)

**Lobby** (`/game/lobby`):

- Selección de equipos participantes (mínimo 2)
- **Filtro por categoría** de preguntas
- Configurar cantidad de preguntas (1-10)
- Validación antes de iniciar
- Countdown animado antes de arrancar la partida
- Fanfarria al iniciar el juego

**Tablero de Juego** (`/game/board`):

- Presentación de la pregunta actual
- Tablero de respuestas ocultas estilo "Family Feud"
- Verificación de respuestas por texto
- **Límite de 3 errores por pregunta** con indicador visual
- **Bonus por racha de respuestas correctas:**
  - 2 seguidas: +5 puntos
  - 3-4 seguidas: +10 puntos
  - 5+ seguidas: +20 puntos
- **Penalización progresiva por error:** 5, 10, 15 puntos descontados
- Racha se reinicia al cometer un error
- Indicador de turno actual por equipo
- Botón silenciar/activar sonidos
- Botón "Siguiente Equipo", "Revelar Todas", "Siguiente Pregunta"
- Panel de estadísticas en vivo: errores actuales, racha, preguntas perfectas
- **Sistema de presentador**: sincronización en tiempo real entre ventanas
- Pantalla de resultados finales con ganador y ranking
- **Exportar resultados como imagen PNG**

**Rankings** (`/game/rankings`):

- Tabla de posiciones global
- Estadísticas por equipo: partidas jugadas, victorias, puntos totales
- Win rate y promedio de puntos
- Medallas para Top 3
- Sección destacada del campeón

**Página de Ayuda** (`/help`):

- Instrucciones completas del juego
- Guía del formato de archivos .md
- Descripción del sistema de puntaje y rachas

---

## SISTEMA DE PUNTAJE

### Puntos base

Cada respuesta tiene un valor definido en el archivo `.md` o asignado manualmente. El equipo que responde correctamente suma esos puntos.

### Bonus por racha

Responder correctamente de forma consecutiva otorga puntos extra al equipo en turno:

| Racha        | Bonus   |
| ------------ | ------- |
| 2 seguidas   | +5 pts  |
| 3-4 seguidas | +10 pts |
| 5+ seguidas  | +20 pts |

La racha se reinicia con cada error o al cambiar de pregunta.

### Penalización por error

Cada error descuenta puntos del equipo activo de forma progresiva:

| Error     | Penalización |
| --------- | ------------ |
| 1er error | -5 pts       |
| 2do error | -10 pts      |
| 3er error | -15 pts      |

Al llegar a 3 errores se puede avanzar a la siguiente pregunta.

### Preguntas perfectas

Una pregunta perfecta es aquella completada sin ningún error. Se muestra el contador en el panel de estadísticas durante el juego.

---

## GESTION DE PREGUNTAS

### Crear pregunta manualmente

1. Ve a `/admin/questions`
2. Click en "+ Nueva Pregunta"
3. Escribe el texto de la pregunta
4. (Opcional) Selecciona una categoría existente del desplegable, o elige "+ Nueva categoría..." e ingresa el nombre
5. Agrega las respuestas con sus puntos
6. Click en "Guardar"

### Importar preguntas desde archivo .md

#### Formato del archivo

```markdown
# ¿Cuál es un animal doméstico común?

- Perro | 40
- Gato | 35
- Pez | 15
- Pájaro | 10

# Nombra una fruta popular

- Manzana | 45
- Banana | 30
- Naranja | 15
- Uva | 10

# ¿Qué color es común en la naturaleza?

- Verde
- Azul
- Café
- Blanco
```

#### Reglas del formato

- `#` indica una pregunta
- `-` o `*` indican respuestas
- Formato con puntos: `Texto de respuesta | puntos`
- Sin puntos: se asignan automáticamente (40, 30, 20, 10...)

#### Cómo importar

1. Ve a `/admin/questions`
2. Click en "Importar .md"
3. Selecciona el archivo desde tu sistema
4. Revisa la previsualización de todas las preguntas parseadas
5. Selecciona una categoría existente del desplegable o elige "+ Nueva categoría..." e ingresa el nombre
6. Confirma la importación — las preguntas duplicadas se omiten automáticamente

### Sistema de categorías

Las categorías se crean automáticamente al asignarlas durante la creación o importación de preguntas. No requieren configuración previa.

**En el panel Admin:**

- El desplegable "Filtrar" muestra todas las categorías existentes
- Seleccionar una categoría filtra la lista de preguntas
- El botón "Eliminar categoría" borra todas las preguntas de la categoría activa

**En el Lobby:**

- El selector de categoría filtra qué preguntas se usarán en la partida
- Dejar en blanco usa preguntas de todas las categorías

---

## SISTEMA DE SONIDOS

Todos los efectos son generados dinámicamente con **Web Audio API** (sin archivos externos).

| Efecto               | Descripción               |
| -------------------- | ------------------------- |
| Respuesta correcta   | Tono ascendente agradable |
| Respuesta incorrecta | Buzzer                    |
| Revelar respuesta    | Efecto whoosh             |
| Revelar todas        | Sonido dramático          |
| Inicio de juego      | Fanfarria                 |
| Victoria             | Celebración épica         |
| Sumar puntos         | Caja registradora         |
| Click                | Feedback táctil           |
| Hover                | Sonido sutil              |

Control de sonido: botón **ON/OFF** en la esquina superior derecha del tablero.

---

## EXPORTACION DE RESULTADOS

Al finalizar una partida, el botón **Descargar Resultados (PNG)** genera una imagen con:

- Ganador destacado con color del equipo
- Tabla de posiciones final
- Puntuaciones de todos los equipos
- Fecha de la partida

La imagen se descarga automáticamente como `100JAS-Results-DD-MM-YYYY.png`.

---

## SEGUIMIENTO DE USO DE PREGUNTAS

Cada pregunta registra:

- **Veces usada**: cuántas partidas ha aparecido
- **Última vez usada**: fecha de la última aparición

Al iniciar una partida, el sistema prioriza preguntas que no han sido usadas en los últimos 7 días y selecciona primero las menos usadas. Si no hay suficientes preguntas frescas, incluye las menos recientes del historial.

---

## COMO USAR

### 1. Iniciar servidor

```bash
npm start
```

Abre: **http://localhost:4200**

### 2. Preparar contenido (Admin)

1. Ve a `/admin`
2. Crea preguntas manualmente o importa desde un archivo `.md`
3. Asigna categorías a las preguntas durante la creación o importación
4. Crea equipos con nombres y colores personalizados

### 3. Jugar

1. Ve a `/game` → Lobby
2. Selecciona al menos 2 equipos
3. (Opcional) Filtra por categoría
4. Configura la cantidad de preguntas
5. Haz clic en "Iniciar Juego" y espera el countdown
6. Escribe respuestas y presiona Enter o "Enviar"
7. Máximo 3 errores por pregunta
8. Mantén una racha para ganar puntos bonus
9. Usa "Siguiente Equipo" para rotar turnos
10. Al finalizar, descarga los resultados en PNG

### 4. Ver Rankings

- Ve a `/game/rankings`
- Consulta estadísticas globales de todos los equipos

---

## ESTRUCTURA DEL PROYECTO

```
app-100-dicen/
├── ejemplo-preguntas.md
├── src/app/
│   ├── models/
│   │   └── game.models.ts              # Tipos: Question, Team, GameSession, Ranking
│   ├── shared/
│   │   ├── components/
│   │   │   └── export-button.component.ts   # Botón exportar PNG
│   │   └── services/
│   │       ├── data.service.ts         # CRUD + localStorage + categorías + uso
│   │       ├── game.service.ts         # Lógica del juego + puntaje + rachas + errores
│   │       ├── sound.service.ts        # Efectos de sonido (Web Audio API)
│   │       ├── sync.service.ts         # Sincronización entre ventanas (presentador)
│   │       └── export.service.ts       # Exportación de resultados a PNG
│   ├── home/
│   │   └── home.component.ts           # Landing page
│   ├── help/
│   │   └── help.component.ts           # Página de ayuda e instrucciones
│   ├── admin/
│   │   ├── admin-layout.component.ts
│   │   ├── admin.routes.ts
│   │   └── pages/
│   │       ├── admin-home.component.ts
│   │       ├── questions-list.component.ts  # CRUD + importación .md + categorías
│   │       └── teams-list.component.ts
│   └── game/
│       ├── game.routes.ts
│       └── pages/
│           ├── game-lobby.component.ts  # Lobby + filtro por categoría + countdown
│           ├── game-board.component.ts  # Tablero + errores + rachas + presentador
│           └── rankings.component.ts
├── tailwind.config.js
└── package.json
```

---

## PERSISTENCIA DE DATOS

Datos guardados en **localStorage**:

| Clave                 | Contenido                                                 |
| --------------------- | --------------------------------------------------------- |
| `100jas_questions`    | Preguntas con respuestas, categoría y estadísticas de uso |
| `100jas_teams`        | Equipos con nombre y color                                |
| `100jas_rankings`     | Historial de partidas y rankings                          |
| `100jas_current_game` | Estado actual de la partida en curso                      |

---

## TECNOLOGIAS

- **Angular 21** - Framework principal con Standalone Components
- **TypeScript** - Lenguaje tipado
- **TailwindCSS v3** - Estilos utility-first
- **Angular Signals** - Estado reactivo moderno
- **LocalStorage** - Persistencia de datos en el navegador
- **Web Audio API** - Generación procedural de efectos de sonido
- **html2canvas** - Exportación de resultados a imagen PNG
- **FileReader API** - Lectura de archivos .md para importación

---

## TEMA VISUAL

**Colores neón:**

- **Primary (Pink)**: `#ec4899`
- **Secondary (Cyan)**: `#06b6d4`
- **Accent (Yellow)**: `#fbbf24`
- **Purple**: `#a855f7`
- **Green**: `#10b981`

**Clases CSS disponibles:**

```css
.glow-pink           /* Resplandor rosa */
.glow-cyan           /* Resplandor cyan */
.glow-yellow         /* Resplandor amarillo */
.glow-purple         /* Resplandor púrpura */
.gradient-text       /* Texto con gradiente multicolor */
.animate-pulse-glow  /* Animación pulsante */
```

---

## COMANDOS

```bash
npm start          # Servidor de desarrollo (http://localhost:4200)
npm run build      # Compilar para producción
npm test           # Ejecutar tests
```

---

**100 JAS Dicen** — Desarrollado con Angular 21, TailwindCSS y Web Audio API.
