import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { Colors, S, R } from '../../src/constants/theme';
import { CHEER_MESSAGES, RESOURCE_INFO } from '../../src/constants/habits';
import { getLevelInfo } from '../../src/lib/gameEngine';
import { UserResources } from '../../src/types';

export default function PartnerScreen() {
  const { user, partner, messages, sendCheer, sendGift, markMessagesRead } = useStore();
  const [showCheer, setShowCheer] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [giftType, setGiftType] = useState<keyof UserResources>('energy');
  const [giftQty, setGiftQty] = useState(1);

  useEffect(() => { markMessagesRead(); }, []);

  if (!user) return null;

  if (!partner) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noPartner}>
          <Text style={{ fontSize: 56 }}>💕</Text>
          <Text style={styles.noPartnerTitle}>Sin pareja vinculada</Text>
          <Text style={styles.noPartnerSub}>Para vincular a tu pareja, una de las dos debe agregar el ID de la otra en la base de datos (campo partner_id).</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { currentLevel: partnerLevel } = getLevelInfo(partner.career_xp);
  const isMaria = partner.username === 'maria';

  const handleCheer = async (msg: string) => {
    await sendCheer(msg);
    setShowCheer(false);
    setCustomMsg('');
    Alert.alert('💕 Enviado', `${partner.display_name} recibirá tu mensaje de ánimo`);
  };

  const handleGift = async () => {
    const available = user.resources[giftType] || 0;
    if (giftQty > available) {
      Alert.alert('No tienes suficientes', `Solo tienes ${available} ${RESOURCE_INFO[giftType].label}`);
      return;
    }
    await sendGift(giftType, giftQty);
    setShowGift(false);
    Alert.alert('🎁 Regalo enviado', `Le enviaste ${giftQty} ${RESOURCE_INFO[giftType].label} a ${partner.display_name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{isMaria ? '🎬' : '🔧'} {partner.display_name}</Text>
          <Text style={styles.subtitle}>{partnerLevel.title}</Text>
        </View>

        {/* Partner stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>🔥 {partner.streak_days}</Text>
            <Text style={styles.statLbl}>días racha</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>🎬 {partner.career_xp}</Text>
            <Text style={styles.statLbl}>XP total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>🏆 {partner.career_level}</Text>
            <Text style={styles.statLbl}>nivel</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowCheer(true)}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionLabel}>Enviar ánimo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowGift(true)}>
            <Text style={styles.actionIcon}>🎁</Text>
            <Text style={styles.actionLabel}>Regalar recurso</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mensajes recientes</Text>
          {messages.length === 0 && (
            <Text style={styles.emptyMsg}>Sin mensajes todavía. ¡Sé la primera en enviar ánimo!</Text>
          )}
          {messages.map(msg => (
            <View key={msg.id} style={[styles.msgCard, !msg.read && styles.msgUnread]}>
              <Text style={styles.msgIcon}>{msg.type === 'gift' ? '🎁' : '💬'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.msgContent}>{msg.content}</Text>
                <Text style={styles.msgTime}>{new Date(msg.created_at).toLocaleDateString('es', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              {!msg.read && <View style={styles.unreadDot} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cheer modal */}
      <Modal visible={showCheer} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enviar ánimo a {partner.display_name}</Text>
            <TouchableOpacity onPress={() => setShowCheer(false)}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView style={{ padding: S.lg }}>
            {CHEER_MESSAGES.map((msg, i) => (
              <TouchableOpacity key={i} style={styles.cheerOption} onPress={() => handleCheer(msg)}>
                <Text style={styles.cheerText}>{msg}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.customWrap}>
              <TextInput
                style={styles.customInput}
                placeholder="O escribe algo personal…"
                placeholderTextColor={Colors.mist}
                value={customMsg}
                onChangeText={setCustomMsg}
                multiline
                maxLength={150}
              />
              {customMsg.length > 0 && (
                <TouchableOpacity style={styles.sendBtn} onPress={() => handleCheer(customMsg)}>
                  <Text style={styles.sendBtnTxt}>Enviar 💕</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Gift modal */}
      <Modal visible={showGift} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Regalar recurso</Text>
            <TouchableOpacity onPress={() => setShowGift(false)}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView style={{ padding: S.lg }}>
            <Text style={styles.giftLabel}>Elige qué regalar</Text>
            <View style={styles.giftGrid}>
              {(Object.entries(RESOURCE_INFO) as [keyof UserResources, any][]).map(([key, info]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.giftChip, giftType === key && { borderColor: info.color }]}
                  onPress={() => setGiftType(key)}
                >
                  <Text style={styles.giftChipIcon}>{info.icon}</Text>
                  <Text style={[styles.giftChipLabel, giftType === key && { color: info.color }]}>{info.label}</Text>
                  <Text style={styles.giftChipCount}>Tienes: {user.resources[key] || 0}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.giftLabel}>Cantidad</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setGiftQty(Math.max(1, giftQty - 1))}>
                <Text style={styles.qtyBtnTxt}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{giftQty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setGiftQty(Math.min(5, giftQty + 1))}>
                <Text style={styles.qtyBtnTxt}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleGift}>
              <Text style={styles.primaryBtnTxt}>Regalar {giftQty} {RESOURCE_INFO[giftType].label} {RESOURCE_INFO[giftType].icon}</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  noPartner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: S.xl, gap: S.md },
  noPartnerTitle: { fontSize: 20, fontWeight: '700', color: Colors.parchment },
  noPartnerSub: { color: Colors.mist, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  header: { padding: S.lg },
  title: { fontSize: 28, fontWeight: '700', color: Colors.parchment },
  subtitle: { color: Colors.gold, fontSize: 14, marginTop: 4 },
  statsCard: { flexDirection: 'row', marginHorizontal: S.lg, backgroundColor: Colors.bgCard, borderRadius: R.lg, padding: S.lg, marginBottom: S.md },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: '700', color: Colors.parchment },
  statLbl: { color: Colors.mist, fontSize: 12, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: S.md, paddingHorizontal: S.lg, marginBottom: S.lg },
  actionBtn: { flex: 1, backgroundColor: Colors.bgCard, borderRadius: R.lg, padding: S.lg, alignItems: 'center', gap: S.xs },
  actionIcon: { fontSize: 32 },
  actionLabel: { color: Colors.parchment, fontWeight: '600', fontSize: 14 },
  section: { paddingHorizontal: S.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.parchment, marginBottom: S.md },
  emptyMsg: { color: Colors.mist, fontSize: 14, textAlign: 'center', paddingVertical: S.xl },
  msgCard: { flexDirection: 'row', backgroundColor: Colors.bgCard, borderRadius: R.md, padding: S.md, gap: S.sm, marginBottom: S.sm, borderWidth: 1, borderColor: 'transparent' },
  msgUnread: { borderColor: Colors.rose + '44' },
  msgIcon: { fontSize: 22 },
  msgContent: { color: Colors.parchment, fontSize: 14, lineHeight: 20 },
  msgTime: { color: Colors.mist, fontSize: 12, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.rose, alignSelf: 'center' },
  modal: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: S.lg, borderBottomWidth: 1, borderBottomColor: Colors.bgElevated },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.parchment },
  closeBtn: { color: Colors.mist, fontSize: 22 },
  cheerOption: { backgroundColor: Colors.bgCard, borderRadius: R.md, padding: S.md, marginBottom: S.sm },
  cheerText: { color: Colors.parchment, fontSize: 15 },
  customWrap: { marginTop: S.lg, gap: S.md },
  customInput: { backgroundColor: Colors.bgCard, color: Colors.parchment, padding: S.md, borderRadius: R.md, fontSize: 15, minHeight: 80, textAlignVertical: 'top' },
  sendBtn: { backgroundColor: Colors.rose, padding: S.md, borderRadius: R.md, alignItems: 'center' },
  sendBtnTxt: { color: Colors.studio, fontWeight: '700', fontSize: 15 },
  giftLabel: { color: Colors.mist, fontSize: 13, marginBottom: S.sm, marginTop: S.sm },
  giftGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, marginBottom: S.md },
  giftChip: { width: '30%', padding: S.sm, backgroundColor: Colors.bgCard, borderRadius: R.sm, borderWidth: 1, borderColor: 'transparent', alignItems: 'center' },
  giftChipIcon: { fontSize: 22 },
  giftChipLabel: { color: Colors.mist, fontSize: 12, marginTop: 2 },
  giftChipCount: { color: Colors.mist, fontSize: 10, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: S.xl, marginBottom: S.lg },
  qtyBtn: { backgroundColor: Colors.bgCard, width: 44, height: 44, borderRadius: R.full, alignItems: 'center', justifyContent: 'center' },
  qtyBtnTxt: { color: Colors.parchment, fontSize: 22, fontWeight: '700' },
  qtyVal: { fontSize: 28, fontWeight: '700', color: Colors.parchment, minWidth: 40, textAlign: 'center' },
  primaryBtn: { backgroundColor: Colors.gold, padding: S.md, borderRadius: R.md, alignItems: 'center' },
  primaryBtnTxt: { color: Colors.studio, fontWeight: '700', fontSize: 16 },
});
