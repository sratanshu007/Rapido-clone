import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Switch, Alert, Linking } from 'react-native';
import { PLACES, VEHICLES, km, fare, makeDriver, T } from './data';
import { Btn, Chip, C, st } from './ui';
import { useApp } from './Store';

export default function BookScreen() {
  const app = useApp(); const t = T[app.lang];
  const [step, setStep] = useState('form'); // form | bids | ride | done
  const [pick, setPick] = useState(PLACES[0]); const [drop, setDrop] = useState(PLACES[1]);
  const [veh, setVeh] = useState(VEHICLES[0]); const [offer, setOffer] = useState(0);
  const [women, setWomen] = useState(false); const [later, setLater] = useState(0);
  const [pay, setPay] = useState('Cash'); const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState(null); const [prog, setProg] = useState(0);
  const [otp] = useState(String(1000 + Math.floor(Math.random() * 9000)));
  const timer = useRef(null);
  const dist = km(pick, drop); const base = fare(veh, dist);
  useEffect(() => setOffer(base), [base]);
  useEffect(() => () => clearInterval(timer.current), []);

  const find = () => {
    if (pick.name === drop.name) return Alert.alert('Oops', 'Pickup aur drop alag rakho');
    if (pay === 'Wallet' && app.wallet < offer) return Alert.alert('Low balance', 'Wallet recharge karo');
    if (later > 0) {
      app.set((o) => ({ rides: [{ id: Date.now() + '', from: pick.name, to: drop.name, price: offer, veh: veh.name, status: `Scheduled in ${later} min` }, ...o.rides] }));
      return Alert.alert('Scheduled ✅', `Ride ${later} minute baad confirm hogi`);
    }
    setDrivers([]); setStep('bids'); let n = 0;
    timer.current = setInterval(() => {
      n++; setDrivers((d) => [...d, makeDriver(n, women, offer)]);
      if (n >= 4) clearInterval(timer.current);
    }, 1200);
  };
  const accept = (d) => {
    clearInterval(timer.current); setDriver(d); setStep('ride'); setProg(0);
    timer.current = setInterval(() => setProg((p) => { if (p >= 100) { clearInterval(timer.current); return 100; } return p + 5; }), 700);
  };
  const finish = () => {
    clearInterval(timer.current);
    const price = driver.price;
    app.set((o) => ({
      wallet: pay === 'Wallet' ? o.wallet - price : o.wallet, points: o.points + Math.round(price / 10), streak: o.streak + 1,
      rides: [{ id: Date.now() + '', from: pick.name, to: drop.name, price, veh: veh.name, status: 'Completed', driver: driver.name }, ...o.rides],
    }));
    setStep('done');
  };
  const sos = () => Alert.alert('🚨 SOS sent', 'Location + driver details aapke contacts aur 112 ko bhej di gayi (demo).', [{ text: 'Call 112', onPress: () => Linking.openURL('tel:112') }, { text: 'OK' }]);

  if (step === 'bids') return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={st.h}>Driver offers (aap ka bhav ₹{offer})</Text>
      {drivers.length === 0 && <Text>Drivers dhundh rahe hain...</Text>}
      {drivers.map((d) => (
        <View key={d.id} style={st.card}>
          <View style={st.row}><Text style={{ fontWeight: '700' }}>{d.name} ⭐{d.rating}</Text><Text style={{ fontSize: 18, fontWeight: '800' }}>₹{d.price}</Text></View>
          <Text>{d.plate} • {d.trips} trips • {d.eta} min door</Text>
          <Text style={{ color: C.green }}>✔ Verified ✔ Helmet+hygiene kit</Text>
          <Btn t={t.accept} onPress={() => accept(d)} />
        </View>))}
      <Btn t="Cancel (free, no penalty)" color="#777" onPress={() => { clearInterval(timer.current); setStep('form'); }} />
    </ScrollView>);

  if (step === 'ride') return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={st.h}>{prog < 100 ? 'Driver aa raha hai / ride chal rahi hai' : 'Pahunch gaye! 🎉'}</Text>
      <View style={st.card}>
        <Text style={{ fontWeight: '700' }}>{driver.name} • {driver.plate}</Text>
        <Text>Ride OTP: <Text style={{ fontWeight: '800', fontSize: 20 }}>{otp}</Text></Text>
        <View style={{ height: 14, backgroundColor: '#eee', borderRadius: 7, marginTop: 10 }}>
          <View style={{ width: prog + '%', height: 14, backgroundColor: C.main, borderRadius: 7 }} /></View>
        <Text style={{ marginTop: 6 }}>{pick.name} → {drop.name}</Text>
        <Text>Fare ₹{driver.price} • Free wait 5 min</Text>
      </View>
      <Btn t="🚨 SOS" color={C.red} onPress={sos} />
      <Btn t="Share live trip with contacts" color={C.accent} onPress={() => Alert.alert('Shared', `Link bheja: ${app.contacts.map((c) => c.name).join(', ')}`)} />
      <Btn t="Ride complete karo" onPress={finish} />
    </ScrollView>);

  if (step === 'done') return (
    <View style={{ padding: 16 }}>
      <Text style={st.h}>Ride complete ✅</Text>
      <Text>Aapne {Math.round(driver.price / 10)} reward points kamaye. Streak: {app.streak} 🔥</Text>
      <Text style={{ marginVertical: 10 }}>Rating do:</Text>
      <View style={{ flexDirection: 'row' }}>{[1, 2, 3, 4, 5].map((i) => <Chip key={i} t={'⭐' + i} onPress={() => { Alert.alert('Thanks!'); setStep('form'); }} />)}</View>
    </View>);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={st.h}>{t.pickup}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{PLACES.map((p) => <Chip key={p.name} t={p.name} on={pick.name === p.name} onPress={() => setPick(p)} />)}</View>
      <Text style={st.h}>{t.drop}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{PLACES.map((p) => <Chip key={p.name} t={p.name} on={drop.name === p.name} onPress={() => setDrop(p)} />)}</View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {VEHICLES.map((v) => <Chip key={v.id} t={`${v.icon} ${v.name} ₹${fare(v, dist)}`} on={veh.id === v.id} onPress={() => setVeh(v)} />)}</View>
      <View style={st.card}>
        <Text>Distance ~{dist.toFixed(1)} km • ETA {veh.eta} min</Text>
        <Text style={st.h}>{t.yourPrice}: ₹{offer}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Btn t="−5" style={{ flex: 1, marginRight: 6 }} onPress={() => setOffer(Math.max(10, offer - 5))} />
          <Btn t="+5" style={{ flex: 1 }} onPress={() => setOffer(offer + 5)} /></View>
        <Text style={{ color: '#666' }}>Fixed fare, no surge. Aap bhav khud tay karo.</Text>
      </View>
      <View style={[st.row, { marginVertical: 6 }]}><Text>{t.women}</Text><Switch value={women} onValueChange={setWomen} /></View>
      <Text>{t.sched}:</Text>
      <View style={{ flexDirection: 'row' }}>{[0, 15, 30, 60].map((m) => <Chip key={m} t={m ? m + ' min' : 'Now'} on={later === m} onPress={() => setLater(m)} />)}</View>
      <Text>Payment:</Text>
      <View style={{ flexDirection: 'row' }}>{['Cash', 'UPI', 'Wallet'].map((p) => <Chip key={p} t={p} on={pay === p} onPress={() => setPay(p)} />)}</View>
      <Btn t={t.find} onPress={find} />
    </ScrollView>);
}
