import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../src/store';
import { Colors, S, R } from '../../src/constants/theme';
import { getLevelInfo } from '../../src/lib/gameEngine';
import { RESOURCE_INFO } from '../../src/constants/habits';

export default function HomeScreen() {
  const { user, habits, currentMovie } = useStore();
  if (!user) return null;

  const { currentLevel, nextLevel, progress } = getLevelInfo(user.career_xp);
  const doneToday = habits.filter(h => h.completed_today).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {user.display_name} 🌟</Text>
            <Text style={styles.level}>{currentLevel.title}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.coins}>🎬 {user.coins}</Text>
            <Text style={styles.streak}>🔥 {user.streak_days} días</Text>
          </View>
        </View>

        {/* XP bar */}
        <View style={styles.xpWrap}>
          <View style={styles.xpBg}>
            <View style={[styles.xpFill, { width: `${progress * 100}%` }]} />
          </View>
          {nextLevel && (
            <Text style={styles.xpLabel}>{user.career_xp} / {nextLevel.xp} XP → {nextLevel.title}</Text>
          )}
        </View>

        {/* Studio card */}
        <View style={styles.studioCard}>
          <Text style={styles.studioEmoji}>
            {user.career_level === 1 ? '🏫'
              : user.career_level <= 3 ? '🏢'
              : user.career_level <= 5 ? '🎥'
              : '🏆'}
          </Text>
          <Text style={styles.studioName}>Estudio de {user.display_name}</Text>
          <Text style={styles.studioSub}>
            {doneToday === 0
              ? 'El día acaba de comenzar…'
              : `${doneToday}/${habits.length} hábitos completados hoy`}
          </Text>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos cinematográficos</Text>
          <View style={styles.resourceGrid}>
            {(Object.entries(RESOURCE_INFO) as [keyof typeof RESOURCE_INFO, any][]).map(([key, info]) => (
              <View key={key} style={[styles.resourceChip, { borderColor: info.color + '44' }]}>
                <Text style={styles.resourceIcon}>{info.icon}</Text>
                <Text style={[styles.resourceCount, { color: info.color }]}>{user.resources[key] || 0}</Text>
                <Text style={styles.resourceLabel}>{info.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Movie status */}
        {currentMovie ? (
          <TouchableOpacity style={styles.movieCard} onPress={() => router.push('/(tabs)/production')}>
            <Text style={styles.movieCardTitle}>🎞️ Película en producción</Text>
            <Text style={styles.movieCardSub}>
              Fase {currentMovie.phase}/3 — {['', 'Desarrollo', 'Rodaje', 'Post-producción'][currentMovie.phase]}
            </Text>
            <View style={styles.phaseBg}>
              <View style={[styles.phaseFill, { width: `${(currentMovie.phase / 3) * 100}%` }]} />
            </View>
            <Text style={styles.movieCardCta}>Ver producción →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/(tabs)/production')}>
            <Text style={styles.startBtnText}>+ Iniciar nueva película</Text>
          </TouchableOpacity>
        )}

        {/* Quick habits */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Hábitos de hoy</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/habits')}>
              <Text style={styles.link}>Ver todos →</Text>
            </TouchableOpacity>
          </View>
          {habits.slice(0, 4).map(h => (
            <View key={h.id} style={styles.quickHabit}>
              <Text style={styles.qIcon}>{h.icon}</Text>
              <Text style={[styles.qName, h.completed_today && styles.qDone]}>{h.name}</Text>
              {h.completed_today && <Text>✅</Text>}
            </View>
          ))}
          {habits.length === 0 && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/habits')}>
              <Text style={styles.link}>Agrega tu primer hábito →</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: S.lg, paddingBottom: S.sm },
  greeting: { color: Colors.mist, fontSize: 14 },
  level: { fontSize: 20, fontWeight: '700', color: Colors.gold },
  coins: { color: Colors.gold, fontWeight: '700', fontSize: 16 },
  streak: { color: Colors.film, fontWeight: '600', fontSize: 14 },
  xpWrap: { paddingHorizontal: S.lg, marginBottom: S.lg, gap: S.xs },
  xpBg: { height: 6, backgroundColor: Colors.bgElevated, borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 3 },
  xpLabel: { color: Colors.mist, fontSize: 11 },
  studioCard: { margin: S.lg, marginTop: 0, padding: S.xl, backgroundColor: Colors.bgCard, borderRadius: R.lg, alignItems: 'center' },
  studioEmoji: { fontSize: 56, marginBottom: S.sm },
  studioName: { fontSize: 18, fontWeight: '700', color: Colors.parchment },
  studioSub: { color: Colors.mist, fontSize: 13, marginTop: 4 },
  section: { paddingHorizontal: S.lg, marginBottom: S.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.parchment, marginBottom: S.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.md },
  link: { color: Colors.gold, fontSize: 14 },
  resourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  resourceChip: { flex: 1, minWidth: '30%', padding: S.sm, backgroundColor: Colors.bgCard, borderRadius: R.sm, borderWidth: 1, alignItems: 'center' },
  resourceIcon: { fontSize: 18 },
  resourceCount: { fontSize: 18, fontWeight: '700' },
  resourceLabel: { color: Colors.mist, fontSize: 11, marginTop: 2 },
  movieCard: { marginHorizontal: S.lg, marginBottom: S.lg, padding: S.lg, backgroundColor: Colors.bgCard, borderRadius: R.lg, borderLeftWidth: 3, borderLeftColor: Colors.film },
  movieCardTitle: { fontSize: 15, fontWeight: '600', color: Colors.parchment, marginBottom: 4 },
  movieCardSub: { color: Colors.mist, fontSize: 13, marginBottom: S.sm },
  phaseBg: { height: 4, backgroundColor: Colors.bgElevated, borderRadius: 2, overflow: 'hidden', marginBottom: S.sm },
  phaseFill: { height: '100%', backgroundColor: Colors.film, borderRadius: 2 },
  movieCardCta: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  startBtn: { marginHorizontal: S.lg, marginBottom: S.lg, padding: S.md, borderWidth: 1, borderColor: Colors.gold, borderRadius: R.md, borderStyle: 'dashed', alignItems: 'center' },
  startBtnText: { color: Colors.gold, fontWeight: '600' },
  quickHabit: { flexDirection: 'row', alignItems: 'center', gap: S.sm, paddingVertical: S.sm, borderBottomWidth: 1, borderBottomColor: Colors.bgElevated },
  qIcon: { fontSize: 20 },
  qName: { flex: 1, color: Colors.parchment, fontSize: 15 },
  qDone: { color: Colors.mist, textDecorationLine: 'line-through' },
});
