import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useStore } from '../src/store';

export default function RootLayout() {
  const loadUser = useStore(s => s.loadUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUser(session.user.id).then(() => router.replace('/(tabs)'));
      } else {
        router.replace('/(auth)');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUser(session.user.id);
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT') {
        router.replace('/(auth)');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
