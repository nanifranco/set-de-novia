import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { Colors, S, R } from '../../src/constants/theme';
import { HABIT_TEMPLATES, RESOURCE_INFO } from '../../src/constants/habits';
import { getStreakMultiplier } from '../../src/lib/gameEngine';

export default function HabitsScreen() {
  const { user, habits, completeHabit, addHabit } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<typeof HABIT_TEMPLATES[0] | null>(null);

  if (!user) return null;

  const multiplier = getStreakMultiplier(user.streak_days);
  const doneCount = habits.filter(h => h.completed_today).length;
  const available = HABIT_TEMPLATES.filter(t => !habits.find(h => h.name === t.name));

  const handleAdd = async () => {
    if (!selected) return;
    await addHabit({
      name: selected.name, category: selected.category, icon: selected.icon,
      xp_reward: selected.xp, coins_reward: selected.coins,
      resources: selected.resources, is_active: true,
    });
    setShowModal(false);
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Hábitos</Text>
          <View style={styles.statsRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeVal}>🔥 {user.streak_days}</Text>
              <Text style={styles.badgeLbl}>racha</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeVal}>✅ {doneCount}/{habits.length}</Text>
              <Text style={styles.badgeLbl}>hoy</Text>
            </View>
            {multiplier > 1 && (
              <View style={[styles.badge, { borderColor: Colors.gold }]}>
                <Text style={[styles.badgeVal, { color: Colors.gold }]}>x{multiplier.toFixed(1)}</Text>
                <Text style={styles.badgeLbl}>XP bonus</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.list}>
          {habits.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>🎬</Text>
              <Text style={styles.emptyTitle}>Sin hábitos todavía</Text>
              <Text style={styles.emptySub}>Agrega hábitos para ganar recursos cinematográficos</Text>
            </View>
          )}
          {habits.map(habit => (
            <TouchableOpacity
              key={habit.id}
              style={[styles.card, habit.completed_today && styles.cardDone]}
              onPress={() => !habit.completed_today && completeHabit(habit.id)}
              activeOpacity={habit.completed_today ? 1 : 0.7}
            >
              <Text style={styles.cardIcon}>{habit.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardName, habit.completed_today && styles.strikethrough]}>{habit.name}</Text>
                <View style={styles.rewards}>
                  <Text style={styles.rewardTxt}>+{Math.round(habit.xp_reward * multiplier)} XP</Text>
                  <Text style={styles.rewardTxt}>+{habit.coins_reward} 🎬</Text>
                  {(Object.entries(habit.resources || {}) as [string, number][]).map(([k, v]) => {
                    const info = RESOURCE_INFO[k as keyof typeof RESOURCE_INFO];
                    return info ? (
                      <Text key={k} style={[styles.rewardTxt, { color: info.color }]}>+{v}{info.icon}</Text>
                    ) : null;
                  })}
                </View>
              </View>
              {habit.completed_today
                ? <Text style={{ fontSize: 22 }}>✅</Text>
                : <View style={styles.markBtn}><Text style={styles.markTxt}>Marcar</Text></View>
              }
            </TouchableOpacity>
          ))}
        </View>

        {habits.length < 8 && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.addBtnTxt}>+ Agregar hábito</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal para agregar hábito */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>¿Qué hábito agregas?</Text>
            <TouchableOpacity onPress={() => { setShowModal(false); setSelected(null); }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ padding: S.lg }}>
            {available.map((t, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.templateCard, selected?.name === t.name && styles.templateSelected]}
                onPress={() => setSelected(t)}
              >
                <Text style={styles.templateIcon}>{t.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.templateName}>{t.name}</Text>
                  <Text style={styles.templateDesc}>{t.description}</Text>
                  <View style={styles.rewards}>
                    <Text style={styles.rewardTxt}>+{t.xp} XP</Text>
                    {(Object.entries(t.resources) as [string, number][]).map(([k, v]) => {
                      const info = RESOURCE_INFO[k as keyof typeof RESOURCE_INFO];
                      return info ? <Text key={k} style={[styles.rewardTxt, { color: info.color }]}>+{v}{info.icon}</Text> : null;
                    })}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selected && (
            <TouchableOpacity style={styles.confirmBtn} onPress={handleAdd}>
              <Text style={styles.confirmTxt}>Agregar "{selected.name}"</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: S.lg },
  title: { fontSize: 28, fontWeight: '700', color: Colors.parchment, marginBottom: S.md },
  statsRow: { flexDirection: 'row', gap: S.sm },
  badge: { padding: S.sm, backgroundColor: Colors.bgCard, borderRadius: R.sm, borderWidth: 1, borderColor: Colors.bgElevated, alignItems: 'center', minWidth: 72 },
  badgeVal: { color: Colors.parchment, fontWeight: '700', fontSize: 14 },
  badgeLbl: { color: Colors.mist, fontSize: 11 },
  list: { paddingHorizontal: S.lg, gap: S.sm },
  empty: { alignItems: 'center', paddingVertical: S.xxl, gap: S.md },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.parchment },
  emptySub: { color: Colors.mist, textAlign: 'center', fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: R.md, padding: S.md, gap: S.md },
  cardDone: { opacity: 0.55 },
  cardIcon: { fontSize: 28 },
  cardName: { color: Colors.parchment, fontSize: 15, fontWeight: '600' },
  strikethrough: { textDecorationLine: 'line-through', color: Colors.mist },
  rewards: { flexDirection: 'row', gap: S.sm, marginTop: 3, flexWrap: 'wrap' },
  rewardTxt: { color: Colors.mist, fontSize: 12 },
  markBtn: { backgroundColor: Colors.gold, paddingHorizontal: S.md, paddingVertical: S.xs, borderRadius: R.sm },
  markTxt: { color: Colors.studio, fontWeight: '700', fontSize: 13 },
  addBtn: { margin: S.lg, padding: S.md, borderWidth: 1, borderColor: Colors.gold, borderRadius: R.md, borderStyle: 'dashed', alignItems: 'center' },
  addBtnTxt: { color: Colors.gold, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: S.lg, borderBottomWidth: 1, borderBottomColor: Colors.bgElevated },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.parchment },
  closeBtn: { color: Colors.mist, fontSize: 22 },
  templateCard: { flexDirection: 'row', padding: S.md, marginBottom: S.sm, backgroundColor: Colors.bgCard, borderRadius: R.md, borderWidth: 1, borderColor: 'transparent', gap: S.md },
  templateSelected: { borderColor: Colors.gold },
  templateIcon: { fontSize: 30 },
  templateName: { color: Colors.parchment, fontWeight: '600', fontSize: 15 },
  templateDesc: { color: Colors.mist, fontSize: 12, marginTop: 2 },
  confirmBtn: { margin: S.lg, padding: S.md, backgroundColor: Colors.gold, borderRadius: R.md, alignItems: 'center' },
  confirmTxt: { color: Colors.studio, fontWeight: '700', fontSize: 16 },
});
