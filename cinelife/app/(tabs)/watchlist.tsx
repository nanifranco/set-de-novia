import { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Modal, Alert, ActivityIndicator,
} from 'react-native';
import { useStore } from '../../src/store';
import { COLORS, SPACING, RADIUS } from '../../src/theme';

const QUESTIONS = [
  { key: 'mood', text: '¿Cómo te sientes hoy?', options: ['Feliz y emocionada', 'Relajada y tranquila', 'Pensativa o nostálgica', 'Necesito algo intenso'] },
  { key: 'story', text: '¿Qué tipo de historia quieres?', options: ['Una aventura o acción', 'Algo romántico', 'Un drama profundo', 'Comedia o algo ligero'] },
  { key: 'company', text: '¿Con quién la vas a ver?', options: ['Sola', 'Con Nani 💕', 'Con amigas', 'Con familia'] },
];

export default function WatchlistScreen() {
  const { currentUser, watchlist, addToWatchlist, markWatched, removeFromWatchlist, getAIRecommendation } = useStore();

  const [addVisible, setAddVisible] = useState(false);
  const [aiVisible, setAiVisible] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState('');
  const [loadingRec, setLoadingRec] = useState(false);

  const [form, setForm] = useState({ title: '', director: '', year: '', genre: '', notes: '' });

  if (!currentUser || currentUser.username !== 'maria') {
    return (
      <View style={styles.center}>
        <Text style={styles.noAccess}>Esta sección es solo para María 🎬</Text>
      </View>
    );
  }

  const pending = watchlist.filter(m => !m.watched);
  const watched = watchlist.filter(m => m.watched);

  const handleAdd = async () => {
    if (!form.title.trim()) { Alert.alert('Falta el título'); return; }
    await addToWatchlist({
      title: form.title.trim(),
      director: form.director.trim() || null,
      year: form.year ? parseInt(form.year) : null,
      genre: form.genre.trim() || null,
      notes: form.notes.trim() || null,
      watched: false,
    });
    setForm({ title: '', director: '', year: '', genre: '', notes: '' });
    setAddVisible(false);
  };

  const handleAIAnswer = async (answer: string) => {
    const key = QUESTIONS[aiStep].key;
    const newAnswers = { ...aiAnswers, [key]: answer };
    setAiAnswers(newAnswers);

    if (aiStep < QUESTIONS.length - 1) {
      setAiStep(aiStep + 1);
    } else {
      setLoadingRec(true);
      try {
        const rec = await getAIRecommendation(newAnswers);
        setRecommendation(rec);
        setAiStep(QUESTIONS.length);
      } catch {
        Alert.alert('Error', 'No pude conectarme a la IA. ¿Tienes internet?');
        setAiVisible(false);
      } finally {
        setLoadingRec(false);
      }
    }
  };

  const resetAI = () => {
    setAiStep(0);
    setAiAnswers({});
    setRecommendation('');
    setAiVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingTop: 60 }}>

        {/* Header buttons */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Mi Watchlist 🎬</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.maria.secondary }]} onPress={() => setAddVisible(true)}>
              <Text style={styles.btnText}>+ Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.maria.primary }]} onPress={() => { setAiVisible(true); setAiStep(0); setAiAnswers({}); setRecommendation(''); }}>
              <Text style={styles.btnText}>✨ IA</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending */}
        <Text style={styles.section}>Pendientes ({pending.length})</Text>
        {pending.map(movie => (
          <View key={movie.id} style={styles.movieCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              {movie.director && <Text style={styles.movieMeta}>Dir: {movie.director}{movie.year ? ` · ${movie.year}` : ''}</Text>}
              {movie.genre && <Text style={styles.movieMeta}>{movie.genre}</Text>}
              {movie.notes && <Text style={styles.movieNotes}>{movie.notes}</Text>}
            </View>
            <View style={styles.movieActions}>
              <TouchableOpacity onPress={() => markWatched(movie.id)}>
                <Text style={{ fontSize: 22 }}>✅</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFromWatchlist(movie.id)}>
                <Text style={{ fontSize: 22 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {pending.length === 0 && <Text style={styles.empty}>No tienes películas pendientes 🎉</Text>}

        {/* Watched */}
        {watched.length > 0 && (
          <>
            <Text style={[styles.section, { marginTop: SPACING.md }]}>Ya vistas ({watched.length})</Text>
            {watched.map(movie => (
              <View key={movie.id} style={[styles.movieCard, { opacity: 0.5 }]}>
                <Text style={styles.movieTitle}>✅ {movie.title}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add movie modal */}
      <Modal visible={addVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Agregar película</Text>
            {(['title', 'director', 'year', 'genre', 'notes'] as const).map(field => (
              <TextInput
                key={field}
                style={styles.input}
                value={form[field]}
                onChangeText={v => setForm(f => ({ ...f, [field]: v }))}
                placeholder={field === 'title' ? 'Título *' : field === 'director' ? 'Director/a' : field === 'year' ? 'Año' : field === 'genre' ? 'Género' : 'Notas'}
                placeholderTextColor={COLORS.textMuted}
                keyboardType={field === 'year' ? 'number-pad' : 'default'}
              />
            ))}
            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: COLORS.border }]} onPress={() => setAddVisible(false)}>
                <Text style={[styles.btnText, { color: COLORS.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: COLORS.maria.primary }]} onPress={handleAdd}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI recommender modal */}
      <Modal visible={aiVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {loadingRec ? (
              <>
                <ActivityIndicator color={COLORS.maria.primary} size="large" />
                <Text style={[styles.modalTitle, { marginTop: SPACING.md }]}>Pensando en la película perfecta...</Text>
              </>
            ) : aiStep < QUESTIONS.length ? (
              <>
                <Text style={styles.aiProgress}>{aiStep + 1} / {QUESTIONS.length}</Text>
                <Text style={styles.modalTitle}>{QUESTIONS[aiStep].text}</Text>
                {QUESTIONS[aiStep].options.map(opt => (
                  <TouchableOpacity key={opt} style={styles.aiOption} onPress={() => handleAIAnswer(opt)}>
                    <Text style={styles.aiOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={resetAI}>
                  <Text style={[styles.empty, { marginTop: SPACING.sm }]}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>✨ Recomendación</Text>
                <Text style={styles.recommendation}>{recommendation}</Text>
                <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.maria.primary, marginTop: SPACING.md }]} onPress={resetAI}>
                  <Text style={styles.btnText}>Listo 🎬</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  noAccess: { color: COLORS.textMuted, fontSize: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', gap: SPACING.sm },
  btn: { borderRadius: RADIUS.md, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '600', fontSize: 14 },
  section: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600', marginBottom: SPACING.sm },
  movieCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm, gap: SPACING.sm },
  movieTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  movieMeta: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  movieNotes: { color: COLORS.textMuted, fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  movieActions: { gap: SPACING.sm },
  empty: { color: COLORS.textMuted, textAlign: 'center', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { backgroundColor: COLORS.card, borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.sm },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  input: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm, color: COLORS.text, fontSize: 15, borderWidth: 1, borderColor: COLORS.border },
  aiProgress: { color: COLORS.maria.primary, textAlign: 'center', fontSize: 13 },
  aiOption: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.maria.secondary },
  aiOptionText: { color: COLORS.text, fontSize: 15, textAlign: 'center' },
  recommendation: { color: COLORS.text, fontSize: 15, lineHeight: 22, textAlign: 'center', padding: SPACING.sm },
});
