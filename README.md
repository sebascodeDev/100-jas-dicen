# 🎲 100 JAS DICEN - Juego de Preguntas Casino

Aplicación completa de juego de preguntas estilo "100 Ecuatorianos Dicen" desarrollada con **Angular 19**, **TailwindCSS** y almacenamiento local. Sin sistema de login, con paneles separados para administración y juego.

## ✅ ESTADO: 100% FUNCIONAL

Servidor corriendo en: **http://localhost:4200**

## 🆕 ÚLTIMAS ACTUALIZACIONES

- 🔊 **Sistema de efectos de sonido** completo con Web Audio API
- 📄 **Importación de preguntas** desde archivos Markdown (.md)
- 🎯 **Sistema de puntaje mejorado** con límite de errores y bonus por rachas
- 🏆 **Sistema de estadísticas avanzado** con preguntas perfectas

---

## 🎮 CARACTERÍSTICAS IMPLEMENTADAS

### 🏠 **Landing Page**
- Diseño con tema casino (fondo oscuro + gradientes neón)
- Navegación a Panel Admin y Juego
- Animaciones y efectos glow

### ⚙️ **Panel Admin** (`/admin`)
**Gestión de Preguntas:**
- ✅ Lista de todas las preguntas
- ✅ Crear nueva pregunta con múltiples respuestas
- ✅ **Importar preguntas desde archivos .md**
- ✅ Respuestas dinámicas (añadir/quitar)
- ✅ Asignar puntos a cada respuesta
- ✅ Eliminar preguntas
- ✅ 2 preguntas de ejemplo pre-cargadas
- ✅ Efectos de sonido en todas las interacciones

**Gestión de Equipos:**
- ✅ Lista de equipos con colores
- ✅ Crear equipo con nombre personalizado
- ✅ Color picker para seleccionar color único
- ✅ Eliminar equipos
- ✅ 3 equipos de ejemplo pre-cargados
- ✅ Efectos de sonido al crear/eliminar

### 🎮 **Panel Juego** (`/game`)
**Lobby:**
- ✅ Selección de equipos (mínimo 2)
- ✅ Configurar cantidad de preguntas (1-10)
- ✅ Validación antes de iniciar
- ✅ Previsualización de equipos seleccionados
- ✅ Efectos de sonido al seleccionar equipos
- ✅ Fanfarria al iniciar el juego

**Tablero de Juego:**
- ✅ Mostrar pregunta actual
- ✅ Tablero de respuestas ocultas (estilo "Family Feud")
- ✅ Input para escribir respuesta
- ✅ Verificación automática de respuestas
- ✅ **Límite de 3 errores por pregunta**
- ✅ **Sistema de bonus por rachas:**
  - 2 correctas seguidas: +5 puntos
  - 3-4 correctas seguidas: +10 puntos
  - 5+ correctas seguidas: +20 puntos
- ✅ Revelar respuestas al acertar
- ✅ Sistema de puntuación en tiempo real
- ✅ Indicador de turno actual por equipo
- ✅ **Botón para silenciar/activar sonidos**
- ✅ Botón "Siguiente Equipo"
- ✅ Botón "Revelar Todas"
- ✅ Botón "Siguiente Pregunta"
- ✅ **Efectos de sonido:**
  - ✓ Respuesta correcta
  - ✗ Respuesta incorrecta
  - Revelar respuestas
  - Cambio de pregunta
  - Fanfarria de victoria
  - Hover en botones
- ✅ Pantalla de ganador al finalizar
- ✅ Resultados finales con ranking
- ✅ **Seguimiento de preguntas perfectas (sin errores)**

**Rankings:**
- ✅ Tabla de posiciones global
- ✅ Estadísticas por equipo (partidas, victorias, puntos)
- ✅ Win rate y promedio de puntos
- ✅ Medallas para Top 3 (🥇🥈🥉)
- ✅ Sección destacada de campeones
- ✅ Estadísticas generales

---

## 🎨 TEMA CASINO

**Colores Neón:**
- 🌸 **Primary (Pink)**: `#ec4899`
- 💎 **Secondary (Cyan)**: `#06b6d4`
- ⭐ **Accent (Yellow)**: `#fbbf24`
- 💜 **Purple**: `#a855f7`
- 💚 **Green**: `#10b981`

**Efectos CSS Disponibles:**
```css
.glow-pink      /* Rosa neón */
.glow-cyan      /* Cyan neón */
.glow-yellow    /* Amarillo neón */
.glow-purple    /* Púrpura neón */
.gradient-text  /* Gradiente multicolor */
.animate-pulse-glow /* Animación pulsante */
```

**Fondo:** Gradientes radiales automáticos en toda la app

