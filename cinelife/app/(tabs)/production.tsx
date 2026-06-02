import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { Colors, S, R } from '../../src/constants/theme';
import { PRODUCTION_PHASES, RESOURCE_INFO } from '../../src/constants/habits';
import { hasEnoughResources } from '../../src/lib/gameEngine';

export default function ProductionScreen() {
  const { user, currentMovie, completedMovies, aiLoading, startMovie, advanceMoviePhase } = useStore();
  const [newMovieModal, setNewMovieModal] = useState(false);
  const [premiereMovie, setPremiereMovie] = useState<any>(null);

  if (!user) return null;

  const handleAdvance = async () => {
    const result = await advanceMoviePhase();
    if (!result.success) {
      const phase = PRODUCTION_PHASES[(currentMovie?.phase ?? 1) - 1];
      Alert.alert(
        'Recursos insuficientes',
        `Necesitas más ${Object.entries(phase.required).map(([k, v]) => `${v} ${RESOURCE_INFO[k as keyof typeof RESOURCE_INFO]?.icon}`).join(', ')} para avanzar. Completa más hábitos.`,
      );
    } else if (result.newMovie) {
      setPremiereMovie(result.newMovie);
    }
  };

  const currentPhaseData = currentMovie ? PRODUCTION_PHASES[currentMovie.phase - 1] : null;
  const canAdvance = currentMovie && currentPhaseData
    ? hasEnoughResources(user.resources, currentPhaseData.required)
    : false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Producción</Text>
        </View>

        {/* No movie active */}
        {!currentMovie && !aiLoading && (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 64 }}>🎬</Text>
            <Text style={styles.emptyTitle}>Sin película en producción</Text>
            <Text style={styles.emptySub}>Inicia una nueva producción y completa hábitos para acumular los recursos que necesitas.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setNewMovieModal(true)}>
              <Text style={styles.primaryBtnTxt}>Iniciar nueva película</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* AI generating */}
        {aiLoading && (
          <View style={styles.emptyWrap}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.aiTitle}>Generando tu película…</Text>
            <Text style={styles.aiSub}>La IA está creando el título, la sinopsis y los créditos. Esto toma un momento.</Text>
          </View>
        )}

        {/* Active movie */}
        {currentMovie && !aiLoading && (
          <View style={styles.section}>
            <View style={styles.movieCard}>
              <Text style={styles.movieCardLabel}>En producción</Text>
              <Text style={styles.movieCardPhase}>
                Fase {currentMovie.phase}/3 — {PRODUCTION_PHASES[currentMovie.phase - 1]?.name}
              </Text>
              <Text style={styles.movieCardDesc}>{PRODUCTION_PHASES[currentMovie.phase - 1]?.description}</Text>

              {/* Phase indicators */}
              <View style={styles.phaseRow}>
                {PRODUCTION_PHASES.map(p => (
                  <View key={p.phase} style={[styles.phaseChip, currentMovie.phase > p.phase && styles.phaseChipDone, currentMovie.phase === p.phase && styles.phaseChipActive]}>
                    <Text style={styles.phaseChipIcon}>{p.icon}</Text>
                    <Text style={styles.phaseChipName}>{p.name}</Text>
                    {currentMovie.phase > p.phase && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                ))}
              </View>
            </View>

            {/* Resources needed */}
            {currentPhaseData && (
              <View style={styles.resourcesCard}>
                <Text style={styles.resourcesTitle}>Recursos para avanzar a {currentMovie.phase < 3 ? PRODUCTION_PHASES[currentMovie.phase]?.name : 'estreno'}</Text>
                {(Object.entries(currentPhaseData.required) as [string, number][]).map(([key, needed]) => {
                  const info = RESOURCE_INFO[key as keyof typeof RESOURCE_INFO];
                  const have = user.resources[key as keyof typeof user.resources] || 0;
                  const pct = Math.min(have / needed, 1);
                  return (
                    <View key={key} style={styles.resourceRow}>
                      <Text style={styles.resourceRowIcon}>{info.icon}</Text>
                      <Text style={styles.resourceRowLabel}>{info.label}</Text>
                      <View style={styles.resourceRowBar}>
                        <View style={[styles.resourceRowFill, { width: `${pct * 100}%`, backgroundColor: info.color }]} />
                      </View>
                      <Text style={[styles.resourceRowCount, have >= needed ? { color: Colors.green } : { color: Colors.mist }]}>
                        {have}/{needed}
                      </Text>
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={[styles.advanceBtn, !canAdvance && styles.advanceBtnDisabled]}
                  onPress={handleAdvance}
                  disabled={!canAdvance}
                >
                  <Text style={styles.advanceBtnTxt}>
                    {canAdvance
                      ? currentMovie.phase === 3 ? '🎉 ¡Estrenar película!' : 'Avanzar a siguiente fase'
                      : 'Completa más hábitos para avanzar'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Habit activity log */}
            <View style={styles.habitLogCard}>
              <Text style={styles.habitLogTitle}>📊 Hábitos en esta producción</Text>
              {Object.entries(currentMovie.habit_log).map(([cat, count]) => count > 0 ? (
                <View key={cat} style={styles.habitLogRow}>
                  <Text style={styles.habitLogCat}>{cat}</Text>
                  <Text style={styles.habitLogCount}>{count} completados</Text>
                </View>
              ) : null)}
              {Object.values(currentMovie.habit_log).every(v => v === 0) && (
                <Text style={styles.emptySub}>Completa hábitos para que influyan en el estilo de tu película</Text>
              )}
            </View>
          </View>
        )}

        {/* Filmography */}
        {completedMovies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.filmoTitle}>Filmografía</Text>
            {completedMovies.map(m => (
              <View key={m.id} style={styles.filmoCard}>
                <View style={styles.filmoLeft}>
                  <Text style={styles.filmoMovieTitle}>"{m.title}"</Text>
                  <Text style={styles.filmoGenre}>{m.genre}</Text>
                  <Text style={styles.filmoSynopsis} numberOfLines={3}>{m.synopsis}</Text>
                  {m.director_note && <Text style={styles.filmoNote} numberOfLines={2}>“{m.director_note}”</Text>}
                </View>
                <View style={styles.filmoRight}>
                  {m.critic_rating && <Text style={styles.filmoRating}>⭐ {m.critic_rating}</Text>}
                  {m.festival && <Text style={styles.filmoFestival}>{m.festival}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Confirm new movie */}
      <Modal visible={newMovieModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🎬 Nueva producción</Text>
            <Text style={styles.modalText}>
              Comenzarás una nueva película. Los hábitos que completes durante la producción darán forma a su estilo y género.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={async () => { await startMovie(); setNewMovieModal(false); }}>
              <Text style={styles.primaryBtnTxt}>Comenzar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewMovieModal(false)} style={{ marginTop: S.md }}>
              <Text style={{ color: Colors.mist, textAlign: 'center' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Premiere modal */}
      <Modal visible={!!premiereMovie} animationType="slide">
        <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
          <ScrollView contentContainerStyle={{ padding: S.xl, alignItems: 'center' }}>
            <Text style={{ fontSize: 64 }}>🎉</Text>
            <Text style={styles.premiereLabel}>ESTRENO MUNDIAL</Text>
            <Text style={styles.premiereTitle}>"{premiereMovie?.title}"</Text>
            <Text style={styles.premiereGenre}>{premiereMovie?.genre}</Text>
            {premiereMovie?.tagline && <Text style={styles.premiereTagline}>{premiereMovie.tagline}</Text>}
            <Text style={styles.premiereSynopsis}>{premiereMovie?.synopsis}</Text>
            {premiereMovie?.director_note && (
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>“{premiereMovie.director_note}”</Text>
              </View>
            )}
            <View style={styles.ratingsRow}>
              <Text style={styles.rating}>⭐ {premiereMovie?.critic_rating} crítica</Text>
              <Text style={styles.rating}>❤️ {premiereMovie?.audience_rating} público</Text>
            </View>
            {premiereMovie?.festival && <Text style={styles.festival}>{premiereMovie.festival}</Text>}
            <Text style={styles.premiereReward}>+200 XP  +150 🎬</Text>
            <TouchableOpacity style={[styles.primaryBtn, { marginTop: S.xl, width: '100%' }]} onPress={() => setPremiereMovie(null)}>
              <Text style={styles.primaryBtnTxt}>Guardar en filmografía</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: S.lg, paddingBottom: 0 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.parchment },
  section: { padding: S.lg, gap: S.md },
  emptyWrap: { alignItems: 'center', padding: S.xl, gap: S.md },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.parchment },
  emptySub: { color: Colors.mist, textAlign: 'center', fontSize: 14 },
  aiTitle: { fontSize: 18, fontWeight: '600', color: Colors.gold, marginTop: S.md },
  aiSub: { color: Colors.mist, textAlign: 'center', fontSize: 14 },
  primaryBtn: { backgroundColor: Colors.gold, padding: S.md, borderRadius: R.md, alignItems: 'center', marginTop: S.md, minWidth: 200 },
  primaryBtnTxt: { color: Colors.studio, fontWeight: '700', fontSize: 16 },
  movieCard: { backgroundColor: Colors.bgCard, borderRadius: R.lg, padding: S.lg },
  movieCardLabel: { color: Colors.mist, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  movieCardPhase: { fontSize: 22, fontWeight: '700', color: Colors.gold, marginTop: 4 },
  movieCardDesc: { color: Colors.mist, fontSize: 14, marginTop: 4, marginBottom: S.md },
  phaseRow: { flexDirection: 'row', gap: S.sm },
  phaseChip: { flex: 1, padding: S.sm, backgroundColor: Colors.bgElevated, borderRadius: R.sm, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  phaseChipDone: { borderColor: Colors.green, opacity: 0.7 },
  phaseChipActive: { borderColor: Colors.gold },
  phaseChipIcon: { fontSize: 20 },
  phaseChipName: { color: Colors.mist, fontSize: 11, marginTop: 2 },
  checkmark: { color: Colors.green, fontSize: 14, fontWeight: '700' },
  resourcesCard: { backgroundColor: Colors.bgCard, borderRadius: R.lg, padding: S.lg, gap: S.md },
  resourcesTitle: { fontSize: 14, fontWeight: '600', color: Colors.parchment },
  resourceRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  resourceRowIcon: { fontSize: 16, width: 24 },
  resourceRowLabel: { color: Colors.mist, fontSize: 13, width: 80 },
  resourceRowBar: { flex: 1, height: 6, backgroundColor: Colors.bgElevated, borderRadius: 3, overflow: 'hidden' },
  resourceRowFill: { height: '100%', borderRadius: 3 },
  resourceRowCount: { fontSize: 13, fontWeight: '600', width: 36, textAlign: 'right' },
  advanceBtn: { backgroundColor: Colors.gold, padding: S.md, borderRadius: R.md, alignItems: 'center', marginTop: S.sm },
  advanceBtnDisabled: { backgroundColor: Colors.bgElevated },
  advanceBtnTxt: { color: Colors.studio, fontWeight: '700' },
  habitLogCard: { backgroundColor: Colors.bgCard, borderRadius: R.lg, padding: S.lg, gap: S.sm },
  habitLogTitle: { fontSize: 14, fontWeight: '600', color: Colors.parchment, marginBottom: S.xs },
  habitLogRow: { flexDirection: 'row', justifyContent: 'space-between' },
  habitLogCat: { color: Colors.mist, fontSize: 13, textTransform: 'capitalize' },
  habitLogCount: { color: Colors.parchment, fontSize: 13, fontWeight: '600' },
  filmoTitle: { fontSize: 20, fontWeight: '700', color: Colors.parchment, marginBottom: S.md },
  filmoCard: { backgroundColor: Colors.bgCard, borderRadius: R.lg, padding: S.lg, flexDirection: 'row', gap: S.md, marginBottom: S.md },
  filmoLeft: { flex: 1, gap: 4 },
  filmoMovieTitle: { fontSize: 16, fontWeight: '700', color: Colors.gold },
  filmoGenre: { color: Colors.mist, fontSize: 12 },
  filmoSynopsis: { color: Colors.parchment, fontSize: 13, lineHeight: 18 },
  filmoNote: { color: Colors.rose, fontSize: 12, fontStyle: 'italic' },
  filmoRight: { alignItems: 'flex-end', gap: 4 },
  filmoRating: { color: Colors.gold, fontWeight: '700' },
  filmoFestival: { color: Colors.mist, fontSize: 11, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'center', padding: S.xl },
  modalBox: { backgroundColor: Colors.bgCard, borderRadius: R.lg, padding: S.xl, gap: S.md },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.parchment },
  modalText: { color: Colors.mist, fontSize: 14, lineHeight: 20 },
  premiereLabel: { color: Colors.gold, fontSize: 13, letterSpacing: 2, fontWeight: '700', marginTop: S.md },
  premiereTitle: { fontSize: 28, fontWeight: '700', color: Colors.parchment, textAlign: 'center', marginTop: S.sm },
  premiereGenre: { color: Colors.mist, fontSize: 14, marginTop: 4 },
  premiereTagline: { color: Colors.rose, fontSize: 15, fontStyle: 'italic', textAlign: 'center', marginTop: S.sm },
  premiereSynopsis: { color: Colors.parchment, fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: S.md },
  noteBox: { backgroundColor: Colors.bgCard, borderRadius: R.md, padding: S.md, marginTop: S.md },
  noteText: { color: Colors.rose, fontStyle: 'italic', fontSize: 13, lineHeight: 20 },
  ratingsRow: { flexDirection: 'row', gap: S.xl, marginTop: S.md },
  rating: { color: Colors.gold, fontWeight: '700', fontSize: 16 },
  festival: { color: Colors.mist, fontSize: 13, marginTop: S.sm },
  premiereReward: { color: Colors.green, fontWeight: '700', fontSize: 18, marginTop: S.lg },
});
