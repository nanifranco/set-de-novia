import { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useStore } from '../../src/store';
import { COLORS, SPACING, RADIUS } from '../../src/theme';
import { getCurrentLevel } from '../../src/data';
import type { Username } from '../../src/types';

export default function PartnerScreen() {
  const { currentUser, partnerUser, messages, sendMessage } = useStore();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  if (!currentUser || !partnerUser) return null;

  const myAccent = currentUser.username === 'maria' ? COLORS.maria.primary : COLORS.nani.primary;
  const partnerAccent = partnerUser.username === 'maria' ? COLORS.maria.primary : COLORS.nani.primary;

  const partnerLevel = getCurrentLevel(partnerUser.username as Username, partnerUser.xp);
  const myLevel = getCurrentLevel(currentUser.username as Username, currentUser.xp);

  const handleSend = async (type: 'text' | 'congrats' | 'love' = 'text') => {
    const content = type === 'text' ? text.trim() : type === 'congrats' ? '🎉 ¡Felicidades!' : '💕 Te quiero mucho';
    if (!content) return;
    setSending(true);
    try {
      await sendMessage(content, type);
      if (type === 'text') setText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingTop: 60 }}>

        {/* Partner progress */}
        <Text style={[styles.sectionTitle, { color: myAccent }]}>Progreso de {partnerUser.display_name}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.emoji}>{partnerLevel.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: partnerAccent }]}>{partnerUser.display_name}</Text>
              <Text style={styles.sub}>{partnerLevel.title}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.xpBig, { color: partnerAccent }]}>{partnerUser.xp} XP</Text>
              <Text style={styles.sub}>🔥 {partnerUser.streak_days} días</Text>
            </View>
          </View>
        </View>

        {/* My progress */}
        <Text style={[styles.sectionTitle, { color: myAccent }]}>Mi progreso</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.emoji}>{myLevel.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: myAccent }]}>{currentUser.display_name}</Text>
              <Text style={styles.sub}>{myLevel.title}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.xpBig, { color: myAccent }]}>{currentUser.xp} XP</Text>
              <Text style={styles.sub}>🔥 {currentUser.streak_days} días</Text>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={[styles.sectionTitle, { color: myAccent }]}>Enviar a {partnerUser.display_name}</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity style={[styles.quickBtn, { borderColor: myAccent }]} onPress={() => handleSend('congrats')}>
            <Text style={styles.quickText}>🎉 Felicidades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, { borderColor: myAccent }]} onPress={() => handleSend('love')}>
            <Text style={styles.quickText}>💕 Te quiero</Text>
          </TouchableOpacity>
        </View>

        {/* Text message */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={text}
            onChangeText={setText}
            placeholder={`Mensaje para ${partnerUser.display_name}...`}
            placeholderTextColor={COLORS.textMuted}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: myAccent }, sending && { opacity: 0.6 }]}
            onPress={() => handleSend('text')}
            disabled={sending || !text.trim()}
          >
            <Text style={styles.sendText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <Text style={[styles.sectionTitle, { color: myAccent }]}>Mensajes recientes</Text>
        {messages.slice(0, 20).map(msg => {
          const isMe = msg.sender_id === currentUser.id;
          return (
            <View key={msg.id} style={[styles.msgBubble, isMe ? styles.msgRight : styles.msgLeft]}>
              <Text style={styles.msgText}>{msg.content}</Text>
              <Text style={styles.msgTime}>
                {new Date(msg.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        })}
        {messages.length === 0 && (
          <Text style={styles.empty}>Todavía no hay mensajes. ¡Manda el primero! 💕</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  emoji: { fontSize: 32 },
  name: { fontSize: 18, fontWeight: 'bold' },
  sub: { color: COLORS.textMuted, fontSize: 13 },
  xpBig: { fontSize: 18, fontWeight: 'bold' },
  quickRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  quickBtn: { flex: 1, borderRadius: RADIUS.md, borderWidth: 1.5, padding: SPACING.sm, alignItems: 'center' },
  quickText: { color: COLORS.text, fontSize: 14 },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  input: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm, color: COLORS.text, fontSize: 15, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, justifyContent: 'center' },
  sendText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  msgBubble: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.xs, maxWidth: '80%' },
  msgRight: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  msgLeft: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  msgText: { color: COLORS.text, fontSize: 15 },
  msgTime: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.md },
});