---

## 📄 IMPORTACIÓN DE PREGUNTAS (.md)

Puedes importar múltiples preguntas desde archivos Markdown. Incluido el archivo de ejemplo: `ejemplo-preguntas.md`

### Formato del archivo:

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

### Reglas:
- `#` indica una pregunta
- `-` o `*` indican respuestas
- Formato: `Texto de respuesta | puntos`
- Si no especificas puntos, se asignan automáticamente (40, 30, 20, 10...)

### Cómo importar:
1. Ve a `/admin/questions`
2. Click en "📄 Importar .md"
3. Selecciona tu archivo
4. ¡Listo! Las preguntas se añaden automáticamente

---

## 🔊 SISTEMA DE SONIDOS

Todos los efectos de sonido son generados dinámicamente con **Web Audio API** (sin archivos externos).

### Efectos incluidos:
- 🎵 **Respuesta correcta** - Sonido agradable ascendente
- 🚫 **Respuesta incorrecta** - Buzzer
- 🎬 **Revelar respuesta** - Efecto whoosh
- 🎰 **Revelar todas** - Sonido dramático
- 🎺 **Inicio de juego** - Fanfarria
- 🏆 **Victoria** - Celebración épica
- 💰 **Sumar puntos** - Sonido de caja registradora
- 🔘 **Click** - Feedback táctil
- 👆 **Hover** - Sonido sutil al pasar el mouse

### Control de sonido:
- Botón **🔊/🔇** en esquina superior derecha del tablero
- Alterna entre silencio y sonido activo

---

## 🎯 SISTEMA DE PUNTAJE AVANZADO

### Límite de errores:
- **Máximo 3 errores** por pregunta
- Al alcanzar 3 errores, se puede avanzar a la siguiente pregunta
- Los errores se resetean en cada pregunta nueva

### Bonus por rachas:
Responde correctamente de forma consecutiva y gana puntos extra:
- **2 seguidas**: +5 puntos bonus
- **3-4 seguidas**: +10 puntos bonus
- **5+ seguidas**: +20 puntos bonus

La racha se rompe al fallar una respuesta.

### Estadísticas:
- **Preguntas perfectas**: Preguntas completadas sin ningún error
- **Racha actual**: Contador de respuestas consecutivas correctas
- **Total de errores**: Por pregunta

---

## 🚀 CÓMO USAR

### 1. Iniciar Servidor
```bash
npm start
```
Abre: **http://localhost:4200**

### 2. Panel Admin
1. Ve a `/admin`
2. **Opción A:** Crea preguntas manualmente con sus respuestas y puntos
3. **Opción B:** Importa preguntas desde archivo .md
4. Crea equipos con nombres y colores

### 3. Jugar
1. Ve a `/game` (Lobby)
2. Selecciona al menos 2 equipos
3. Configura cantidad de preguntas
4. Haz clic en "Iniciar Juego" (escucha la fanfarria 🎺)
5. Escribe respuestas y presiona Enter o "Enviar"
6. Escucha feedback de sonido por cada respuesta
7. **Atención:** Solo tienes 3 errores por pregunta ⚠️
8. **Tip:** Mantén una racha de respuestas correctas para ganar bonus 🔥
9. Usa "Siguiente Equipo" para cambiar turno
10. Usa "Siguiente Pregunta" para avanzar
11. Al final, ve al ganador y estadísticas

### 4. Ver Rankings
- Accede a `/game/rankings`
- Ve estadísticas de todos los equipos
- Top 3 destacado con medallas

---

## 📁 ESTRUCTURA DEL PROYECTO

```
app-100-dicen/
├── ejemplo-preguntas.md           # 📄 Archivo ejemplo para importar
├── src/app/
│   ├── models/
│   │   └── game.models.ts         # Tipos TypeScript + GameSession
│   ├── shared/
│   │   └── services/
│   │       ├── data.service.ts    # CRUD + localStorage
│   │       ├── game.service.ts    # Lógica del juego + puntaje
│   │       └── sound.service.ts   # 🔊 Efectos de sonido
│   ├── home/
│   │   └── home.component.ts      # Landing page
│   ├── admin/
│   │   ├── admin-layout.component.ts   # Layout admin
│   │   ├── admin.routes.ts             # Rutas admin
│   │   └── pages/
│   │       ├── admin-home.component.ts
│   │       ├── questions-list.component.ts  # CRUD + importación .md
│   │       └── teams-list.component.ts      # CRUD equipos
│   └── game/
│       ├── game.routes.ts          # Rutas juego
│       └── pages/
│           ├── game-lobby.component.ts   # Selección equipos
│           ├── game-board.component.ts   # Juego + sistema errores
│           └── rankings.component.ts     # Tabla rankings
├── tailwind.config.js              # Configuración Tailwind
└── package.json
```

