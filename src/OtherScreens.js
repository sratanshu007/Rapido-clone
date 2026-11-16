import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, Linking } from 'react-native';
import { Btn, Chip, C, st } from './ui';
import { useApp } from './Store';
import { T } from './data';

export function Rides() {
  const { rides } = useApp();
  return (<ScrollView style={{ padding: 16 }}><Text style={st.h}>My Rides</Text>
    {rides.length === 0 && <Text>Abhi koi ride nahi.</Text>}
    {rides.map((r) => (<View key={r.id} style={st.card}><Text style={{ fontWeight: '700' }}>{r.from} → {r.to}</Text>
      <Text>{r.veh} • ₹{r.price} • {r.status}</Text></View>))}</ScrollView>);
}
export function Safety() {
  const a = useApp(); const [n, setN] = useState(''); const [p, setP] = useState('');
  return (<ScrollView style={{ padding: 16 }}><Text style={st.h}>Safety Center</Text>
    <Btn t="🚨 Call 112" color={C.red} onPress={() => Linking.openURL('tel:112')} />
    <Btn t="Women helpline 1091" color={C.accent} onPress={() => Linking.openURL('tel:1091')} />
    <Text style={st.h}>Trusted contacts</Text>
    {a.contacts.map((c, i) => <View key={i} style={st.card}><Text>{c.name} - {c.phone}</Text></View>)}
    <TextInput placeholder="Name" value={n} onChangeText={setN} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, marginVertical: 4 }} />
    <TextInput placeholder="Phone" keyboardType="phone-pad" value={p} onChangeText={setP} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8 }} />
    <Btn t="Add contact" onPress={() => { if (!n || !p) return; a.set((o) => ({ contacts: [...o.contacts, { name: n, phone: p }] })); setN(''); setP(''); }} />
    <Text style={{ color: '#666' }}>Har ride me: OTP start, verified driver, helmet+hygiene check, live trip share, SOS.</Text></ScrollView>);
}
export function Wallet() {
  const a = useApp();
  return (<ScrollView style={{ padding: 16 }}><Text style={st.h}>Wallet</Text>
    <View style={st.card}><Text style={{ fontSize: 28, fontWeight: '800' }}>₹{a.wallet}</Text>
      <Text>Reward points: {a.points} (100 pts = ₹10) • Streak {a.streak} 🔥</Text></View>
    <View style={{ flexDirection: 'row' }}>{[100, 200, 500].map((x) => <Chip key={x} t={'+₹' + x} onPress={() => a.set((o) => ({ wallet: o.wallet + x }))} />)}</View>
    <Btn t="Redeem points" onPress={() => { if (a.points < 100) return Alert.alert('Kam points'); a.set((o) => ({ points: o.points - 100, wallet: o.wallet + 10 })); }} />
    <Btn t={a.lang === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'} color="#555" onPress={() => a.set({ lang: a.lang === 'en' ? 'hi' : 'en' })} />
  </ScrollView>);
}
