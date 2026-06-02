import { HabitCategory, UserResources } from '../types';

export interface HabitTemplate {
  name: string;
  category: HabitCategory;
  icon: string;
  xp: number;
  coins: number;
  resources: Partial<UserResources>;
  description: string;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  { name: 'Dormir 7-8 horas', category: 'wellness', icon: '🌙', xp: 30, coins: 8, resources: { energy: 2 }, description: 'El descanso es la base de todo' },
  { name: 'Hacer ejercicio', category: 'wellness', icon: '💪', xp: 40, coins: 12, resources: { energy: 2, prop: 1 }, description: 'El cuerpo en movimiento, la mente despierta' },
  { name: 'Meditación', category: 'wellness', icon: '🧘', xp: 25, coins: 8, resources: { inspiration: 2 }, description: 'La quietud genera las mejores ideas' },
  { name: 'Estudiar', category: 'knowledge', icon: '📚', xp: 50, coins: 15, resources: { script: 2, credit: 1 }, description: 'El conocimiento es el mejor guión' },
  { name: 'Leer', category: 'knowledge', icon: '📖', xp: 35, coins: 10, resources: { script: 1, inspiration: 1 }, description: 'Los buenos libros son películas en papel' },
  { name: 'Journaling', category: 'knowledge', icon: '✏️', xp: 30, coins: 9, resources: { inspiration: 1, script: 1 }, description: 'Escribir es entenderse a una misma' },
  { name: 'Proyecto personal', category: 'creative', icon: '🎨', xp: 60, coins: 18, resources: { negative: 2, inspiration: 1 }, description: 'Tu proyecto más importante eres tú' },
  { name: 'Hobby creativo', category: 'creative', icon: '🎭', xp: 45, coins: 13, resources: { negative: 1, prop: 1 }, description: 'La creatividad no tiene justificación' },
  { name: 'Actividad social', category: 'social', icon: '🌟', xp: 35, coins: 10, resources: { credit: 1, prop: 1 }, description: 'Las mejores historias son las compartidas' },
  { name: 'Tiempo al aire libre', category: 'wellness', icon: '🌿', xp: 30, coins: 9, resources: { energy: 1, negative: 1 }, description: 'El mundo exterior alimenta el interior' },
  { name: 'Ver una película', category: 'creative', icon: '🎬', xp: 35, coins: 10, resources: { inspiration: 2, script: 1 }, description: 'Todo cinéfila necesita ver cine' },
  { name: 'Cocinar algo nuevo', category: 'creative', icon: '🍳', xp: 35, coins: 10, resources: { prop: 1, inspiration: 1 }, description: 'Crear con las manos alimenta el alma' },
];

export const CAREER_LEVELS = [
  { level: 1, title: 'Estudiante de Cine', xp: 0 },
  { level: 2, title: 'Asistente de Producción', xp: 500 },
  { level: 3, title: 'Guionista', xp: 1500 },
  { level: 4, title: 'Directora Independiente', xp: 3500 },
  { level: 5, title: 'Directora Reconocida', xp: 7000 },
  { level: 6, title: 'Directora de Festivales', xp: 13000 },
  { level: 7, title: 'Directora Legendaria', xp: 22000 },
];

export const RESOURCE_INFO = {
  script:      { label: 'Guión',      icon: '📝', color: '#4A90D9' },
  energy:      { label: 'Energía',    icon: '⚡', color: '#F5C842' },
  negative:    { label: 'Negativo',   icon: '🎞️', color: '#8B7355' },
  inspiration: { label: 'Inspiración',icon: '✨', color: '#E8A5B0' },
  prop:        { label: 'Props',      icon: '🎭', color: '#7EC8A0' },
  credit:      { label: 'Crédito',   icon: '💰', color: '#E8784D' },
} as const;

export const PRODUCTION_PHASES = [
  { phase: 1, name: 'Desarrollo',       icon: '📝', description: 'El concepto toma forma',           required: { script: 3, inspiration: 2 } },
  { phase: 2, name: 'Rodaje',           icon: '🎬', description: 'La cámara rueda',                  required: { energy: 5, negative: 4, prop: 3 } },
  { phase: 3, name: 'Post-producción',  icon: '✂️', description: 'La magia en la sala de edición',   required: { script: 3, credit: 2, inspiration: 1 } },
];

export const CHEER_MESSAGES = [
  '¡Estoy orgullosa de ti hoy! 💛',
  '¡Tú puedes con esto! 💪',
  'Tu película va a ser increíble ✨',
  'Un paso a la vez, estás progresando 🌟',
  '¡Hoy fue un gran día para el estudio! 🎬',
  'Me inspiras todos los días 💕',
  '¡Eso es! ¡Sigue así! 🔥',
  'Qué orgullosa estoy de nosotras 🎭',
];
