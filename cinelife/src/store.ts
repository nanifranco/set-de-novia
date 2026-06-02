import { create } from 'zustand';
import { supabase } from './supabase';
import { getCurrentLevel, getStreakMultiplier } from './data';
import type { UserProfile, Habit, HabitLog, Message, WatchlistMovie } from './types';

interface AppState {
  // Auth
  currentUser: UserProfile | null;
  partnerUser: UserProfile | null;
  loading: boolean;

  // Data
  habits: Habit[];
  todayLogs: HabitLog[];
  messages: Message[];
  watchlist: WatchlistMovie[];

  // Actions
  init: (userId: string) => Promise<void>;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
  sendMessage: (content: string, type?: Message['type']) => Promise<void>;
  addToWatchlist: (movie: Omit<WatchlistMovie, 'id' | 'user_id' | 'added_at'>) => Promise<void>;
  markWatched: (movieId: string) => Promise<void>;
  removeFromWatchlist: (movieId: string) => Promise<void>;
  getAIRecommendation: (answers: Record<string, string>) => Promise<string>;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  partnerUser: null,
  loading: false,
  habits: [],
  todayLogs: [],
  messages: [],
  watchlist: [],

  init: async (userId: string) => {
    set({ loading: true });
    try {
      const { data: users } = await supabase.from('users').select('*');
      if (!users) return;

      const current = users.find(u => u.id === userId) || null;
      const partner = users.find(u => u.id !== userId) || null;
      set({ currentUser: current, partnerUser: partner });

      if (!current) return;

      const today = new Date().toISOString().split('T')[0];

      const [habitsRes, logsRes, messagesRes, watchlistRes] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', current.id).eq('is_active', true),
        supabase.from('habit_logs').select('*').eq('user_id', current.id).gte('completed_at', today),
        supabase.from('messages').select('*')
          .or(`sender_id.eq.${current.id},receiver_id.eq.${current.id}`)
          .order('created_at', { ascending: false })
          .limit(50),
        current.username === 'maria'
          ? supabase.from('watchlist').select('*').eq('user_id', current.id).order('added_at', { ascending: false })
          : { data: [] },
      ]);

      set({
        habits: habitsRes.data || [],
        todayLogs: logsRes.data || [],
        messages: messagesRes.data || [],
        watchlist: (watchlistRes as any).data || [],
      });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username: string) => {
    const normalized = username.toLowerCase().trim();
    if (normalized !== 'nani' && normalized !== 'maria') {
      throw new Error('Solo Nani o María pueden entrar a esta app 💕');
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', normalized)
      .single();
    if (error || !data) throw new Error('Usuario no encontrado. ¿Configuraste la DB?');
    await get().init(data.id);
  },

  signOut: async () => {
    set({ currentUser: null, partnerUser: null, habits: [], todayLogs: [], messages: [], watchlist: [] });
  },

  completeHabit: async (habitId: string) => {
    const { currentUser, habits, todayLogs } = get();
    if (!currentUser) return;

    const alreadyDone = todayLogs.some(l => l.habit_id === habitId);
    if (alreadyDone) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const multiplier = getStreakMultiplier(currentUser.streak_days);
    const xpEarned = Math.round(habit.xp_reward * multiplier);
    const newXp = currentUser.xp + xpEarned;
    const newLevel = getCurrentLevel(currentUser.username as any, newXp).level;
    const today = new Date().toISOString().split('T')[0];
    const lastDate = currentUser.last_habit_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = lastDate === yesterday ? currentUser.streak_days + 1
      : lastDate === today ? currentUser.streak_days
      : 1;

    const { data: log } = await supabase.from('habit_logs').insert({
      habit_id: habitId,
      user_id: currentUser.id,
      xp_earned: xpEarned,
    }).select().single();

    await supabase.from('users').update({
      xp: newXp,
      level: newLevel,
      streak_days: newStreak,
      last_habit_date: today,
    }).eq('id', currentUser.id);

    set(state => ({
      currentUser: { ...state.currentUser!, xp: newXp, level: newLevel, streak_days: newStreak, last_habit_date: today },
      todayLogs: log ? [...state.todayLogs, log] : state.todayLogs,
    }));
  },

  sendMessage: async (content: string, type = 'text' as Message['type']) => {
    const { currentUser, partnerUser } = get();
    if (!currentUser || !partnerUser) return;

    const { data } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: partnerUser.id,
      content,
      type,
    }).select().single();

    if (data) set(state => ({ messages: [data, ...state.messages] }));
  },

  addToWatchlist: async (movie) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const { data } = await supabase.from('watchlist').insert({
      ...movie,
      user_id: currentUser.id,
    }).select().single();

    if (data) set(state => ({ watchlist: [data, ...state.watchlist] }));
  },

  markWatched: async (movieId: string) => {
    await supabase.from('watchlist').update({ watched: true }).eq('id', movieId);
    set(state => ({
      watchlist: state.watchlist.map(m => m.id === movieId ? { ...m, watched: true } : m),
    }));
  },

  removeFromWatchlist: async (movieId: string) => {
    await supabase.from('watchlist').delete().eq('id', movieId);
    set(state => ({ watchlist: state.watchlist.filter(m => m.id !== movieId) }));
  },

  getAIRecommendation: async (answers: Record<string, string>) => {
    const { currentUser, watchlist } = get();
    if (!currentUser) throw new Error('No user');

    const unwatched = watchlist.filter(m => !m.watched);
    const { data, error } = await supabase.functions.invoke('recommend-movie', {
      body: { answers, watchlist: unwatched },
    });

    if (error) throw error;
    return data.recommendation as string;
  },
}));
