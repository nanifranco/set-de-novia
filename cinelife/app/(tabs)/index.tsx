import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useStore } from '../../src/store';
import { COLORS, SPACING, RADIUS } from '../../src/theme';
import { getCurrentLevel, getNextLevel, getStreakMultiplier } from '../../src/data';
import type { Username } from '../../src/types';

export default function HomeScreen() {
  const { currentUser, habits, todayLogs, completeHabit, signOut } = useStore();
  if (!currentUser) return null;

  const username = currentUser.username as Username;
  const accent = username === 'maria' ? COLORS.maria.primary : COLORS.nani.primary;
  const level = getCurrentLevel(username, currentUser.xp);
  const nextLevel = getNextLevel(username, currentUser.xp);
  const multiplier = getStreakMultiplier(currentUser.streak_days);

  const progressPct = nextLevel
    ? ((currentUser.xp - level.xp_required) / (nextLevel.xp_required - level.xp_required)) * 100
    : 100;

  const completedIds = new Set(todayLogs.map(l => l.habit_id));

  const handleComplete = async (habitId: string) => {
    try {
      await completeHabit(habitId);
    } catch {
      Alert.alert('Error', 'No se pudo guardar el hábito');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: COLORS.background }]}
      contentContainerStyle={{ padding: SPACING.md, paddingTop: 60 }}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.hello, { color: accent }]}>Hola, {currentUser.display_name} {level.icon}</Text>
          <Text style={styles.levelTitle}>{level.title}</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* XP Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.statLabel}>XP Total</Text>
          <Text style={[styles.statValue, { color: accent }]}>{currentUser.xp} XP</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.statLabel}>Racha</Text>
          <Text style={[styles.statValue, { color: accent }]}>{currentUser.streak_days} días 🔥</Text>
        </View>
        {multiplier > 1 && (
          <Text style={[styles.multiplierText, { color: accent }]}>
            ×{multiplier} bonus por racha activa!
          </Text>
        )}

        {/* Progress bar */}
        {nextLevel && (
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>
              Nivel {level.level} → {nextLevel.level}: {nextLevel.title}
            </Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: accent }]} />
            </View>
            <Text style={styles.progressXp}>
              {currentUser.xp - level.xp_required} / {nextLevel.xp_required - level.xp_required} XP
            </Text>
          </View>
        )}
        {!nextLevel && (
          <Text style={[styles.maxLevel, { color: accent }]}>¡Nivel máximo! 🏆</Text>
        )}
      </View>

      {/* Habits */}
      <Text style={styles.sectionTitle}>Hábitos de hoy</Text>
      {habits.map(habit => {
        const done = completedIds.has(habit.id);
        return (
          <TouchableOpacity
            key={habit.id}
            style={[styles.habitCard, done && { opacity: 0.5 }]}
            onPress={() => !done && handleComplete(habit.id)}
            disabled={done}
          >
            <Text style={styles.habitIcon}>{habit.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitXp}>+{habit.xp_reward} XP{multiplier > 1 ? ` (×${multiplier})` : ''}</Text>
            </View>
            <Text style={{ fontSize: 20 }}>{done ? '✅' : '⭕'}</Text>
          </TouchableOpacity>
        );
      })}

      {habits.length === 0 && (
        <Text style={styles.empty}>No tienes hábitos aún. Pídele a Nani que configure la DB 😅</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  hello: { fontSize: 24, fontWeight: 'bold' },
  levelTitle: { color: COLORS.textMuted, fontSize: 14, marginTop: 2 },
  logoutText: { color: COLORS.textMuted, fontSize: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: COLORS.textMuted, fontSize: 14 },
  statValue: { fontSize: 14, fontWeight: '600' },
  multiplierText: { fontSize: 12, textAlign: 'center', fontStyle: 'italic' },
  progressSection: { marginTop: SPACING.xs, gap: 4 },
  progressLabel: { color: COLORS.textMuted, fontSize: 12 },
  progressBg: { height: 8, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: RADIUS.full },
  progressXp: { color: COLORS.textMuted, fontSize: 11, textAlign: 'right' },
  maxLevel: { textAlign: 'center', fontSize: 14, fontWeight: '600' },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.sm },
  habitCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  habitIcon: { fontSize: 28 },
  habitName: { color: COLORS.text, fontSize: 16 },
  habitXp: { color: COLORS.textMuted, fontSize: 12 },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.lg },
});
