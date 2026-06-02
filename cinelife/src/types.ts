export type Username = 'nani' | 'maria';

export interface UserProfile {
  id: string;
  username: Username;
  display_name: string;
  xp: number;
  level: number;
  streak_days: number;
  last_habit_date: string | null;
}

export interface LevelInfo {
  level: number;
  title: string;
  xp_required: number;
  next_xp: number;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  xp_reward: number;
  is_active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  xp_earned: number;
  completed_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'congrats' | 'love';
  read: boolean;
  created_at: string;
}

export interface WatchlistMovie {
  id: string;
  user_id: string;
  title: string;
  director: string | null;
  year: number | null;
  genre: string | null;
  notes: string | null;
  watched: boolean;
  added_at: string;
}
