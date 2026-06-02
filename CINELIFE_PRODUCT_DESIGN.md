# CineLife — Documento Completo de Diseño de Producto

> Una aplicación móvil para parejas donde los hábitos cotidianos se convierten en películas.

**Versión:** 1.0 | **Fecha:** Junio 2026

---

## ÍNDICE

1. [Visión y Concepto](#1-visión-y-concepto)
2. [Usuarios y Personas](#2-usuarios-y-personas)
3. [Mecánicas de Juego](#3-mecánicas-de-juego)
4. [Sistema Económico](#4-sistema-económico)
5. [Sistema de Progresión](#5-sistema-de-progresión)
6. [Pantallas Principales](#6-pantallas-principales)
7. [Flujo de Usuario](#7-flujo-de-usuario)
8. [Wireframes Conceptuales](#8-wireframes-conceptuales)
9. [Base de Datos](#9-base-de-datos)
10. [Arquitectura Técnica](#10-arquitectura-técnica)
11. [Monetización](#11-monetización)
12. [Retención de Usuarios](#12-retención-de-usuarios)
13. [Diseño UX/UI](#13-diseño-uxui)
14. [Sistema de Recompensas](#14-sistema-de-recompensas)
15. [Funciones Sociales](#15-funciones-sociales)
16. [IA dentro del Producto](#16-ia-dentro-del-producto)
17. [MVP Inicial](#17-mvp-inicial)
18. [Roadmap de Desarrollo](#18-roadmap-de-desarrollo)
- [Apéndice A: Glosario](#apéndice-a-glosario)
- [Apéndice B: Referencias de Diseño](#apéndice-b-referencias-de-diseño-visual)
- [Apéndice C: Stack Tecnológico](#apéndice-c-stack-tecnológico-resumido)

---

# 1. Visión y Concepto

## 1.1 Elevator Pitch

**CineLife** es una aplicación móvil para parejas donde cumplir hábitos cotidianos genera recursos para producir películas virtuales. Cada hábito completado es un paso en una carrera cinematográfica: los usuarios pasan de ser estudiantes de cine a directoras legendarias, construyendo un estudio virtual, produciendo filmes generados por IA, y apoyándose mutuamente en el camino.

## 1.2 Propuesta de Valor

| Para quién | Qué problema resuelve | Cómo lo resuelve |
|---|---|---|
| Parejas jóvenes (18-32 años) | Los apps de hábitos son aburridos y no motivan a largo plazo | Convierte hábitos en narrativa cinematográfica con recompensas visuales |
| Personas creativas | Las apps de productividad se sienten frías e industriales | Estética cozy, mundo expansible, identidad artística |
| Parejas que quieren crecer juntas | Las apps de pareja generan dependencia o son superficiales | Sistema de apoyo mutuo con autonomía individual preservada |

## 1.3 Principios de Diseño

1. **Cozy primero** — Nunca debe sentirse como una obligación. Sin puntuaciones de vergüenza, sin comparaciones agresivas.
2. **Narrativa antes que métricas** — El usuario no ve "racha de 14 días"; ve que su película está en pre-producción.
3. **Cada persona es autónoma** — Los hábitos son individuales. La pareja apoya, no controla.
4. **La IA amplifica la creatividad** — Las películas generadas deben sorprender y emocionar, no ser genéricas.
5. **Progresión opcional** — El juego es satisfactorio sin necesidad de optimizar.

---

# 2. Usuarios y Personas

## 2.1 Persona A — La Estudiante de Cine

- **Nombre ficticio:** Valentina, 23 años
- **Perfil:** Estudia producción audiovisual. Ama el cine de autor, los festivales, Agnès Varda, Wong Kar-wai.
- **Motivaciones:** Quiere sentir que sus hábitos (estudiar, leer guiones, escribir) contribuyen a algo creativo.
- **Frustraciones:** Las apps de hábitos se sienten como listas de tareas. No conectan con su identidad creativa.
- **Comportamiento digital:** Usa Instagram, Letterboxd, Notion. Paga por apps si le aportan valor emocional.

## 2.2 Persona B — La Pareja de Apoyo

- **Nombre ficticio:** Lucía, 25 años
- **Perfil:** Trabaja, hace ejercicio, le gustan los juegos casuales. No estudia cine pero aprecia la creatividad de su pareja.
- **Motivaciones:** Quiere tener una rutina sana y compartir algo con su pareja.
- **Frustraciones:** Se siente excluida de los intereses de su pareja. Los apps de pareja son cursis o superficiales.
- **Comportamiento digital:** Usa TikTok, Spotify, Duolingo. Le engancha la gamificación sencilla.

## 2.3 Necesidades Compartidas

- Sentir progreso real sin presión excesiva
- Compartir algo significativo con la pareja
- Personalización y expresión creativa
- Privacidad en lo que no quieren compartir

---

# 3. Mecánicas de Juego

## 3.1 El Game Loop Central

```
DÍA A DÍA
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Abrir app → Ver estudio → Completar hábitos        │
│       ↓                                             │
│  Ganar XP + Monedas + Recursos cinematográficos     │
│       ↓                                             │
│  Avanzar nivel de carrera                           │
│       ↓                                             │
│  Desbloquear áreas del estudio / cosméticos         │
│       ↓                                             │
│  Acumular recursos para producir película           │
│       ↓                                             │
│  Completar película → Recibir obra de IA            │
│       ↓                                             │
│  Compartir / Celebrar con pareja                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 3.2 Los Hábitos

Cada hábito tiene una **categoría temática** que determina qué recursos cinematográficos genera.

| Hábito | Categoría | XP base | Recursos generados |
|---|---|---|---|
| Dormir 7-8 horas | Bienestar | 30 XP | Energía de producción |
| Hacer ejercicio | Bienestar | 40 XP | Energía de producción + Prop |
| Meditación | Bienestar | 25 XP | Inspiración creativa |
| Estudiar (30 min+) | Conocimiento | 50 XP | Guión + Crédito de producción |
| Leer (20 min+) | Conocimiento | 35 XP | Guión + Inspiración |
| Journaling | Conocimiento | 30 XP | Inspiración + Guión |
| Trabajar en proyecto personal | Creativo | 60 XP | Negativo de film + Inspiración |
| Practicar un hobby creativo | Creativo | 45 XP | Negativo de film + Prop |
| Actividad social | Social | 35 XP | Crédito de producción + Prop |
| Aprender algo nuevo | Conocimiento | 40 XP | Guión + Crédito |
| Tiempo al aire libre | Bienestar | 30 XP | Energía + Negativo |
| Cocinar algo nuevo | Creativo | 35 XP | Prop + Inspiración |

## 3.3 Recursos Cinematográficos (Las 6 Monedas de Juego)

| Recurso | Símbolo | Qué representa | Cómo se obtiene |
|---|---|---|---|
| **Guión** | 📝 | Las ideas y la escritura | Hábitos de estudio y lectura |
| **Energía de Producción** | ⚡ | La fuerza para ejecutar | Hábitos de bienestar y ejercicio |
| **Negativo de Film** | 🎞️ | El material bruto de la película | Hábitos creativos |
| **Inspiración** | ✨ | La chispa artística | Meditación, journaling, hobbies |
| **Props** | 🎭 | Los elementos de producción | Mix de hábitos, actividades sociales |
| **Crédito de Producción** | 💰 | El presupuesto del proyecto | Estudio, trabajo en proyectos, social |

## 3.4 El Sistema de Películas

### Fases de Producción

**Fase 1 — Desarrollo (Pre-producción)**
- Requiere: 5 Guiones + 3 Inspiraciones
- Duración mínima real: 3 días
- Resultado: Se define el género y concepto base

**Fase 2 — Rodaje (Producción)**
- Requiere: 8 Energías + 6 Negativos + 4 Props
- Duración mínima real: 5 días
- Resultado: El "metraje" de la película se acumula

**Fase 3 — Post-producción**
- Requiere: 4 Guiones + 3 Créditos + 2 Inspiraciones
- Duración mínima real: 2 días
- Resultado: La película está lista para el estreno

### El Estreno

Al completar las 3 fases, la IA genera:
- **Título** de la película
- **Género** (determinado por los hábitos completados durante la producción)
- **Póster** (imagen generada)
- **Sinopsis** (texto generado)
- **Calificación crítica** (determinada por consistencia de hábitos)
- **Calificación de público** (determinada por diversidad de hábitos)

La película se agrega a la **Filmografía** personal del usuario.

## 3.5 Tipos de Películas por Combinación de Hábitos

| Hábitos dominantes durante producción | Género resultante | Estilo narrativo |
|---|---|---|
| Bienestar + Meditación | Drama contemplativo | Minimalista, poético |
| Estudio + Lectura | Thriller intelectual | Denso, cerebral |
| Creativos + Hobby | Experimental / Arte | Abstracto, visual |
| Social + Ejercicio | Comedia romántica | Ligero, cálido |
| Mix equilibrado | Drama independiente | Complejo, matizado |
| Journaling dominante | Documental personal | Íntimo, confesional |
| Proyectos personales | Ciencia ficción indie | Ambicioso, original |

---

# 4. Sistema Económico

## 4.1 Monedas del Juego

### Moneda Principal — Fotogramas (🎬)
- **Fuente principal:** Completar hábitos diarios
- **Fuente secundaria:** Logros, niveles, eventos
- **Uso:** Decoración del estudio, comprar recursos específicos, acelerar producciones
- **No se compra directamente** con dinero real (preserva la economía)

### Moneda Premium — Rollos de Celuloide (🎥)
- **Fuente:** Compra real (IAP) o recompensas muy especiales
- **Uso:** Cosméticos exclusivos, temas visuales del estudio, marcos de póster especiales
- **Cantidad en circulación:** Controlada estrictamente

## 4.2 Tabla de Ingresos de Fotogramas

| Acción | Fotogramas ganados |
|---|---|
| Completar hábito (base) | 10-20 🎬 |
| Bonus de racha (7 días) | +50 🎬 |
| Bonus de racha (30 días) | +200 🎬 |
| Completar película | 150 🎬 |
| Subir de nivel | 100-500 🎬 (según nivel) |
| Desafío semanal completado | 75 🎬 |
| Primer hábito del día | +10 🎬 bonus |
| Completar todos los hábitos del día | +30 🎬 bonus |

## 4.3 Tabla de Gastos de Fotogramas

| Gasto | Costo |
|---|---|
| Decoración básica del estudio | 50-200 🎬 |
| Decoración premium | 300-800 🎬 |
| Comprar 1 recurso cinematográfico específico | 25 🎬 |
| Desbloquear área del estudio anticipada | 500 🎬 |
| Escudo de racha (1 día de protección) | 100 🎬 |
| Renovar producción pausada | 80 🎬 |

## 4.4 Balance Económico

**Usuario activo promedio (5 hábitos/día):**
- Ingresos diarios: ~100-150 🎬
- Ingresos mensuales: ~3,000-4,500 🎬
- Gasto mensual estimado: ~2,000-3,000 🎬
- **Balance positivo:** El usuario siempre progresa sin necesidad de comprar.

**Principio de diseño:** La economía nunca debe bloquear el progreso. Los Rollos de Celuloide son solo para cosméticos opcionales.

---

# 5. Sistema de Progresión

## 5.1 Niveles de Carrera Individual

| Nivel | Título | XP requerido (acumulado) | Desbloquea |
|---|---|---|---|
| 1 | Estudiante de Cine | 0 | Tutorial, estudio básico, 3 hábitos |
| 2 | Asistente de Producción | 500 | Modo pareja, 6 hábitos, sala de guionismo |
| 3 | Guionista | 1,500 | Tipos de película avanzados, personalización studio |
| 4 | Directora Independiente | 3,500 | Set de filmación, películas colaborativas |
| 5 | Directora Reconocida | 7,000 | Oficina de producción, festivales de temporada |
| 6 | Directora de Festivales | 13,000 | Vestuario, sala de edición, premios especiales |
| 7 | Directora Legendaria | 22,000 | Cine personal, museo de premios, modo prestige |
| 8-20 | Maestra del Cine (sub-niveles) | +5,000 cada uno | Cosméticos exclusivos, bonuses de XP |

## 5.2 Bonificadores de XP

| Condición | Multiplicador |
|---|---|
| Racha de 3 días | x1.1 |
| Racha de 7 días | x1.2 |
| Racha de 14 días | x1.35 |
| Racha de 30 días | x1.5 |
| Completar todos los hábitos del día | +20% de XP ese día |
| Hábito completado en horario configurado | +10% XP |
| Festival activo | +15% XP en hábitos relacionados |

## 5.3 Niveles de Pareja (Co-progresión)

| Nivel de Pareja | Título | Condición | Desbloquea |
|---|---|---|---|
| 1 | Compañeras de Set | Ambas en nivel ≥2 | Mensajes de ánimo |
| 2 | Equipo Creativo | 10 hábitos combinados/semana | Regalo de recursos |
| 3 | Co-directoras | Primera película colaborativa | Desafíos conjuntos |
| 4 | Dúo de Festival | 3 películas colaborativas | Sala compartida en el estudio |
| 5 | Leyenda en Pareja | Ambas en nivel ≥6 | Premio especial, cosmético exclusivo |

## 5.4 Las Áreas del Estudio y su Desbloqueo

| Área | Nivel requerido | Función en el juego |
|---|---|---|
| Vestíbulo del Estudio | Nivel 1 | Hub central, siempre visible |
| Sala de Guionismo | Nivel 2 | Ver/gestionar hábitos de escritura |
| Set de Filmación | Nivel 4 | Panel de producción de películas |
| Oficina de Producción | Nivel 5 | Gestión de recursos, estadísticas |
| Vestuario | Nivel 6 | Personalización de avatar |
| Sala de Edición | Nivel 6 | Post-producción, ajuste de películas |
| Cine Personal | Nivel 7 | Ver filmografía completa, proyectar |
| Museo de Premios | Nivel 7 | Logros, premios, historia del estudio |

---

# 6. Pantallas Principales

## 6.1 Listado Completo de Pantallas

### Flujo de Onboarding (6 pantallas)
1. **Splash / Intro** — Animación del logo, tagline
2. **Bienvenida** — "Tu historia en el cine comienza aquí"
3. **Crear perfil** — Nombre, foto/avatar inicial
4. **Selección de hábitos iniciales** — Elegir 3-5 hábitos de inicio
5. **Vincular pareja** — Código de invitación o saltar
6. **Tour del estudio** — Introducción animada a las áreas

### Pantallas Principales (App)
7. **Home — El Estudio** — Vista isométrica del estudio virtual
8. **Mis Hábitos** — Lista de hábitos diarios, estado de completion
9. **Producción** — Estado actual de la película en producción
10. **Filmografía** — Galería de películas completadas
11. **Mi Pareja** — Vista del progreso de la pareja, mensajes
12. **Perfil y Carrera** — Nivel, XP, logros, avatar
13. **Tienda del Estudio** — Decoraciones y cosméticos
14. **Configurar Hábito** — Crear/editar un hábito individual
15. **Detalle de Película** — Póster, sinopsis, créditos de una película
16. **Nueva Producción** — Iniciar una nueva película, elegir tipo
17. **Festival de la Semana** — Evento temporal con desafíos especiales
18. **Logros** — Sistema de achievements
19. **Configuración** — Notificaciones, cuenta, privacidad
20. **Streak Recovery** — Pantalla si se rompe una racha

---

# 7. Flujo de Usuario

## 7.1 Onboarding (Primera vez)

```
Descarga app
    ↓
Splash animado (3 seg)
    ↓
Pantalla de bienvenida con tagline
    ↓
Crear perfil (nombre + avatar inicial de 6 opciones)
    ↓
Seleccionar 3 hábitos iniciales (de lista de 12)
    ↓
¿Tienes pareja en la app? → [Sí: ingresar código] [No: continuar sola]
    ↓
Tour del estudio (3 slides animados)
    ↓
Home — primer día
```

## 7.2 Flujo Diario (Usuario Activa)

```
Abrir app (notificación matutina opcional)
    ↓
Ver el estudio — ¿hay algo nuevo? (animación pequeña)
    ↓
Revisa hábitos del día → Marcar completados
    ↓
Animación de recompensa: XP + Recursos cinematográficos
    ↓
Ver progreso de producción actual
    ↓
¿La pareja mandó algo? → Ver mensaje / regalo
    ↓
Opcional: Decorar el estudio o explorar tienda
    ↓
Cerrar app
```

## 7.3 Flujo de Producción de Película

```
Tener recursos suficientes para Fase 1
    ↓
Iniciar nueva producción → Elegir tipo de película (o dejar que la app elija)
    ↓
Fase 1: Desarrollo — continuar hábitos por 3+ días
    ↓
Notificación: "Tu guión está listo — comienza el rodaje"
    ↓
Fase 2: Rodaje — 5+ días de hábitos
    ↓
Fase 3: Post-producción — 2+ días
    ↓
ESTRENO: Animación especial
    ↓
Recibir póster + título + sinopsis generados por IA
    ↓
Película agregada a filmografía
    ↓
Opción: Compartir con pareja / Compartir externamente
```

## 7.4 Flujo de Pareja

```
Usuaria A completa un hábito difícil
    ↓
Usuaria B recibe notificación suave: "Lucía completó su hábito de ejercicio"
    ↓
Usuaria B puede enviar mensaje de ánimo (de biblioteca o personalizado)
    ↓
Usuaria A recibe el mensaje → pequeña animación
    ↓
Ambas pueden iniciar desafío conjunto (ej: "Ambas meditan esta semana")
    ↓
Al completarlo, ambas reciben recompensa + avanza nivel de pareja
```

---

# 8. Wireframes Conceptuales

## 8.1 Home — El Estudio (Vista principal)

```
┌─────────────────────────────────────────┐
│  🎬 CineLife        [🔔] [👤]           │
│─────────────────────────────────────────│
│                                         │
│   ┌─────────────────────────────────┐   │
│   │                                 │   │
│   │   [ILUSTRACIÓN ISOMÉTRICA       │   │
│   │    DEL ESTUDIO VIRTUAL]         │   │
│   │                                 │   │
│   │   🏠 Vestíbulo                  │   │
│   │   📝 Sala de Guionismo          │   │
│   │   🎥 Set de Filmación           │   │
│   │   🔒 Oficina (nv.5)             │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│  ─────── HOY ────────                   │
│  ✅ Ejercicio       ⬜ Meditación       │
│  ✅ Leer            ⬜ Journaling       │
│                                         │
│  🎞️ En producción: "Película sin título"│
│  ████████░░░░ Fase 2 — 60%              │
│                                         │
│─────────────────────────────────────────│
│  [🏠 Estudio] [✓ Hábitos] [🎬 Prod] [👫]│
└─────────────────────────────────────────┘
```

## 8.2 Mis Hábitos

```
┌─────────────────────────────────────────┐
│  ← Mis Hábitos        Lunes 2 Jun       │
│─────────────────────────────────────────│
│  Racha actual: 🔥 12 días               │
│  Hoy: 2/5 completados                   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ✅ Ejercicio                      │  │
│  │    +40 XP  ⚡x2  🎭x1            │  │
│  │    Completado hace 2h             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ ✅ Leer                           │  │
│  │    +35 XP  📝x1  ✨x1            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ ⬜ Meditación            [MARCAR] │  │
│  │    +25 XP  ✨x2                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ ⬜ Journaling             [MARCAR]│  │
│  │    +30 XP  ✨x1  📝x1            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ ⬜ Trabajar en proyecto   [MARCAR]│  │
│  │    +60 XP  🎞️x2  ✨x1            │  │
│  └───────────────────────────────────┘  │
│                                         │
│        [+ Agregar nuevo hábito]         │
│─────────────────────────────────────────│
│  [🏠 Estudio] [✓ Hábitos] [🎬 Prod] [👫]│
└─────────────────────────────────────────┘
```

## 8.3 Panel de Producción

```
┌─────────────────────────────────────────┐
│  ← Producción                           │
│─────────────────────────────────────────│
│                                         │
│  🎬 "Sin título" — Drama Indie          │
│  Directora: Valentina                   │
│  Día 8 de producción                    │
│                                         │
│  [FASE 1: DESARROLLO ✅]                │
│  [FASE 2: RODAJE — EN PROGRESO]         │
│  [FASE 3: POST-PRODUCCIÓN 🔒]           │
│                                         │
│  Recursos para terminar Fase 2:         │
│  ⚡ Energía:   ████████░░░  8/10       │
│  🎞️ Negativo:  ██████░░░░░  4/6        │
│  🎭 Props:      ████░░░░░░░  2/4        │
│                                         │
│  Estimación: 3-4 días más               │
│  (completando hábitos de bienestar      │
│   y creativos)                          │
│                                         │
│  ───── Producción colaborativa ─────    │
│  👫 Lucía puede contribuir Energía      │
│  [Enviar solicitud de colaboración]     │
│                                         │
│  [PAUSAR] [VER RECURSOS]                │
│─────────────────────────────────────────│
│  [🏠 Estudio] [✓ Hábitos] [🎬 Prod] [👫]│
└─────────────────────────────────────────┘
```

## 8.4 Vista de Pareja

```
┌─────────────────────────────────────────┐
│  ← Mi Pareja                           │
│─────────────────────────────────────────│
│                                         │
│  👫 Valentina & Lucía                   │
│  Equipo Creativo — Nivel 2 de pareja    │
│  ████████░░░░ 45% → Co-directoras      │
│                                         │
│  ─── Lucía hoy ───                      │
│  🔥 Racha: 8 días                       │
│  Hábitos: ✅✅⬜⬜  (2/4)              │
│  Película en producción: Sí             │
│                                         │
│  ─── Mensajes ───                       │
│  Lucía: "¡Vamos que puedes! 💪"        │
│  Hace 2 horas                           │
│                                         │
│  [ENVIAR ÁNIMO]  [REGALAR RECURSO]      │
│                                         │
│  ─── Desafío conjunto activo ───        │
│  "Ambas meditan 5 días esta semana"     │
│  Valentina: ██████░░░░  3/5             │
│  Lucía:     ████░░░░░░  2/5             │
│  Recompensa: 100🎬 + Recurso especial   │
│                                         │
│  [VER HISTORIAL]  [NUEVO DESAFÍO]       │
│─────────────────────────────────────────│
│  [🏠 Estudio] [✓ Hábitos] [🎬 Prod] [👫]│
└─────────────────────────────────────────┘
```

## 8.5 Estreno de Película (Pantalla especial)

```
┌─────────────────────────────────────────┐
│                                         │
│         ✨ ESTRENO MUNDIAL ✨           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │   [PÓSTER GENERADO POR IA]      │   │
│  │   Imagen cinematográfica        │   │
│  │   estilo indie / festival       │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  "Las Horas Azules"                     │
│  Drama contemplativo • 2026             │
│  Directora: Valentina                   │
│                                         │
│  "Una meditación visual sobre el        │
│  tiempo y la memoria. Filmada desde     │
│  la quietud, busca los pequeños         │
│  momentos que construyen una vida."     │
│                                         │
│  ⭐⭐⭐⭐½  Crítica especializada       │
│  ❤️❤️❤️❤️❤️  Calificación de público  │
│                                         │
│  +150 🎬  +200 XP  +1 Logro           │
│                                         │
│  [GUARDAR EN FILMOGRAFÍA]               │
│  [COMPARTIR CON LUCÍA]                  │
│  [COMPARTIR EXTERNAMENTE]               │
│                                         │
└─────────────────────────────────────────┘
```

---

# 9. Base de Datos

## 9.1 Diagrama de Entidades

```
┌──────────────┐       ┌──────────────────┐
│    users     │       │     couples      │
├──────────────┤       ├──────────────────┤
│ id (PK)      │───┐   │ id (PK)          │
│ email        │   └──▶│ user_a_id (FK)   │
│ username     │   ┌──▶│ user_b_id (FK)   │
│ avatar_url   │   │   │ couple_level     │
│ career_level │   │   │ couple_xp        │
│ career_xp    │   │   │ created_at       │
│ coins        │   │   └──────────────────┘
│ premium      │   │
│ streak_days  │   │   ┌──────────────────┐
│ created_at   │───┘   │     habits       │
└──────────────┘       ├──────────────────┤
        │              │ id (PK)          │
        │              │ user_id (FK)     │
        │              │ name             │
        │              │ category         │
        │              │ xp_reward        │
        │              │ is_active        │
        │              │ target_time      │
        │              └──────────────────┘
        │                      │
        │              ┌──────────────────┐
        │              │   habit_logs     │
        │              ├──────────────────┤
        │              │ id (PK)          │
        │              │ habit_id (FK)    │
        │              │ user_id (FK)     │
        │              │ completed_at     │
        │              │ xp_earned        │
        │              │ resources_earned │
        │              └──────────────────┘
        │
        │       ┌──────────────────────────┐
        │       │        movies            │
        ├──────▶├──────────────────────────┤
        │       │ id (PK)                  │
        │       │ user_id (FK)             │
        │       │ couple_id (FK, nullable) │
        │       │ title                    │
        │       │ genre                    │
        │       │ synopsis                 │
        │       │ poster_url               │
        │       │ critic_rating            │
        │       │ audience_rating          │
        │       │ phase (1/2/3/complete)   │
        │       │ started_at               │
        │       │ completed_at             │
        │       │ is_collaborative         │
        │       └──────────────────────────┘
        │
        │       ┌──────────────────────────┐
        │       │      user_resources      │
        ├──────▶├──────────────────────────┤
        │       │ id (PK)                  │
        │       │ user_id (FK)             │
        │       │ resource_type            │
        │       │ quantity                 │
        │       └──────────────────────────┘
        │
        │       ┌──────────────────────────┐
        │       │      studio_items        │
        ├──────▶├──────────────────────────┤
        │       │ id (PK)                  │
        │       │ user_id (FK)             │
        │       │ item_id                  │
        │       │ area                     │
        │       │ position_x               │
        │       │ position_y               │
        │       │ purchased_at             │
        │       └──────────────────────────┘
        │
        │       ┌──────────────────────────┐
        └──────▶│       messages           │
                ├──────────────────────────┤
                │ id (PK)                  │
                │ sender_id (FK)           │
                │ receiver_id (FK)         │
                │ couple_id (FK)           │
                │ type (cheer/gift/system) │
                │ content                  │
                │ resource_gift_type       │
                │ resource_gift_qty        │
                │ read_at                  │
                │ created_at               │
                └──────────────────────────┘
```

## 9.2 Tablas Adicionales

```sql
-- Logros / Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  code VARCHAR UNIQUE,        -- 'first_movie', 'streak_30', etc.
  name VARCHAR,
  description TEXT,
  icon_url VARCHAR,
  xp_reward INT,
  coin_reward INT
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  achievement_id UUID REFERENCES achievements,
  unlocked_at TIMESTAMP
);

-- Desafíos de pareja
CREATE TABLE couple_challenges (
  id UUID PRIMARY KEY,
  couple_id UUID REFERENCES couples,
  title VARCHAR,
  description TEXT,
  goal_type VARCHAR,          -- 'both_habit', 'total_xp', 'movie'
  goal_value INT,
  user_a_progress INT DEFAULT 0,
  user_b_progress INT DEFAULT 0,
  coin_reward INT,
  resource_reward JSONB,
  expires_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Catálogo de items de la tienda
CREATE TABLE shop_items (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  area VARCHAR,              -- 'screenwriting', 'filming_set', etc.
  cost_coins INT,
  cost_premium INT,
  required_level INT,
  preview_url VARCHAR,
  is_seasonal BOOLEAN DEFAULT false
);
```

---

# 10. Arquitectura Técnica

## 10.1 Stack Recomendado

### Frontend — React Native + Expo
```
React Native 0.74 + Expo SDK 51
├── Expo Router v3 (navegación file-based)
├── Zustand (estado global del cliente)
├── React Query / TanStack Query (caché de servidor)
├── React Native Reanimated 3 (animaciones)
├── Lottie for React Native (animaciones JSON)
├── Skia / React Native Skia (ilustraciones del estudio)
└── RevenueCat SDK (gestión de IAP multiplataforma)
```

**Por qué React Native sobre Flutter:**
- Ecosistema más maduro para integraciones de terceros (RevenueCat, Sentry, PostHog)
- Expo simplifica el build pipeline para un equipo pequeño
- Más fácil contratar desarrolladores

### Backend — Node.js + TypeScript
```
Node.js 20 LTS + TypeScript 5
├── Fastify 4 (API REST — más rápido que Express)
├── Prisma ORM (PostgreSQL, type-safe)
├── Zod (validación de esquemas)
├── BullMQ + Redis (cola de jobs para generación IA)
├── Supabase Auth (JWT + OAuth)
└── Supabase Realtime (websockets para mensajes en tiempo real)
```

### Infraestructura
```
Base de datos:  PostgreSQL 16 vía Supabase
Cache/Queues:   Redis vía Upstash (serverless)
CDN/Storage:    Cloudflare R2 (pósters, assets)
Hosting API:    Railway.app (auto-deploy desde GitHub)
Push:           Firebase Cloud Messaging (iOS + Android)
```

### IA
```
Texto (título, sinopsis):  OpenAI GPT-4o-mini
Imágenes free tier:        Stable Diffusion (Replicate API)
Imágenes premium:          DALL-E 3
Orquestación:              BullMQ job queue (asíncrono)
```

## 10.2 Diagrama de Servicios

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE MÓVIL                      │
│         React Native + Expo (iOS / Android)          │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS REST + WebSocket
┌──────────────────────▼──────────────────────────────┐
│                   API GATEWAY                        │
│              Fastify (Railway.app)                   │
│  ┌────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ Auth routes│ │Habit routes │ │ Movie routes   │  │
│  │ /auth/*    │ │ /habits/*   │ │ /movies/*      │  │
│  └────────────┘ └─────────────┘ └────────────────┘  │
│  ┌────────────┐ ┌─────────────┐                      │
│  │Couple routes│ │ Shop routes │                      │
│  │ /couple/*  │ │ /shop/*     │                      │
│  └────────────┘ └─────────────┘                      │
└──────┬──────────────────────────────────────────────┘
       │
┌──────▼──────┐  ┌──────────────┐  ┌────────────────┐
│ PostgreSQL  │  │ Redis Queue  │  │ Supabase RT    │
│ (Supabase)  │  │ (BullMQ)     │  │ (WebSockets)   │
└─────────────┘  └──────┬───────┘  └────────────────┘
                        │
               ┌────────▼────────┐
               │  AI Worker      │
               │  (Node process) │
               │  GPT-4o-mini    │
               │  Replicate SD   │
               │  DALL-E 3       │
               └────────┬────────┘
                        │
               ┌────────▼────────┐
               │ Cloudflare R2   │
               │ (Pósters PNG)   │
               └─────────────────┘
```

## 10.3 Decisiones de Seguridad

- Autenticación: JWT con refresh tokens rotatorios (via Supabase Auth)
- Row Level Security en PostgreSQL: cada usuario solo lee sus datos
- Validación de entrada: Zod en todas las rutas de la API
- Rate limiting: 100 requests/minuto por usuario en endpoints de escritura
- Generación IA: asíncrona y en cola — nunca bloquea el request del usuario
- Contenido generado: moderación automática antes de mostrar (OpenAI Moderation API)

---

# 11. Monetización

## 11.1 Modelo Freemium

**Principio:** El juego completo es gratis. Los Rollos de Celuloide (premium) son puramente cosméticos y de comodidad — nunca bloquean el progreso narrativo.

### Free — Para siempre gratis
- Todos los hábitos (hasta 8 activos)
- Sistema completo de XP y niveles
- Producción de películas (póster en estilo SD gratuito)
- Modo pareja completo
- 3 áreas del estudio (de 8)
- 1 película en producción a la vez
- Filmografía completa

### CineLife+ — Suscripción Premium
**Precio:** $4.99 USD/mes o $34.99 USD/año

| Feature Premium | Por qué es valioso |
|---|---|
| Pósters DALL-E 3 (alta calidad) | Las películas se ven extraordinarias |
| Hábitos ilimitados | Sin límite de 8 |
| 2 producciones simultáneas | Más ritmo de juego |
| Temas visuales del estudio (5 exclusivos) | Personalización profunda |
| Acceso anticipado a áreas del estudio | Desbloqueo 1 nivel antes |
| Escudos de racha infinitos | Nunca perder la racha por un mal día |
| Estadísticas avanzadas | Gráficas de hábitos, análisis de películas |
| Exportar filmografía como PDF | Recuerdo tangible |

### Plan Pareja — CineLife+ Dúo
**Precio:** $7.99 USD/mes (vs $9.98 si cada una paga por separado)
- Ambas usuarios obtienen CineLife+
- Sala compartida en el estudio (cosmético exclusivo)
- Película colaborativa mensual garantizada con recursos bonus

### Compras únicas (IAP)
| Item | Precio |
|---|---|
| Pack de 80 Rollos de Celuloide | $1.99 |
| Pack de 250 Rollos de Celuloide | $4.99 |
| Pack de 600 Rollos de Celuloide | $9.99 |
| Colección de decoraciones (set temático) | $2.99 |
| Pack "Festival de Cannes" (cosmético exclusivo) | $3.99 |

## 11.2 Proyección de Ingresos (Año 1)

| Métrica | Estimación conservadora |
|---|---|
| Usuarios registrados (mes 12) | 5,000 |
| DAU/MAU | 35% → 1,750 DAU |
| Tasa de conversión a premium | 5% |
| Usuarios premium | 250 |
| ARPU mensual (mix mensual/anual/IAP) | ~$4.00 |
| **MRR estimado mes 12** | **~$1,000** |
| **ARR estimado** | **~$12,000** |

*Nota: Estas cifras son para validación, no proyecciones definitivas.*

## 11.3 Ética de Monetización

- **Sin loot boxes.** Sin sorpresas de pago aleatorias.
- **Sin dark patterns.** Sin timers de urgencia falsos, sin vergüenza por no pagar.
- **Sin pay-to-win.** El progreso narrativo es 100% gratuito.
- **Precios transparentes.** El precio anual se muestra claramente como equivalente mensual.

---

# 12. Retención de Usuarios

## 12.1 Retención a Corto Plazo (Día 1-7)

| Mecanismo | Implementación |
|---|---|
| Onboarding gradual | No abrumar: solo 3 hábitos en el día 1 |
| Primera película rápida | Película "demo" generada en día 3 (con recursos gratis) |
| Notificación cálida | "Tu estudio te espera" (no "¡Abre la app!") |
| Logro día 1 | "Primera claqueta" — primer hábito completado |
| Ver el estudio cambiar | Una decoración gratuita el día 1 para personalizar |

## 12.2 Retención a Medio Plazo (Día 7-30)

| Mecanismo | Implementación |
|---|---|
| Racha visual | Fuego animado que crece con la racha |
| Progreso de carrera visible | Barra de XP en el home |
| Primera película real (día ~10) | Momento emocional fuerte, compartible |
| Notificaciones del estudio | "Tu sala de guionismo necesita atención" |
| Desafío semanal con pareja | Nuevo cada lunes, recompensa el domingo |

## 12.3 Retención a Largo Plazo (Mes 1+)

| Mecanismo | Implementación |
|---|---|
| Festival mensual | Temática especial: Festival de Invierno, Verano de Cine |
| Nuevas áreas del estudio | Siempre hay algo por desbloquear |
| Filmografía que crece | Ver la colección personal motiva continuar |
| Logros de carrera importantes | Nivel 5, 7, etc. — momentos de celebración |
| Contenido de temporada | Diciembre: estética de gala de premios |

## 12.4 Estrategia de Notificaciones

**Principio:** Pocas, cálidas y útiles. Nunca ansiosas.

| Notificación | Cuándo | Tono |
|---|---|---|
| Recordatorio de hábitos | Hora configurada por el usuario | "Es hora de tu momento creativo" |
| Pareja completó algo | Al instante (opcional) | "Lucía avanzó hoy 💪" |
| Producción avanza de fase | Automático | "¡El rodaje de tu película ha comenzado!" |
| Racha en riesgo (23:00) | Solo si no completó ningún hábito | "Tu racha de 12 días termina hoy" |
| Festival nuevo | Cada lunes | "Nuevo festival disponible esta semana" |
| Mensaje de pareja | Al instante | "Lucía te envió algo" |

**Frecuencia máxima:** 2 notificaciones por día. El usuario puede configurar todas.

---

# 13. Diseño UX/UI

## 13.1 Paleta de Colores

```
Colores primarios:
  Cinemática Dorada:    #F5C842  (premios, highlights, XP)
  Celuloide Cálido:     #E8784D  (CTAs principales, progreso)
  Estudio Profundo:     #1C1F2E  (backgrounds, modo noche)

Colores secundarios:
  Sala de Edición:      #4A90D9  (elementos de producción)
  Vestuario Rosa:       #E8A5B0  (pareja, mensajes)
  Jardín del Estudio:   #7EC8A0  (hábitos completados, éxito)

Neutrales:
  Pergamino:            #F7F0E6  (backgrounds claros)
  Tinta:                #2D2D2D  (texto principal)
  Niebla:               #A8A8B3  (texto secundario)
```

## 13.2 Tipografía

```
Títulos/Display:  Playfair Display (serif, cinematográfica, elegante)
Cuerpo/UI:        Inter (sans-serif, legible, moderna)
Acentos:          DM Serif Display (para nombres de películas)
Números/Stats:    JetBrains Mono (para XP, monedas, contadores)
```

## 13.3 Principios de Animación

| Tipo | Especificación | Propósito |
|---|---|---|
| Transiciones de pantalla | Slide horizontal suave, 300ms ease-out | Sensación de movimiento orgánico |
| Completar hábito | Pulse + partículas doradas, 600ms | Satisfacción inmediata |
| Estreno de película | Animación especial 3-4 segundos | Momento memorable y emocional |
| Subir de nivel | Confetti + fanfare visual | Celebración genuina |
| Estudio | Micro-animaciones ambientales (luz, hojas) | Mundo vivo y cálido |
| Loading | Bobina de film girando | On-brand, nunca frustrante |

## 13.4 Ilustración del Estudio

- **Estilo:** Pixel art isométrico cálido (16px base grid)
- **Paleta:** Limitada a 32 colores por área para cohesión
- **Iluminación:** Luz cálida, sombras suaves, sin hard edges
- **Tamaño:** El estudio se navega con scroll/pan, no cabe en una pantalla
- **Animaciones del mundo:** Personaje de avatar se mueve, luces parpadean suavemente

## 13.5 Accesibilidad

- Contraste mínimo WCAG AA en todos los textos
- Soporte para Dynamic Type (iOS) y Font Scale (Android)
- Modo de alto contraste disponible en configuración
- Todas las animaciones respetan `prefers-reduced-motion`
- Etiquetas de accesibilidad en todos los elementos interactivos
- Soporte para VoiceOver / TalkBack en flujos principales

---

# 14. Sistema de Recompensas

## 14.1 Recompensas por Hábito (Tabla Completa)

| Hábito | XP | 🎬 Fotogramas | Recursos principales |
|---|---|---|---|
| Dormir 7-8h | 30 | 8 | ⚡x2 |
| Hacer ejercicio | 40 | 12 | ⚡x2, 🎭x1 |
| Meditación | 25 | 8 | ✨x2 |
| Estudiar 30 min+ | 50 | 15 | 📝x2, 💰x1 |
| Leer 20 min+ | 35 | 10 | 📝x1, ✨x1 |
| Journaling | 30 | 9 | ✨x1, 📝x1 |
| Proyecto personal | 60 | 18 | 🎞️x2, ✨x1 |
| Hobby creativo | 45 | 13 | 🎞️x1, 🎭x1 |
| Actividad social | 35 | 10 | 💰x1, 🎭x1 |
| Aprender algo nuevo | 40 | 12 | 📝x1, 💰x1 |
| Tiempo al aire libre | 30 | 9 | ⚡x1, 🎞️x1 |
| Cocinar algo nuevo | 35 | 10 | 🎭x1, ✨x1 |

## 14.2 Recompensas Especiales

| Evento | Recompensa |
|---|---|
| Primera película completada | 500 XP + 200🎬 + Logro + Tema especial |
| Racha de 7 días | 50🎬 + Escudo de racha gratis |
| Racha de 30 días | 200🎬 + Cosmético exclusivo |
| Nivel de carrera subido | 100-500🎬 según nivel + Fanfare |
| Desafío de pareja completado | 75🎬 + recursos variables |
| Festival completado | 100🎬 + ítem exclusivo de temporada |
| Primer logro | 50 XP + tutorial de logros |

## 14.3 Logros (Achievements) — Lista MVP

| Código | Nombre | Condición | Recompensa |
|---|---|---|---|
| `first_habit` | Primera Claqueta | Completa tu primer hábito | 50 XP |
| `first_movie` | Ópera Prima | Completa tu primera película | 500 XP + 200🎬 |
| `streak_7` | Semana de Rodaje | Racha de 7 días | 50🎬 |
| `streak_30` | Un Mes en el Set | Racha de 30 días | 200🎬 + cosmético |
| `all_habits_day` | Día Perfecto | Completa todos tus hábitos en un día | 30🎬 |
| `level_5` | Directora Independiente | Alcanza nivel 5 | 300🎬 |
| `couple_challenge` | Equipo Sólido | Completa tu primer desafío de pareja | 75🎬 |
| `10_movies` | Décima Sinfonía | Completa 10 películas | 1000 XP |
| `all_habits` | Directora Total | Ten activos los 12 tipos de hábitos | cosmético |

---

# 15. Funciones Sociales

## 15.1 Qué ve cada una de la otra

| Dato | ¿Visible para la pareja? | Nivel de detalle |
|---|---|---|
| Racha actual | Sí | Número exacto |
| Nivel de carrera | Sí | Nivel y título |
| Hábitos completados hoy | Sí | Cuántos (no cuáles, si el usuario lo prefiere) |
| Película en producción | Sí | Nombre y fase, no detalles |
| Filmografía | Sí | Todas las películas completas |
| Hábitos específicos | Configurable | El usuario decide si mostrar |
| Recursos cinematográficos | No | Privado (evita presión) |
| Logros | Sí | Notificación al desbloquear |

## 15.2 Mensajes de Ánimo

**Mensajes predefinidos** (curados para no sonar vacíos):
- "¡Estoy orgullosa de ti hoy!"
- "Tú puedes con esto 💪"
- "Tu película va a ser increíble"
- "Un paso a la vez, estás progresando"
- "¡Hoy fue un gran día para el estudio!"

**Mensajes personalizados:** Texto libre con límite de 150 caracteres.

**Regalo de recursos:** Se puede enviar hasta 5 unidades de un recurso por día. Anima la colaboración sin romper la economía.

## 15.3 Desafíos de Pareja

| Tipo | Ejemplo | Duración | Recompensa |
|---|---|---|---|
| Hábito compartido | "Ambas meditan 5 días esta semana" | 1 semana | 100🎬 cada una |
| Meta de XP conjunta | "Juntas acumulamos 1000 XP esta semana" | 1 semana | 75🎬 + recurso |
| Producción conjunta | "Completamos una película colaborativa" | Abierto | 200🎬 + logro |
| Racha doble | "Ambas mantenemos racha por 14 días" | 14 días | Cosmético exclusivo |

## 15.4 Película Colaborativa

- Se inicia cuando ambas acuerdan colaborar (ambas aprueban)
- Los recursos de las dos contribuyen a la producción
- Los hábitos de las dos alimentan las fases
- Al terminar: ambas reciben la película en su filmografía
- El póster muestra: "Dirigida por Valentina & Lucía"
- Genera nivel de pareja compartido

## 15.5 Lo que NO tiene la app (por diseño)

- Sin ranking global entre parejas
- Sin comparaciones directas de productividad
- Sin notificaciones de "tu pareja está ganando"
- Sin presión de que si una falla, la otra pierde
- Sin acceso a los hábitos privados de la otra

---

# 16. IA dentro del Producto

## 16.1 Generación de Película — Flujo Técnico

```
Usuaria completa Fase 3 (post-producción)
        ↓
Backend analiza hábitos completados durante la producción
        ↓
Calcula: distribución por categoría, diversidad, consistencia
        ↓
Determina: género base, estilo narrativo, tono emocional
        ↓
Envía job a BullMQ queue
        ↓
AI Worker procesa (2-5 minutos)
  ├── GPT-4o-mini: Genera título + sinopsis + créditos
  └── Replicate SD / DALL-E 3: Genera póster
        ↓
Resultados guardados en DB + imagen en Cloudflare R2
        ↓
Push notification: "¡Tu película está lista!"
        ↓
Usuaria abre la app → Pantalla de Estreno
```

## 16.2 Prompt Template para GPT-4o-mini

```
System: Eres un crítico de cine especializado en cine independiente y festivales internacionales. 
Generas fichas de películas imaginarias que reflejan el crecimiento personal de su directora.
Tu tono es artístico, emotivo y específico. Nunca genérico.

User: Genera la ficha completa de una película indie con estas características:

Datos de producción:
- Días de producción: {production_days}
- Hábitos dominantes: {habit_distribution}  
  (ej: "60% bienestar/meditación, 30% lectura/estudio, 10% social")
- Diversidad de hábitos: {diversity_score}/10
- Consistencia (racha promedio): {consistency}/10
- Nivel de carrera de la directora: {career_level}
- Es película colaborativa: {is_collaborative}
- Nombre del estudio: {studio_name}

Genera en JSON:
{
  "title": "Título poético en español (2-4 palabras)",
  "genre": "Género específico (ej: 'Drama contemplativo', 'Thriller existencial')",
  "tagline": "Frase promocional de 8-12 palabras",
  "synopsis": "Sinopsis de 60-80 palabras, sin nombrar personajes directamente",
  "director_note": "Nota de la directora, 20-30 palabras, en primera persona",
  "critic_rating": número entre 3.0 y 5.0 (mayor consistencia = mayor rating),
  "audience_rating": número entre 3.5 y 5.0 (mayor diversidad = mayor rating),
  "festival_selection": "Nombre de festival ficticio donde se presentó"
}
```

## 16.3 Prompt Template para el Póster (DALL-E 3)

```
A minimalist art house film festival poster for an independent film titled "{title}", genre: {genre}.
Aesthetic: warm, intimate, hand-crafted feel. Style inspired by {style_reference}.
Color palette: {color_palette}.
No text in the image. Aspect ratio 2:3 (portrait). 
Cinematic quality, soft gradients, emotionally resonant.
Abstract but meaningful visual metaphor.
```

**Referencia de estilo por género:**
| Género | Referencia de estilo |
|---|---|
| Drama contemplativo | "Chantal Akerman, Wong Kar-wai" |
| Thriller intelectual | "David Fincher, Andrei Tarkovsky" |
| Comedia romántica | "Nora Ephron, Eric Rohmer" |
| Documental personal | "Agnès Varda, Chris Marker" |
| Experimental | "Stan Brakhage, Maya Deren" |
| Ciencia ficción indie | "Ari Aster, Alex Garland" |

## 16.4 Moderación del Contenido Generado

Todo el contenido generado por IA pasa por:
1. **OpenAI Moderation API** — filtra contenido inapropiado
2. **Regex básico** — filtra palabras clave problemáticas
3. **Fallback curado** — si falla la moderación, se usa una de 20 películas pre-generadas

## 16.5 Costo Estimado de IA por Película

| Componente | Costo estimado |
|---|---|
| GPT-4o-mini (texto completo) | ~$0.002 |
| Stable Diffusion / Replicate (free) | ~$0.004 |
| DALL-E 3 (premium) | ~$0.04 |
| **Total por película (free)** | **~$0.006** |
| **Total por película (premium)** | **~$0.042** |

Con 1,000 usuarios activos generando 1 película/mes:
- Free: ~$6/mes en IA
- Premium (250 usuarios): ~$10.50/mes en IA
- **Total: ~$16.50/mes** — muy manejable

---

# 17. MVP Inicial

## 17.1 Features del MVP v1.0

### Incluidos en MVP
- [ ] Registro y login (email + Apple/Google)
- [ ] Perfil básico con avatar (6 opciones)
- [ ] Crear y gestionar hábitos (hasta 8)
- [ ] Marcar hábitos como completados
- [ ] Sistema de XP y niveles (1-7)
- [ ] Recursos cinematográficos (6 tipos)
- [ ] Sistema de racha con escudo básico
- [ ] Producción de películas (3 fases)
- [ ] Generación IA de título + sinopsis (GPT-4o-mini)
- [ ] Generación de póster básico (Stable Diffusion / Replicate)
- [ ] Filmografía personal
- [ ] Estudio visual básico (3 áreas: vestíbulo, guionismo, set)
- [ ] Decoraciones básicas (10 items)
- [ ] Vincular pareja (código de invitación)
- [ ] Ver progreso de pareja (racha, nivel, hábitos del día)
- [ ] Mensajes de ánimo (predefinidos + personalizado)
- [ ] Regalo de recursos
- [ ] 1 desafío de pareja activo
- [ ] Notificaciones push básicas (recordatorio + logros)
- [ ] 10 logros
- [ ] Tienda básica (10 items con 🎬)

### Excluidos del MVP (V1.1+)
- Película colaborativa (complejidad técnica)
- Más de 3 áreas del estudio
- Festivales de temporada
- Plan premium / IAP
- Exportar filmografía
- Estadísticas avanzadas
- Avatar personalizable más allá de 6 opciones
- Sala de edición y vestuario
- Modo prestige

## 17.2 Métricas de Éxito del MVP

| Métrica | Objetivo a los 60 días de lanzamiento |
|---|---|
| Usuarios registrados | 500+ |
| Day 1 Retention | > 60% |
| Day 7 Retention | > 30% |
| Day 30 Retention | > 20% |
| Usuarios con pareja vinculada | > 40% |
| Películas completadas | > 200 total |
| Promedio de hábitos/usuario/día | > 2 |
| Rating en App Store | > 4.2 ⭐ |
| NPS | > 40 |

## 17.3 Criterio de Éxito para Continuar al V1.1

- Day 7 retention > 25% ✓
- Al menos 100 usuarios con 2+ semanas de uso activo ✓
- Al menos 50 películas generadas ✓
- 0 bugs críticos (crash rate < 1%) ✓

---

# 18. Roadmap de Desarrollo

## 18.1 Fase 0 — Validación (Semanas 1-2)

**Objetivo:** Validar el concepto antes de escribir código.

- Entrevistar a 15 parejas target
- Crear mockup interactivo en Figma (pantallas clave)
- Validar mecánica de película con 5 usuarios
- Confirmar disposición a pagar con pricing test
- Definir stack técnico final

**Deliverable:** Decisión go/no-go con datos reales.

## 18.2 Fase 1 — Fundamentos (Semanas 3-7)

**Objetivo:** Infraestructura y autenticación funcionando.

- Setup del monorepo (API + App)
- Base de datos con Prisma + Supabase
- Auth completo (email, Apple, Google)
- API básica: usuarios, hábitos, habit_logs
- App: Onboarding + pantalla de hábitos (sin gamificación)
- Sistema de XP y recursos (lógica)

**Deliverable:** Alpha interna — dos personas pueden registrarse y marcar hábitos.

## 18.3 Fase 2 — Gamificación Core (Semanas 8-12)

**Objetivo:** El game loop principal funcionando.

- Sistema de progresión (XP → niveles → desbloqueos)
- Recursos cinematográficos generados por hábitos
- Sistema de películas (3 fases con recursos reales)
- Integración IA: GPT-4o-mini para texto de película
- Integración IA: Replicate SD para pósters
- Pantalla de estreno animada
- Filmografía personal
- Sistema de rachas + escudo

**Deliverable:** Loop completo — hábito → recursos → película → filmografía.

## 18.4 Fase 3 — El Estudio (Semanas 13-16)

**Objetivo:** El mundo visual del estudio.

- Ilustraciones isométricas (3 áreas MVP)
- Micro-animaciones del estudio
- Sistema de decoraciones + tienda
- 10 items de tienda implementados
- Pantalla de perfil y carrera visual
- 10 logros implementados

**Deliverable:** El estudio se siente vivo y personalizable.

## 18.5 Fase 4 — Modo Pareja (Semanas 17-19)

**Objetivo:** La capa social funcionando.

- Vinculación de pareja (código)
- Vista del progreso de pareja
- Sistema de mensajes de ánimo
- Regalo de recursos
- Desafíos de pareja (1 activo)
- Notificaciones de pareja
- Niveles de pareja (1-3 para MVP)

**Deliverable:** Dos personas pueden usar la app juntas de forma significativa.

## 18.6 Fase 5 — Polish y Lanzamiento (Semanas 20-22)

**Objetivo:** App lista para el público.

- Notificaciones push completas
- Testing exhaustivo (iOS + Android)
- Optimización de performance
- Moderación de contenido IA
- App Store / Google Play submission
- Landing page del producto
- Beta pública cerrada (50-100 usuarios)
- Iteración según feedback de beta

**Deliverable:** V1.0 en App Store y Google Play.

## 18.7 Fase 6 — Crecimiento (Mes 6+)

- V1.1: Películas colaborativas, festival mensual, 5 áreas del estudio
- V1.2: Plan premium (CineLife+), IAP, pósters DALL-E 3
- V1.3: Estadísticas avanzadas, exportar filmografía, Plan Dúo
- V2.0: Eventos de temporada, nuevas áreas, modo prestige

## 18.8 Equipo Mínimo para Construir

| Rol | Tipo | Dedicación | Costo estimado/mes |
|---|---|---|---|
| Dev Full-Stack (React Native + Node) | Fundador o Contractor | Full-time | $3,000-5,000 |
| Diseñador UI/UX + Ilustrador | Contractor (crítico) | Part-time (50%) | $1,500-3,000 |
| Pixel Artist (estudio isométrico) | Freelance | Por proyecto | $2,000-4,000 (único) |
| Dev Backend (si fundador es frontend) | Contractor | Part-time (25%) | $800-1,500 |
| Fundador/PM | Fundador | Full-time | — |

**Costo operativo mensual estimado (meses 1-3):**

| Ítem | Costo/mes |
|---|---|
| Equipo (mínimo) | $4,500-9,500 |
| Supabase Pro | $25 |
| Railway / Fly.io | $50-100 |
| Upstash Redis | $20 |
| Cloudflare R2 | $5-15 |
| Replicate / OpenAI | $50-200 |
| RevenueCat | $0 (gratis hasta $10k MRR) |
| Sentry | $26 |
| PostHog Cloud | $0 (gratis hasta 1M eventos) |
| Apple Developer | $99/año (~$8/mes) |
| Google Play | $25 único |
| **Total infraestructura** | **~$190-395/mes** |
| **Total con equipo** | **~$4,700-9,900/mes** |

## 18.9 Hitos de Decisión (Go / No-Go)

| Hito | Fecha | Criterio Go | Criterio No-Go |
|---|---|---|---|
| H1: Validación de concepto | Semana 2 | 8/15 entrevistas confirman intención de uso | Menos de 5 personas lo usarían |
| H2: Alpha funciona | Semana 7 | Flujo completo sin crashes críticos | Bugs bloqueantes en flujo de producción |
| H3: Beta pública | Semana 21 | Day 7 retention > 25% | Day 7 < 20% → pivote de onboarding |
| H4: Lanzamiento | Semana 22 | App Store aprobada, crash rate < 1% | Rechazo de App Store |
| H5: PMF embrionario | Mes 4 | DAU/MAU > 20%, NPS > 40 | DAU/MAU < 15% → reevaluar mecánica |

## 18.10 Riesgos Principales

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Una pareja deja de usar la app y la otra también | Alta | App valiosa individualmente también; modo solo robusto |
| Costo de IA escala más rápido que ingresos | Media | Límite de 4 películas/mes en free; caché agresivo |
| Usuarios no entienden la mecánica de recursos | Media | Onboarding guiado; primera película con recursos de regalo |
| Generación de imágenes de baja calidad | Media | Curar prompts; 12 plantillas de fallback atractivas |
| App Store rechaza contenido de IA generado | Baja | Revisar políticas; moderación antes de mostrar |

---

# Apéndice A: Glosario

| Término | Definición |
|---|---|
| Racha (Streak) | Días consecutivos completando al menos un hábito |
| Escudo de Racha | Item que protege una racha ante 1 día de inactividad |
| Recurso Cinematográfico | Una de las 6 monedas de juego (Guión, Energía, Negativo, Inspiración, Prop, Crédito) |
| Fotograma (🎬) | La moneda general de gasto del juego |
| Rollo de Celuloide (🎥) | Moneda premium (IAP o recompensas especiales) |
| XP | Puntos de experiencia que suben el nivel de carrera |
| Nivel de Carrera | El nivel individual del jugador (1-20) con título cinematográfico |
| Nivel de Pareja | El nivel conjunto de la pareja (1-5) con título compartido |
| Producción | El proceso de crear una película virtual, con 3 fases |
| Estudio Virtual | El espacio visual principal del juego, con áreas desbloqueables |
| Festival | Evento semanal/temporal con bonus de rating y recompensas especiales |
| Película Colaborativa | Película producida con recursos y crédito de ambas integrantes |
| Cozy Game | Género de videojuego de ritmo tranquilo, estética cálida, sin presión extrema |
| IAP | In-App Purchase — compras dentro de la aplicación |
| DAU | Daily Active Users — usuarios activos diariamente |
| MAU | Monthly Active Users — usuarios activos en el mes |
| MRR | Monthly Recurring Revenue — ingresos recurrentes mensuales |
| NPS | Net Promoter Score — métrica de satisfacción y recomendación |

---

# Apéndice B: Referencias de Diseño Visual

### Juegos de referencia

| Referencia | Qué tomar de ella |
|---|---|
| Stardew Valley | Pixel art cozy, ritmo diario tranquilo, sistema de estaciones |
| Animal Crossing | Personalización del espacio, ritmo en tiempo real, eventos de temporada |
| Spiritfarer | Narrativa emocional, estética warm, mecánicas de cuidado |
| Unpacking | Simplicidad interactiva, satisfacción en acciones pequeñas |
| Townscaper | Estética de construcción pacífica |
| Alto's Odyssey | Gradientes de color, paleta cinematográfica |

### Apps de referencia UX

| App | Qué tomar de ella |
|---|---|
| Finch | Mascota visual, tono emocional cálido, onboarding gentil |
| Habitica | Sistema de recompensas, gamificación de hábitos |
| Duolingo | Rachas, notificaciones inteligentes, progreso visual |
| Letterboxd | Filmografía curada, estética cinéfila |
| Bear | Tipografía, uso del espacio en blanco |

---

# Apéndice C: Stack Tecnológico Resumido

```
FRONTEND
├── React Native 0.74 + Expo SDK 51
├── Expo Router v3 (navegación)
├── Zustand (estado global)
├── React Query / TanStack Query (servidor)
├── Reanimated 3 + Lottie (animaciones)
├── React Native Skia (ilustraciones del estudio)
└── RevenueCat SDK (IAP)

BACKEND
├── Node.js 20 + TypeScript 5
├── Fastify 4 (API REST)
├── Prisma ORM (PostgreSQL)
├── Zod (validación)
├── BullMQ + Redis (job queue para IA)
└── Supabase SDK (auth + realtime)

INFRAESTRUCTURA
├── PostgreSQL 16 (Supabase)
├── Redis (Upstash)
├── CDN Assets (Cloudflare R2)
├── Hosting API (Railway.app)
└── Push (Firebase Cloud Messaging)

IA
├── OpenAI GPT-4o-mini (texto de película)
├── Stable Diffusion via Replicate (pósters free)
├── DALL-E 3 (pósters premium)
└── BullMQ job queue (asíncrono)

OBSERVABILIDAD
├── Sentry (errores)
├── PostHog Cloud (analytics de producto)
└── Railway Logs (logs de servidor)
```

---

*Documento de diseño de producto — CineLife v1.0*  
*Versión del documento: 1.0 | Fecha: Junio 2026*  
*Este documento debe revisarse y actualizarse tras cada sprint de desarrollo.*
