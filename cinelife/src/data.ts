import type { Username } from './types';

export interface Level {
  level: number;
  title: string;
  xp_required: number;
  icon: string;
}

export const NANI_LEVELS: Level[] = [
  { level: 1, title: 'Aprendiz del Taller',    xp_required: 0,     icon: '🔧' },
  { level: 2, title: 'Técnica en Soldadura',   xp_required: 300,   icon: '🔥' },
  { level: 3, title: 'Carpintera Aficionada',  xp_required: 800,   icon: '🪚' },
  { level: 4, title: 'Mecatrónica Básica',     xp_required: 1800,  icon: '⚙️' },
  { level: 5, title: 'Ingeniera Electrónica',  xp_required: 3500,  icon: '🔌' },
  { level: 6, title: 'Creadora de Robots',     xp_required: 6000,  icon: '🤖' },
  { level: 7, title: 'Maestra Inventora',      xp_required: 10000, icon: '🏆' },
];

export const MARIA_LEVELS: Level[] = [
  { level: 1, title: 'Estudiante de Cine',       xp_required: 0,     icon: '🎬' },
  { level: 2, title: 'Asistente de Producción',  xp_required: 300,   icon: '🎥' },
  { level: 3, title: 'Guionista',                xp_required: 800,   icon: '📝' },
  { level: 4, title: 'Directora Independiente',  xp_required: 1800,  icon: '🎞️' },
  { level: 5, title: 'Directora Reconocida',     xp_required: 3500,  icon: '🏅' },
  { level: 6, title: 'Directora de Festivales',  xp_required: 6000,  icon: '🌟' },
  { level: 7, title: 'Directora Legendaria',     xp_required: 10000, icon: '👑' },
];

export interface DefaultHabit {
  name: string;
  icon: string;
  xp_reward: number;
}

export const NANI_DEFAULT_HABITS: DefaultHabit[] = [
  { name: 'Trabajar en el taller',    icon: '🔧', xp_reward: 30 },
  { name: 'Soldar algo nuevo',        icon: '🔥', xp_reward: 25 },
  { name: 'Proyecto de carpintería',  icon: '🪚', xp_reward: 25 },
  { name: 'Aprender electrónica',     icon: '🔌', xp_reward: 20 },
  { name: 'Avanzar con el robot',     icon: '🤖', xp_reward: 35 },
  { name: 'Limpiar y organizar',      icon: '🧹', xp_reward: 15 },
];

export const MARIA_DEFAULT_HABITS: DefaultHabit[] = [
  { name: 'Ver una película',         icon: '🎬', xp_reward: 20 },
  { name: 'Escribir guión',           icon: '📝', xp_reward: 30 },
  { name: 'Estudiar para la carrera', icon: '📚', xp_reward: 25 },
  { name: 'Ver una serie',            icon: '📺', xp_reward: 15 },
  { name: 'Investigar directores',    icon: '🎞️', xp_reward: 20 },
  { name: 'Escribir reseña',          icon: '✍️', xp_reward: 20 },
];

export function getLevels(username: Username): Level[] {
  return username === 'nani' ? NANI_LEVELS : MARIA_LEVELS;
}

export function getCurrentLevel(username: Username, xp: number): Level {
  const levels = getLevels(username);
  let current = levels[0];
  for (const l of levels) {
    if (xp >= l.xp_required) current = l;
    else break;
  }
  return current;
}

export function getNextLevel(username: Username, xp: number): Level | null {
  const levels = getLevels(username);
  for (const l of levels) {
    if (xp < l.xp_required) return l;
  }
  return null;
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7)  return 1.25;
  if (streak >= 3)  return 1.1;
  return 1.0;
}
