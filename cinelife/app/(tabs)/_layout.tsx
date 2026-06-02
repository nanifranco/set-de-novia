import { Tabs } from 'expo-router';
import { useStore } from '../../src/store';
import { COLORS } from '../../src/theme';

export default function TabsLayout() {
  const { currentUser } = useStore();
  const isMaria = currentUser?.username === 'maria';
  const accent = isMaria ? COLORS.maria.primary : COLORS.nani.primary;
  const tabBg = isMaria ? COLORS.maria.tab : COLORS.nani.tab;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: tabBg, borderTopColor: COLORS.border },
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Hoy', tabBarIcon: ({ color }) => <TabIcon emoji="✨" color={color} /> }}
      />
      <Tabs.Screen
        name="partner"
        options={{ title: 'Nosotras', tabBarIcon: ({ color }) => <TabIcon emoji="💕" color={color} /> }}
      />
      {isMaria && (
        <Tabs.Screen
          name="watchlist"
          options={{ title: 'Watchlist', tabBarIcon: ({ color }) => <TabIcon emoji="🎬" color={color} /> }}
        />
      )}
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}