---

## 💾 PERSISTENCIA DE DATOS

Los datos se guardan en **localStorage**:
- `100jas_questions` - Preguntas
- `100jas_teams` - Equipos
- `100jas_rankings` - Rankings

**Datos de ejemplo incluidos:**
- 2 preguntas con 5 respuestas cada una
- 3 equipos (Rojo, Azul, Verde)

---

## 🎯 FLUJO DEL JUEGO

1. **Admin crea contenido** → Preguntas (manual o .md) y Equipos
2. **Lobby** → Seleccionar equipos participantes + escuchar fanfarria 🎺
3. **Juego** → Por cada pregunta:
   - Se muestra la pregunta
   - Equipos escriben respuestas
   - Se revelan respuestas correctas (efecto whoosh 🎬)
   - Se suman puntos + bonus por racha 🔥
   - **Máximo 3 errores por pregunta** ⚠️
   - Cambio de turno entre equipos
4. **Fin** → Ganador + celebración 🏆 + actualización de rankings
5. **Rankings** → Tabla global de estadísticas

---

## 🛠️ TECNOLOGÍAS

- **Angular 19** - Framework principal
- **TypeScript** - Lenguaje tipado
- **TailwindCSS v3** - Estilos utility-first
- **Signals** - Estado reactivo de Angular
- **LocalStorage** - Persistencia de datos
- **Web Audio API** - Generación de efectos de sonido

---

## 📝 COMANDOS

```bash
npm start          # Servidor desarrollo (puerto 4200)
npm run build      # Compilar producción
npm test           # Ejecutar tests
```

---

## 🎮 COMPONENTES PRINCIPALES

### DataService
- CRUD completo de preguntas, equipos, rankings
- Persistencia en localStorage
- Signals para reactividad
- Parser de archivos Markdown para importar preguntas

### GameService
- Iniciar juego con equipos seleccionados
- Verificar respuestas (fuzzy matching)
- **Sistema de puntuación avanzado:**
  - Límite de 3 errores por pregunta
  - Bonus por rachas (2x: +5, 3-4x: +10, 5+x: +20)
  - Contador de preguntas perfectas
- Calcular ganador
- Actualizar rankings automáticamente

### SoundService
- Generación de efectos de sonido con Web Audio API
- Control de silencio/activación
- 10+ efectos diferentes
- Sin archivos externos (todo generado dinámicamente)

### GameBoard
- Tablero estilo "Family Feud"
- Respuestas ocultas/reveladas
- Input con validación
- **Control de errores con límite de 3**
- **Indicador de racha actual**
- Turnos por equipo
- Animaciones y feedback visual + audio

---

## 🎨 PERSONALIZACIÓN

**Cambiar colores:**
Edita `tailwind.config.js`

**Modificar datos iniciales:**
Edita `data.service.ts` → método `initializeDefaultData()`

**Agregar más preguntas:**
Usa el panel admin en `/admin/questions`

---

## ✨ CARACTERÍSTICAS TÉCNICAS

- **Lazy Loading** - Módulos cargados bajo demanda
- **Standalone Components** - Sin NgModules
- **Signals** - Estado reactivo moderno
- **Responsive** - Adaptado a móviles y desktop
- **Type-safe** - TypeScript estricto
- **Inmutable State** - Gestión segura de estado
- **Web Audio API** - Efectos de sonido sin archivos externos
- **FileReader API** - Importación de archivos Markdown
- **LocalStorage** - Persistencia permanente en el navegador
- **Computed Values** - Cálculos reactivos automáticos

---

## 🎁 ARCHIVOS INCLUIDOS

- **`ejemplo-preguntas.md`** - Archivo de ejemplo con 7 preguntas listas para importar
- **Pre-cargados:**
  - 2 preguntas con 5 respuestas cada una
  - 3 equipos de colores (Rojo, Azul, Verde)

---

## 📊 ESTADÍSTICAS DEL PROYECTO

- **Componentes:** 10+ componentes standalone
- **Servicios:** 3 servicios principales (Data, Game, Sound)
- **Rutas:** Lazy loading en Admin y Game
- **Efectos de sonido:** 10+ efectos diferentes
- **Sistema de puntaje:** 3 niveles de bonus por rachas
- **Límite de errores:** Control de 3 errores máximo

---

**¡Disfruta jugando 100 JAS Dicen! 🎲🎰🔊**

> Desarrollado con Angular 19, TailwindCSS y mucho ❤️
>
> Características: Sistema de sonidos completo | Importación .md | Puntaje avanzado | Límite de errores
