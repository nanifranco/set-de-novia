# Set de Novia 💕

App personal para Nani y María.

## Stack
- React Native + Expo
- Supabase (DB + Edge Functions)
- Zustand (estado)
- OpenAI GPT-4o-mini (recomendadora de películas)

## Setup

### 1. Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a SQL Editor y pegar el contenido de `supabase/schema.sql`
3. En Settings → API copiar la URL y la anon key
4. En Edge Functions, hacer deploy de `supabase/functions/recommend-movie`:
   ```bash
   supabase functions deploy recommend-movie
   supabase secrets set OPENAI_API_KEY=sk-...
   ```

### 2. App
```bash
cd cinelife
npm install
```

Crear archivo `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

```bash
npm start
```

Escanear QR con Expo Go.

## Usuarios
Solo existen dos usuarios: **nani** y **maria**. 
En la pantalla de login escribir el nombre en minúscula.

## Niveles de Nani (Taller)
| Nivel | Título | XP |
|-------|--------|----|
| 1 | Aprendiz del Taller | 0 |
| 2 | Técnica en Soldadura | 300 |
| 3 | Carpintera Aficionada | 800 |
| 4 | Mecatrónica Básica | 1800 |
| 5 | Ingeniera Electrónica | 3500 |
| 6 | Creadora de Robots | 6000 |
| 7 | Maestra Inventora | 10000 |

## Niveles de María (Cine)
| Nivel | Título | XP |
|-------|--------|----|
| 1 | Estudiante de Cine | 0 |
| 2 | Asistente de Producción | 300 |
| 3 | Guionista | 800 |
| 4 | Directora Independiente | 1800 |
| 5 | Directora Reconocida | 3500 |
| 6 | Directora de Festivales | 6000 |
| 7 | Directora Legendaria | 10000 |
