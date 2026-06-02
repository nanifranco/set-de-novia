import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { useStore } from '../src/store';
import { COLORS } from '../src/theme';

export default function RootLayout() {
  const { currentUser, loading } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || loading) return;
    if (!currentUser) {
      router.replace('/login');
    } else {
      router.replace('/(tabs)');
    }
  }, [ready, loading, currentUser]);

  if (!ready || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator color={COLORS.nani.primary} size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
