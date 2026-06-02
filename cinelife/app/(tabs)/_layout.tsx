import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Colors } from '../../src/constants/theme';
import { useStore } from '../../src/store';

function Icon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, color: focused ? Colors.gold : Colors.mist, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const messages = useStore(s => s.messages);
  const user = useStore(s => s.user);
  const unread = messages.filter(m => !m.read).length;
  const isMaria = user?.username === 'maria';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.bgCard, borderTopColor: Colors.bgElevated, height: 72, paddingBottom: 10 },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <Icon emoji="🏠" label="Estudio" focused={focused} /> }} />
      <Tabs.Screen name="habits" options={{ tabBarIcon: ({ focused }) => <Icon emoji="✅" label="Hábitos" focused={focused} /> }} />
      <Tabs.Screen name="production" options={{ tabBarIcon: ({ focused }) => <Icon emoji="🎞️" label="Película" focused={focused} /> }} />
      <Tabs.Screen
        name="partner"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Icon emoji="💕" label="Pareja" focused={focused} />
              {unread > 0 && (
                <View style={{ position: 'absolute', top: 2, right: -6, backgroundColor: Colors.rose, borderRadius: 999, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>{unread}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={isMaria
          ? { tabBarIcon: ({ focused }) => <Icon emoji="📽️" label="Peliculas" focused={focused} /> }
          : { href: null }
        }
      />
    </Tabs>
  );
}
