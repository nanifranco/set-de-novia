# CineLife 🎬

App móvil para parejas donde los hábitos cotidianos se convierten en películas.

## Setup rápido

### 1. Instalar dependencias
```bash
cd cinelife
npm install
```

### 2. Configurar Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia el archivo `.env.example` a `.env.local` y agrega tus claves
3. Ejecuta el SQL de `supabase/schema.sql` en el SQL Editor de Supabase

### 3. Configurar las Edge Functions
```bash
npx supabase functions deploy generate-movie
npx supabase functions deploy recommend-movie
```

Agrega el secreto de OpenAI:
```bash
npx supabase secrets set OPENAI_API_KEY=sk-...
```

### 4. Crear las cuentas
Primero registra a **Nani** (usuario: `nani`) y luego a **María** (usuario: `maria`).

Para vincularlas como pareja, en Supabase ejecuta:
```sql
-- Reemplaza los IDs reales
UPDATE users SET partner_id = 'uuid-de-maria' WHERE username = 'nani';
UPDATE users SET partner_id = 'uuid-de-nani' WHERE username = 'maria';
```

### 5. Correr la app
```bash
npm start
```

Escanea el QR con Expo Go (iOS/Android).

---

## Estructura del proyecto

```
cinelife/
├── app/
│   ├── _layout.tsx              # Auth guard
│   ├── (auth)/index.tsx          # Login / Registro
│   └── (tabs)/
│       ├── index.tsx              # Home - El Estudio
│       ├── habits.tsx             # Hábitos diarios
│       ├── production.tsx         # Producción de películas
│       ├── partner.tsx            # Vista de pareja
│       └── watchlist.tsx          # Watchlist + AI recomendador (solo María)
├── src/
│   ├── constants/
│   │   ├── theme.ts              # Colores, spacing, border radius
│   │   └── habits.ts             # Templates de hábitos, niveles, recursos
│   ├── lib/
│   │   ├── supabase.ts           # Cliente de Supabase
│   │   └── gameEngine.ts         # Lógica de XP, recursos, niveles
│   ├── store/index.ts            # Estado global (Zustand)
│   └── types/index.ts            # TypeScript types
└── supabase/
    ├── schema.sql                # Schema completo de la base de datos
    └── functions/
        ├── generate-movie/       # IA: genera título, sinopsis, rating
        └── recommend-movie/      # IA: recomienda películas a María
```

## Funcionalidades

### Para ambas (Nani y María)
- 🏠 Estudio virtual con nivel de carrera (7 niveles)
- ✅ Hábitos diarios con recompensas en XP, monedas y recursos
- 🔥 Sistema de racha con multiplicador de XP
- 🎞️ Producción de películas en 3 fases (gastando recursos)
- 🎬 Películas generadas por IA (título, género, sinopsis, rating)
- 💕 Vista de pareja con mensajes de ánimo y regalo de recursos

### Solo María
- 📽️ Watchlist personal de películas
- ✨ Recomendador con IA: 3 preguntas sobre su estado de ánimo → recomendación personalizada priorizando su watchlist

## Avatares

Cuando tengas los avatares, súbelos a Supabase Storage y actualiza `avatar_url` en la tabla `users`. La app está lista para mostrarlos.
