import { create } from 'zustand';
import { UserProfile, Habit, Movie, Message, WatchlistMovie, UserResources, MoviePhase } from '../types';
import { supabase } from '../lib/supabase';
import { addResources, subtractResources, isStreakAlive, getStreakMultiplier, EMPTY_RESOURCES, hasEnoughResources } from '../lib/gameEngine';
import { PRODUCTION_PHASES, RESOURCE_INFO } from '../constants/habits';

interface AppState {
  user: UserProfile | null;
  partner: UserProfile | null;
  habits: Habit[];
  currentMovie: Movie | null;
  completedMovies: Movie[];
  messages: Message[];
  watchlist: WatchlistMovie[];
  isLoading: boolean;
  aiLoading: boolean;
  loadUser: (userId: string) => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
  addHabit: (data: Omit<Habit, 'id' | 'user_id' | 'completed_today'>) => Promise<void>;
  startMovie: () => Promise<void>;
  advanceMoviePhase: () => Promise<{ success: boolean; newMovie?: Movie }>;
  sendCheer: (content: string) => Promise<void>;
  sendGift: (resourceType: keyof UserResources, qty: number) => Promise<void>;
  markMessagesRead: () => Promise<void>;
  addToWatchlist: (data: Omit<WatchlistMovie, 'id' | 'user_id' | 'added_at'>) => Promise<void>;
  markWatched: (id: string) => Promise<void>;
  removeFromWatchlist: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  partner: null,
  habits: [],
  currentMovie: null,
  completedMovies: [],
  messages: [],
  watchlist: [],
  isLoading: false,
  aiLoading: false,

  loadUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data: userData } = await supabase.from('users').select('*').eq('id', userId).single();
      if (!userData) throw new Error('User not found');

      const { data: resourceRows } = await supabase.from('user_resources').select('*').eq('user_id', userId);
      const resources = { ...EMPTY_RESOURCES };
      (resourceRows || []).forEach((r: any) => { resources[r.resource_type as keyof UserResources] = r.quantity; });
      const user: UserProfile = { ...userData, resources };

      let partner: UserProfile | null = null;
      if (userData.partner_id) {
        const { data: pData } = await supabase.from('users').select('*').eq('id', userData.partner_id).single();
        if (pData) {
          const { data: pRes } = await supabase.from('user_resources').select('*').eq('user_id', userData.partner_id);
          const pr = { ...EMPTY_RESOURCES };
          (pRes || []).forEach((r: any) => { pr[r.resource_type as keyof UserResources] = r.quantity; });
          partner = { ...pData, resources: pr };
        }
      }

      const today = new Date().toISOString().split('T')[0];
      const { data: habitsData } = await supabase
        .from('habits').select('*, habit_logs(id, completed_at)').eq('user_id', userId).eq('is_active', true);
      const habits: Habit[] = (habitsData || []).map((h: any) => ({
        ...h,
        completed_today: (h.habit_logs || []).some((l: any) => l.completed_at?.startsWith(today)),
      }));

      const { data: currentMovieData } = await supabase
        .from('movies').select('*').eq('user_id', userId).neq('phase', 4)
        .order('started_at', { ascending: false }).limit(1).maybeSingle();

      const { data: completedData } = await supabase
        .from('movies').select('*').eq('user_id', userId).eq('phase', 4)
        .order('completed_at', { ascending: false });

      const { data: messagesData } = await supabase
        .from('messages').select('*').eq('receiver_id', userId)
        .order('created_at', { ascending: false }).limit(30);

      const { data: watchlistData } = await supabase
        .from('watchlist').select('*').eq('user_id', userId)
        .order('added_at', { ascending: false });

      set({
        user, partner, habits,
        currentMovie: currentMovieData || null,
        completedMovies: completedData || [],
        messages: messagesData || [],
        watchlist: watchlistData || [],
        isLoading: false,
      });
    } catch (err) {
      console.error('loadUser:', err);
      set({ isLoading: false });
    }
  },

  completeHabit: async (habitId: string) => {
    const { user, habits } = get();
    if (!user) return;
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completed_today) return;

    const multiplier = getStreakMultiplier(user.streak_days);
    const xpEarned = Math.round(habit.xp_reward * multiplier);
    const today = new Date().toISOString().split('T')[0];
    const streakAlive = isStreakAlive(user.last_habit_date);
    const isNewDay = user.last_habit_date !== today;
    const newStreak = isNewDay ? (streakAlive ? user.streak_days + 1 : 1) : user.streak_days;
    const newXP = user.career_xp + xpEarned;
    const newCoins = user.coins + habit.coins_reward;

    await supabase.from('habit_logs').insert({ habit_id: habitId, user_id: user.id, xp_earned: xpEarned });
    await supabase.from('users').update({ career_xp: newXP, coins: newCoins, streak_days: newStreak, last_habit_date: today }).eq('id', user.id);

    for (const [rType, amount] of Object.entries(habit.resources || {})) {
      const qty = (user.resources[rType as keyof UserResources] || 0) + (amount as number);
      await supabase.from('user_resources').upsert({ user_id: user.id, resource_type: rType, quantity: qty }, { onConflict: 'user_id,resource_type' });
    }

    const { currentMovie } = get();
    if (currentMovie) {
      const habitLog = { ...currentMovie.habit_log, [habit.category]: (currentMovie.habit_log[habit.category] || 0) + 1 };
      await supabase.from('movies').update({ habit_log: habitLog }).eq('id', currentMovie.id);
      set(s => ({ currentMovie: s.currentMovie ? { ...s.currentMovie, habit_log: habitLog } : null }));
    }

    set(s => ({
      habits: s.habits.map(h => h.id === habitId ? { ...h, completed_today: true } : h),
      user: s.user ? {
        ...s.user, career_xp: newXP, coins: newCoins, streak_days: newStreak, last_habit_date: today,
        resources: addResources(s.user.resources, habit.resources || {}),
      } : null,
    }));
  },

  addHabit: async (data) => {
    const { user } = get();
    if (!user) return;
    const { data: h } = await supabase.from('habits').insert({ ...data, user_id: user.id }).select().single();
    if (h) set(s => ({ habits: [...s.habits, { ...h, completed_today: false }] }));
  },

  startMovie: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase.from('movies').insert({
      user_id: user.id, phase: 1,
      resources_invested: EMPTY_RESOURCES,
      habit_log: { wellness: 0, knowledge: 0, creative: 0, social: 0 },
      is_collaborative: false,
    }).select().single();
    if (data) set({ currentMovie: data });
  },

  advanceMoviePhase: async () => {
    const { user, currentMovie } = get();
    if (!user || !currentMovie) return { success: false };

    const phaseData = PRODUCTION_PHASES[currentMovie.phase - 1];
    if (!phaseData) return { success: false };

    const required = phaseData.required as Partial<UserResources>;
    if (!hasEnoughResources(user.resources, required)) return { success: false };

    const newResources = subtractResources(user.resources, required);
    const resourcesInvested = addResources(currentMovie.resources_invested || EMPTY_RESOURCES, required);
    const nextPhase = (currentMovie.phase + 1) as MoviePhase;

    for (const [rType, amount] of Object.entries(required)) {
      await supabase.from('user_resources').upsert(
        { user_id: user.id, resource_type: rType, quantity: newResources[rType as keyof UserResources] },
        { onConflict: 'user_id,resource_type' },
      );
    }

    if (nextPhase === 4) {
      set({ aiLoading: true });
      await supabase.from('movies').update({ phase: 4, resources_invested: resourcesInvested }).eq('id', currentMovie.id);
      try {
        const { data: aiResult } = await supabase.functions.invoke('generate-movie', {
          body: {
            movieId: currentMovie.id,
            userId: user.id,
            habitLog: currentMovie.habit_log,
            careerLevel: user.career_level,
            studioName: `Estudio de ${user.display_name}`,
          },
        });
        const completed: Movie = {
          ...currentMovie, ...(aiResult || {}),
          phase: 4, resources_invested: resourcesInvested,
          completed_at: new Date().toISOString(),
        };
        await supabase.from('users').update({ career_xp: user.career_xp + 200, coins: user.coins + 150 }).eq('id', user.id);
        set(s => ({
          currentMovie: null,
          completedMovies: [completed, ...s.completedMovies],
          user: s.user ? { ...s.user, career_xp: s.user.career_xp + 200, coins: s.user.coins + 150, resources: newResources } : null,
          aiLoading: false,
        }));
        return { success: true, newMovie: completed };
      } catch (err) {
        console.error('generate-movie error:', err);
        set({ aiLoading: false });
        return { success: false };
      }
    } else {
      await supabase.from('movies').update({ phase: nextPhase, resources_invested: resourcesInvested }).eq('id', currentMovie.id);
      set(s => ({
        currentMovie: s.currentMovie ? { ...s.currentMovie, phase: nextPhase, resources_invested: resourcesInvested } : null,
        user: s.user ? { ...s.user, resources: newResources } : null,
      }));
      return { success: true };
    }
  },

  sendCheer: async (content: string) => {
    const { user, partner } = get();
    if (!user || !partner) return;
    await supabase.from('messages').insert({
      sender_id: user.id, receiver_id: partner.id,
      type: 'cheer', content, resource_type: null, resource_qty: null, read: false,
    });
  },

  sendGift: async (resourceType: keyof UserResources, qty: number) => {
    const { user, partner } = get();
    if (!user || !partner) return;
    if ((user.resources[resourceType] || 0) < qty) return;
    const senderQty = (user.resources[resourceType] || 0) - qty;
    const receiverQty = (partner.resources[resourceType] || 0) + qty;
    await supabase.from('user_resources').upsert({ user_id: user.id, resource_type: resourceType, quantity: senderQty }, { onConflict: 'user_id,resource_type' });
    await supabase.from('user_resources').upsert({ user_id: partner.id, resource_type: resourceType, quantity: receiverQty }, { onConflict: 'user_id,resource_type' });
    const info = RESOURCE_INFO[resourceType];
    await supabase.from('messages').insert({
      sender_id: user.id, receiver_id: partner.id, type: 'gift',
      content: `Te regalé ${qty} ${info.label} ${info.icon}`,
      resource_type: resourceType, resource_qty: qty, read: false,
    });
    set(s => ({
      user: s.user ? { ...s.user, resources: subtractResources(s.user.resources, { [resourceType]: qty }) } : null,
    }));
  },

  markMessagesRead: async () => {
    const { user, messages } = get();
    if (!user) return;
    const unread = messages.filter(m => !m.read).map(m => m.id);
    if (!unread.length) return;
    await supabase.from('messages').update({ read: true }).in('id', unread);
    set(s => ({ messages: s.messages.map(m => ({ ...m, read: true })) }));
  },

  addToWatchlist: async (data) => {
    const { user } = get();
    if (!user) return;
    const { data: item } = await supabase.from('watchlist').insert({ ...data, user_id: user.id }).select().single();
    if (item) set(s => ({ watchlist: [item, ...s.watchlist] }));
  },

  markWatched: async (id: string) => {
    await supabase.from('watchlist').update({ watched: true }).eq('id', id);
    set(s => ({ watchlist: s.watchlist.map(m => m.id === id ? { ...m, watched: true } : m) }));
  },

  removeFromWatchlist: async (id: string) => {
    await supabase.from('watchlist').delete().eq('id', id);
    set(s => ({ watchlist: s.watchlist.filter(m => m.id !== id) }));
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, partner: null, habits: [], currentMovie: null, completedMovies: [], messages: [], watchlist: [] });
  },
}));
