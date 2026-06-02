import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { Colors, S, R } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

type RecommendationResult = {
  recommendation: string;
  is_from_watchlist: boolean;
  director: string;
  year: number;
  why: string;
  where_to_watch: string;
  mood_match: string;
};

const MOODS = ['Tranquila 🍌', 'Emocionada ⚡', 'Melancólica 🌧️', 'Curiosa 🔍', 'Cansada 🌙'];
const TIMES = ['Menos de 2 horas', 'Entre 2 y 3 horas', 'Tengo todo el tiempo'];
const WANTS = ['Que me haga pensar', 'Que me haga llorar', 'Que me sorprenda', 'Solo quiero relajarme', 'Que me inspire'];

export default function WatchlistScreen() {
  const { user, watchlist, addToWatchlist, markWatched, removeFromWatchlist } = useStore();
  const [filter, setFilter] = useState<'pending' | 'watched'>('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecommender, setShowRecommender] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ mood: '', time: '', want: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  // Add movie form state
  const [form, setForm] = useState({ title: '', director: '', year: '', genre: '', notes: '' });

  if (!user) return null;

  const filtered = watchlist.filter(m => filter === 'pending' ? !m.watched : m.watched);

  const handleAdd = async () => {
    if (!form.title.trim()) { Alert.alert('Falta el título'); return; }
    await addToWatchlist({
      title: form.title.trim(),
      director: form.director.trim(),
      year: form.year ? parseInt(form.year) : null,
      genre: form.genre.trim(),
      notes: form.notes.trim(),
      watched: false,
    });
    setForm({ title: '', director: '', year: '', genre: '', notes: '' });
    setShowAddModal(false);
  };

  const handleRecommend = async () => {
    setAiLoading(true);
    try {
      const { data } = await supabase.functions.invoke('recommend-movie', {
        body: { answers, watchlist: watchlist.filter(m => !m.watched) },
      });
      setResult(data);
    } catch (err) {
      Alert.alert('Error', 'No se pudo generar la recomendación. Intenta de nuevo.');
    } finally {
      setAiLoading(false);
    }
  };

  const resetRecommender = () => {
    setShowRecommender(false);
    setStep(0);
    setAnswers({ mood: '', time: '', want: '' });
    setResult(null);
  };

  const Questions = [
    { key: 'mood', label: '¿Cómo te sientes hoy, María?', options: MOODS },
    { key: 'time', label: '¿Cuánto tiempo tienes?', options: TIMES },
    { key: 'want', label: '¿Qué quieres sentir con la película?', options: WANTS },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>📽️ Mis Películas</Text>
          <TouchableOpacity style={styles.recommendBtn} onPress={() => setShowRecommender(true)}>
            <Text style={styles.recommendBtnTxt}>✨ ¿Qué veo hoy?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterBtn, filter === 'pending' && styles.filterBtnActive]} onPress={() => setFilter('pending')}>
            <Text style={[styles.filterTxt, filter === 'pending' && styles.filterTxtActive]}>Pendientes ({watchlist.filter(m => !m.watched).length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, filter === 'watched' && styles.filterBtnActive]} onPress={() => setFilter('watched')}>
            <Text style={[styles.filterTxt, filter === 'watched' && styles.filterTxtActive]}>Vistas ({watchlist.filter(m => m.watched).length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>{filter === 'pending' ? '🎬' : '✅'}</Text>
              <Text style={styles.emptyTxt}>{filter === 'pending' ? 'Tu watchlist está vacía' : 'Sin películas vistas aún'}</Text>
            </View>
          )}
          {filtered.map(movie => (
            <View key={movie.id} style={styles.movieCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                {movie.director && <Text style={styles.movieMeta}>{movie.director}{movie.year ? ` • ${movie.year}` : ''}</Text>}
                {movie.genre && <Text style={styles.movieGenre}>{movie.genre}</Text>}
                {movie.notes ? <Text style={styles.movieNotes}>{movie.notes}</Text> : null}
              </View>
              <View style={styles.movieActions}>
                {!movie.watched && (
                  <TouchableOpacity
                    style={styles.watchedBtn}
                    onPress={() => markWatched(movie.id)}
                  >
                    <Text style={styles.watchedBtnTxt}>✓ Vista</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => {
                  Alert.alert('Eliminar', `¿Quitar "${movie.title}" de tu watchlist?`, [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Eliminar', style: 'destructive', onPress: () => removeFromWatchlist(movie.id) },
                  ]);
                }}>
                  <Text style={styles.deleteBtn}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addBtnTxt}>+ Agregar película</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add movie modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar a watchlist</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView style={{ padding: S.lg }} keyboardShouldPersistTaps="handled">
            {[['Título *', 'title', 'Nombre de la película'], ['Director/a', 'director', 'Nombre del director/a'], ['Año', 'year', '2024'], ['Género', 'genre', 'Drama, Comedia, etc.'], ['Notas', 'notes', '¿Por qué quieres verla?']].map(([label, key, placeholder]) => (
              <View key={key} style={{ marginBottom: S.md }}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                  style={[styles.input, key === 'notes' && { height: 80, textAlignVertical: 'top' }]}
                  placeholder={placeholder as string}
                  placeholderTextColor={Colors.mist}
                  value={form[key as keyof typeof form]}
                  onChangeText={v => setForm(f => ({ ...f, [key]: v }))}
                  keyboardType={key === 'year' ? 'numeric' : 'default'}
                  multiline={key === 'notes'}
                />
              </View>
            ))}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleAdd}>
              <Text style={styles.primaryBtnTxt}>Agregar a la lista</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Recommender modal */}
      <Modal visible={showRecommender} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>✨ ¿Qué ves hoy?</Text>
            <TouchableOpacity onPress={resetRecommender}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>

          {!result ? (
            <View style={styles.recommenderContent}>
              {step < 3 ? (
                <View style={{ flex: 1, padding: S.lg }}>
                  <Text style={styles.stepIndicator}>{step + 1} / 3</Text>
                  <Text style={styles.questionText}>{Questions[step].label}</Text>
                  <View style={styles.optionsList}>
                    {Questions[step].options.map(opt => (
                      <TouchableOpacity
                        key={opt}
                        style={[
                          styles.optionBtn,
                          answers[Questions[step].key as keyof typeof answers] === opt && styles.optionBtnSelected,
                        ]}
                        onPress={() => {
                          setAnswers(a => ({ ...a, [Questions[step].key]: opt }));
                          if (step < 2) {
                            setStep(step + 1);
                          } else {
                            handleRecommend();
                          }
                        }}
                      >
                        <Text style={[
                          styles.optionTxt,
                          answers[Questions[step].key as keyof typeof answers] === opt && styles.optionTxtSelected,
                        ]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {step > 0 && (
                    <TouchableOpacity onPress={() => setStep(step - 1)} style={{ marginTop: S.md }}>
                      <Text style={{ color: Colors.mist, textAlign: 'center' }}>← Volver</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.loadingWrap}>
                  <Text style={{ fontSize: 48 }}>🎬</Text>
                  <Text style={styles.loadingTxt}>Luz está eligiendo tu película perfecta…</Text>
                </View>
              )}
            </View>
          ) : (
            <ScrollView style={{ padding: S.lg }}>
              {result.is_from_watchlist && (
                <View style={styles.fromWatchlistBadge}>
                  <Text style={styles.fromWatchlistTxt}>⭐ Está en tu watchlist</Text>
                </View>
              )}
              <Text style={styles.resultTitle}>{result.recommendation}</Text>
              <Text style={styles.resultMeta}>{result.director} • {result.year}</Text>
              <Text style={styles.resultMoodMatch}>“{result.mood_match}”</Text>
              <Text style={styles.resultWhy}>{result.why}</Text>
              {result.where_to_watch && (
                <Text style={styles.resultWhere}>📺 Dónde verla: {result.where_to_watch}</Text>
              )}
              {result.is_from_watchlist && (
                <TouchableOpacity
                  style={styles.markWatchedBtn}
                  onPress={() => {
                    const movie = watchlist.find(m => m.title.toLowerCase() === result.recommendation.toLowerCase());
                    if (movie) markWatched(movie.id);
                    resetRecommender();
                  }}
                >
                  <Text style={styles.markWatchedTxt}>✓ Marcar como vista después de verla</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.primaryBtn, { marginTop: S.md }]} onPress={resetRecommender}>
                <Text style={styles.primaryBtnTxt}>Listo</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: S.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: Colors.parchment },
  recommendBtn: { backgroundColor: Colors.rose, paddingHorizontal: S.md, paddingVertical: S.sm, borderRadius: R.full },
  recommendBtnTxt: { color: Colors.studio, fontWeight: '700', fontSize: 14 },
  filterRow: { flexDirection: 'row', paddingHorizontal: S.lg, gap: S.sm, marginBottom: S.md },
  filterBtn: { flex: 1, padding: S.sm, borderRadius: R.full, backgroundColor: Colors.bgCard, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  filterBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.bgElevated },
  filterTxt: { color: Colors.mist, fontWeight: '600', fontSize: 14 },
  filterTxtActive: { color: Colors.gold },
  list: { paddingHorizontal: S.lg, gap: S.sm },
  empty: { alignItems: 'center', paddingVertical: S.xxl, gap: S.md },
  emptyTxt: { color: Colors.mist, fontSize: 16 },
  movieCard: { backgroundColor: Colors.bgCard, borderRadius: R.md, padding: S.md, flexDirection: 'row', gap: S.sm, alignItems: 'flex-start' },
  movieTitle: { fontSize: 15, fontWeight: '700', color: Colors.parchment },
  movieMeta: { color: Colors.mist, fontSize: 13, marginTop: 2 },
  movieGenre: { color: Colors.blue, fontSize: 12, marginTop: 2 },
  movieNotes: { color: Colors.mist, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  movieActions: { gap: S.sm, alignItems: 'flex-end' },
  watchedBtn: { backgroundColor: Colors.green + '33', paddingHorizontal: S.sm, paddingVertical: 4, borderRadius: R.sm },
  watchedBtnTxt: { color: Colors.green, fontWeight: '700', fontSize: 12 },
  deleteBtn: { fontSize: 18, opacity: 0.5 },
  addBtn: { margin: S.lg, padding: S.md, borderWidth: 1, borderColor: Colors.gold, borderRadius: R.md, borderStyle: 'dashed', alignItems: 'center' },
  addBtnTxt: { color: Colors.gold, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: S.lg, borderBottomWidth: 1, borderBottomColor: Colors.bgElevated },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.parchment },
  closeBtn: { color: Colors.mist, fontSize: 22 },
  inputLabel: { color: Colors.mist, fontSize: 13, marginBottom: S.xs },
  input: { backgroundColor: Colors.bgCard, color: Colors.parchment, padding: S.md, borderRadius: R.md, fontSize: 15 },
  primaryBtn: { backgroundColor: Colors.gold, padding: S.md, borderRadius: R.md, alignItems: 'center' },
  primaryBtnTxt: { color: Colors.studio, fontWeight: '700', fontSize: 16 },
  recommenderContent: { flex: 1 },
  stepIndicator: { color: Colors.mist, fontSize: 13, textAlign: 'center', marginBottom: S.md },
  questionText: { fontSize: 22, fontWeight: '700', color: Colors.parchment, textAlign: 'center', marginBottom: S.xl, lineHeight: 30 },
  optionsList: { gap: S.sm },
  optionBtn: { padding: S.md, backgroundColor: Colors.bgCard, borderRadius: R.md, borderWidth: 1, borderColor: 'transparent' },
  optionBtnSelected: { borderColor: Colors.gold, backgroundColor: Colors.bgElevated },
  optionTxt: { color: Colors.parchment, fontSize: 16, textAlign: 'center' },
  optionTxtSelected: { color: Colors.gold, fontWeight: '700' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: S.lg, padding: S.xl },
  loadingTxt: { color: Colors.mist, fontSize: 16, textAlign: 'center' },
  fromWatchlistBadge: { backgroundColor: Colors.gold + '22', borderRadius: R.sm, padding: S.sm, marginBottom: S.md, alignSelf: 'flex-start' },
  fromWatchlistTxt: { color: Colors.gold, fontWeight: '700', fontSize: 13 },
  resultTitle: { fontSize: 26, fontWeight: '700', color: Colors.parchment, marginBottom: S.xs },
  resultMeta: { color: Colors.mist, fontSize: 14, marginBottom: S.md },
  resultMoodMatch: { color: Colors.rose, fontStyle: 'italic', fontSize: 15, marginBottom: S.md },
  resultWhy: { color: Colors.parchment, fontSize: 15, lineHeight: 24, marginBottom: S.md },
  resultWhere: { color: Colors.blue, fontSize: 14, marginBottom: S.md },
  markWatchedBtn: { backgroundColor: Colors.green + '22', padding: S.md, borderRadius: R.md, alignItems: 'center', marginTop: S.sm },
  markWatchedTxt: { color: Colors.green, fontWeight: '700' },
});
