import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { Colors, S, R } from '../../src/constants/theme';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState<'nani' | 'maria'>('nani');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Faltan datos', 'Ingresa email y contraseña');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.user) {
          const name = displayName.trim() || (username === 'nani' ? 'Nani' : 'María');
          const { error: dbErr } = await supabase.from('users').insert({
            id: data.user.id, email: email.trim(), username, display_name: name,
            career_level: 1, career_xp: 0, coins: 50, streak_days: 0,
          });
          if (dbErr) throw dbErr;
          const resourceTypes = ['script', 'energy', 'negative', 'inspiration', 'prop', 'credit'];
          await supabase.from('user_resources').insert(
            resourceTypes.map(r => ({ user_id: data.user!.id, resource_type: r, quantity: 0 }))
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>🎬</Text>
          <Text style={styles.title}>CineLife</Text>
          <Text style={styles.subtitle}>Tu carrera cinematográfica comienza aquí</Text>

          {isSignUp && (
            <>
              <Text style={styles.label}>¿Quién eres?</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.pill, username === 'nani' && styles.pillActive]}
                  onPress={() => setUsername('nani')}
                >
                  <Text style={[styles.pillText, username === 'nani' && styles.pillTextActive]}>🔧 Nani</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pill, username === 'maria' && styles.pillActive]}
                  onPress={() => setUsername('maria')}
                >
                  <Text style={[styles.pillText, username === 'maria' && styles.pillTextActive]}>🎬 María</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input} placeholder="Tu nombre (opcional)"
                placeholderTextColor={Colors.mist} value={displayName} onChangeText={setDisplayName}
              />
            </>
          )}

          <TextInput
            style={styles.input} placeholder="Email" placeholderTextColor={Colors.mist}
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
          />
          <TextInput
            style={styles.input} placeholder="Contraseña" placeholderTextColor={Colors.mist}
            value={password} onChangeText={setPassword} secureTextEntry
          />

          <TouchableOpacity style={styles.btn} onPress={handleAuth} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.studio} />
              : <Text style={styles.btnText}>{isSignUp ? 'Crear cuenta' : 'Entrar al estudio'}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: S.lg }} onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggle}>
              {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crea tu cuenta'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flexGrow: 1, justifyContent: 'center', padding: S.xl },
  logo: { fontSize: 72, textAlign: 'center', marginBottom: S.sm },
  title: { fontSize: 32, fontWeight: '700', color: Colors.gold, textAlign: 'center', marginBottom: S.xs },
  subtitle: { fontSize: 15, color: Colors.mist, textAlign: 'center', marginBottom: S.xxl },
  label: { color: Colors.mist, fontSize: 13, marginBottom: S.sm, marginTop: S.sm },
  row: { flexDirection: 'row', gap: S.sm, marginBottom: S.md },
  pill: { flex: 1, padding: S.md, borderRadius: R.full, backgroundColor: Colors.bgCard, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  pillActive: { borderColor: Colors.gold, backgroundColor: Colors.bgElevated },
  pillText: { color: Colors.mist, fontWeight: '600', fontSize: 15 },
  pillTextActive: { color: Colors.gold },
  input: { backgroundColor: Colors.bgCard, color: Colors.parchment, padding: S.md, borderRadius: R.md, marginBottom: S.md, fontSize: 15 },
  btn: { backgroundColor: Colors.gold, padding: S.md, borderRadius: R.md, alignItems: 'center', marginTop: S.sm },
  btnText: { color: Colors.studio, fontWeight: '700', fontSize: 16 },
  toggle: { color: Colors.mist, textAlign: 'center', fontSize: 14 },
});
