import { CAREER_LEVELS } from '../constants/habits';
import { UserResources } from '../types';

export const EMPTY_RESOURCES: UserResources = {
  script: 0, energy: 0, negative: 0, inspiration: 0, prop: 0, credit: 0,
};

export function getLevelInfo(xp: number) {
  let currentLevel = CAREER_LEVELS[0];
  let nextLevel: (typeof CAREER_LEVELS)[0] | null = CAREER_LEVELS[1] ?? null;
  for (let i = CAREER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= CAREER_LEVELS[i].xp) {
      currentLevel = CAREER_LEVELS[i];
      nextLevel = CAREER_LEVELS[i + 1] ?? null;
      break;
    }
  }
  const xpInLevel = xp - currentLevel.xp;
  const xpNeeded = nextLevel ? nextLevel.xp - currentLevel.xp : 1;
  const progress = Math.min(xpInLevel / xpNeeded, 1);
  return { currentLevel, nextLevel, xpInLevel, xpNeeded, progress };
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 1.5;
  if (streak >= 14) return 1.35;
  if (streak >= 7) return 1.2;
  if (streak >= 3) return 1.1;
  return 1.0;
}

export function isStreakAlive(lastDate: string | null): boolean {
  if (!lastDate) return false;
  const diff = Date.now() - new Date(lastDate).getTime();
  return diff < 1000 * 60 * 60 * 48;
}

export function addResources(a: UserResources, b: Partial<UserResources>): UserResources {
  return {
    script:      (a.script      || 0) + (b.script      || 0),
    energy:      (a.energy      || 0) + (b.energy      || 0),
    negative:    (a.negative    || 0) + (b.negative    || 0),
    inspiration: (a.inspiration || 0) + (b.inspiration || 0),
    prop:        (a.prop        || 0) + (b.prop        || 0),
    credit:      (a.credit      || 0) + (b.credit      || 0),
  };
}

export function subtractResources(a: UserResources, b: Partial<UserResources>): UserResources {
  return {
    script:      Math.max(0, (a.script      || 0) - (b.script      || 0)),
    energy:      Math.max(0, (a.energy      || 0) - (b.energy      || 0)),
    negative:    Math.max(0, (a.negative    || 0) - (b.negative    || 0)),
    inspiration: Math.max(0, (a.inspiration || 0) - (b.inspiration || 0)),
    prop:        Math.max(0, (a.prop        || 0) - (b.prop        || 0)),
    credit:      Math.max(0, (a.credit      || 0) - (b.credit      || 0)),
  };
}

export function hasEnoughResources(available: UserResources, required: Partial<UserResources>): boolean {
  return (Object.entries(required) as [keyof UserResources, number][]).every(
    ([k, v]) => (available[k] || 0) >= v,
  );
}
