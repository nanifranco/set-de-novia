export type Username = 'nani' | 'maria';
export type ResourceType = 'script' | 'energy' | 'negative' | 'inspiration' | 'prop' | 'credit';
export type HabitCategory = 'wellness' | 'knowledge' | 'creative' | 'social';
export type MoviePhase = 1 | 2 | 3 | 4;

export interface UserResources {
  script: number;
  energy: number;
  negative: number;
  inspiration: number;
  prop: number;
  credit: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: Username;
  display_name: string;
  career_level: number;
  career_xp: number;
  coins: number;
  streak_days: number;
  last_habit_date: string | null;
  partner_id: string | null;
  avatar_url: string | null;
  resources: UserResources;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  xp_reward: number;
  coins_reward: number;
  resources: Partial<UserResources>;
  is_active: boolean;
  completed_today: boolean;
}

export interface Movie {
  id: string;
  user_id: string;
  title: string | null;
  genre: string | null;
  synopsis: string | null;
  tagline: string | null;
  director_note: string | null;
  festival: string | null;
  critic_rating: number | null;
  audience_rating: number | null;
  phase: MoviePhase;
  resources_invested: UserResources;
  habit_log: Record<string, number>;
  is_collaborative: boolean;
  started_at: string;
  completed_at: string | null;
}

export interface WatchlistMovie {
  id: string;
  user_id: string;
  title: string;
  director: string;
  year: number | null;
  genre: string;
  notes: string;
  watched: boolean;
  added_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  type: 'cheer' | 'gift';
  content: string;
  resource_type: ResourceType | null;
  resource_qty: number | null;
  read: boolean;
  created_at: string;
}
