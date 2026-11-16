import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors, Radius, Shadows } from './theme';
import { useApp } from './Store';
import { Card, PrimaryButton, SecondaryButton, Badge, Header, SimulatedMap } from './ui';

export function CaptainDashboardView() {
  const {
    captainOnline,
    setCaptainOnline,
    captainTodayEarnings,
    captainTripsCount,
    setAppMode,
    captainTripStatus,
    setCaptainTripStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'earnings' | 'performance'
  const [enteredOtp, setEnteredOtp] = useState('');

  const incomingRequest = {
    fare: 234,
    distance: '5.2 km • 15 min',
    pickup: 'MG Road, Delhi',
    destination: 'Connaught Place, Delhi',
    customerName: 'Aman Sharma',
    service: 'Ride Prime',
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.cloudWhite }}>
      {/* Captain Top Header */}
      <View style={st.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={st.avatar}>
            <Text style={{ fontSize: 24 }}>👨🏽‍✈️</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={st.subTitle}>Good Morning,</Text>
            <Text style={st.captainTitle}>Rohit! (Captain)</Text>
          </View>
        </View>

        {/* Go Online / Offline Toggle Pill */}
        <TouchableOpacity
          style={[st.onlineToggle, captainOnline ? st.onlineToggleActive : st.onlineToggleOffline]}
          onPress={() => setCaptainOnline(!captainOnline)}
        >
          <View style={[st.onlineDot, { backgroundColor: captainOnline ? Colors.successGreen : Colors.dangerRed }]} />
          <Text style={[st.onlineText, { color: captainOnline ? Colors.successGreen : Colors.dangerRed }]}>
            {captainOnline ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Switch Back to Customer Mode Pill */}
        <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
          <TouchableOpacity
            style={st.customerModeBanner}
            onPress={() => setAppMode('customer')}
          >
            <Text style={{ color: Colors.deepIndigo, fontSize: 13, fontWeight: '700' }}>
              👤 Switch back to Customer App
            </Text>
            <Text style={{ color: Colors.electricPurple, fontWeight: '700' }}>Switch ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Today's KPI Cards */}
        <View style={st.kpiRow}>
          <Card style={st.kpiCard}>
            <Text style={st.kpiLabel}>Today's Earnings</Text>
            <Text style={st.kpiValue}>₹{captainTodayEarnings.toLocaleString('en-IN')}</Text>
            <Text style={st.kpiTrend}>+12% vs yesterday</Text>
          </Card>
          <Card style={st.kpiCard}>
            <Text style={st.kpiLabel}>Trips Completed</Text>
            <Text style={st.kpiValue}>{captainTripsCount}</Text>
            <Text style={st.kpiTrend}>Rating: 4.93 ⭐</Text>
          </Card>
        </View>

        {/* Live Status Card or Incoming Ride */}
        {captainTripStatus === 'incoming' ? (
          <Card style={st.requestCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge text="NEW RIDE REQUEST" color={Colors.pureWhite} bg={Colors.electricPurple} />
              <Text style={{ fontSize: 13, color: Colors.dangerRed, fontWeight: '800' }}>Expires in 18s ⏱️</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <View>
                <Text style={{ fontSize: 28, fontWeight: '900', color: Colors.darkNavy }}>₹{incomingRequest.fare}</Text>
                <Text style={{ fontSize: 12, color: Colors.mutedText }}>{incomingRequest.distance}</Text>
              </View>
              <Badge text={incomingRequest.service} color={Colors.deepIndigo} bg={Colors.lightLavender} />
            </View>

            <View style={st.locDivider} />

            <View style={st.routePreviewRow}>
              <View style={[st.locDot, { backgroundColor: Colors.successGreen }]} />
              <Text style={st.routePreviewText}>{incomingRequest.pickup}</Text>
            </View>
            <View style={[st.routePreviewRow, { marginTop: 6 }]}>
              <View style={[st.locDot, { backgroundColor: Colors.electricPurple }]} />
              <Text style={st.routePreviewText}>{incomingRequest.destination}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <SecondaryButton
                title="Reject"
                color={Colors.dangerRed}
                style={{ flex: 1, marginRight: 8 }}
                onPress={() => setCaptainTripStatus('idle')}
              />
              <PrimaryButton
                title="Accept Ride"
                style={{ flex: 2 }}
                onPress={() => setCaptainTripStatus('in_trip')}
              />
            </View>
          </Card>
        ) : captainTripStatus === 'in_trip' ? (
          <Card style={{ marginHorizontal: 16, marginTop: 12 }}>
            <SimulatedMap showRoute={true} driverName="You (Rohit)" etaText="Arrived at Pickup" />
            <Text style={[st.sectionTitle, { marginTop: 12 }]}>Customer: Aman Sharma</Text>
            <Text style={{ fontSize: 13, color: Colors.mutedText }}>Pickup: MG Road, Delhi → Drop: Connaught Place</Text>

            <View style={st.locDivider} />

            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.deepIndigo, marginBottom: 4 }}>
              ENTER 4-DIGIT START OTP:
            </Text>
            <TextInput
              style={st.otpInput}
              keyboardType="number-pad"
              placeholder="e.g. 4821"
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              maxLength={4}
            />

            <PrimaryButton
              title="Start Customer Ride"
              style={{ marginTop: 8 }}
              onPress={() => {
                Alert.alert('Trip Started', 'Ride navigation in progress. Safe driving!');
              }}
            />

            <SecondaryButton
              title="End / Complete Trip (Collect ₹234)"
              color={Colors.successGreen}
              style={{ marginTop: 6 }}
              onPress={() => {
                Alert.alert('Trip Completed 🎉', '₹234 credited to your Captain wallet.');
                setCaptainTripStatus('idle');
              }}
            />
          </Card>
        ) : (
          <View style={{ marginHorizontal: 16, marginTop: 12 }}>
            <SimulatedMap driverName="You (Rohit)" etaText="Online & Waiting" />
            <Card style={{ marginTop: 14 }}>
              <Text style={st.sectionTitle}>Ready to Accept Rides</Text>
              <Text style={{ fontSize: 13, color: Colors.mutedText, marginTop: 2 }}>
                High demand near CP and Cyber Hub. Guaranteed surge multiplier 1.2x.
              </Text>
              <PrimaryButton
                title="Simulate Incoming Ride Request →"
                style={{ marginTop: 14 }}
                onPress={() => setCaptainTripStatus('incoming')}
              />
            </Card>
          </View>
        )}

        {/* Weekly Performance Bar Chart */}
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <Card>
            <Text style={st.sectionTitle}>Weekly Earnings Summary</Text>
            <Text style={{ fontSize: 12, color: Colors.mutedText, marginBottom: 12 }}>Total this week: ₹11,600</Text>

            <View style={st.barChartRow}>
              {[
                { day: 'M', h: 50 },
                { day: 'T', h: 65 },
                { day: 'W', h: 75 },
                { day: 'T', h: 85 },
                { day: 'F', h: 60 },
                { day: 'S', h: 100 },
                { day: 'S', h: 80 },
              ].map((item, idx) => (
                <View key={idx} style={{ alignItems: 'center', flex: 1 }}>
                  <View style={[st.barFill, { height: item.h, backgroundColor: item.day === 'S' ? Colors.electricPurple : Colors.softViolet }]} />
                  <Text style={{ fontSize: 11, color: Colors.mutedText, marginTop: 6 }}>{item.day}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDFD',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightLavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: { fontSize: 12, color: Colors.mutedText },
  captainTitle: { fontSize: 17, fontWeight: '800', color: Colors.darkNavy },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  onlineToggleActive: { backgroundColor: '#EBF9F3', borderColor: Colors.successGreen },
  onlineToggleOffline: { backgroundColor: '#FDECEC', borderColor: Colors.dangerRed },
  onlineDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  onlineText: { fontSize: 13, fontWeight: '800' },
  customerModeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightLavender,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
    marginTop: 10,
  },
  kpiRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12 },
  kpiCard: { flex: 1, marginRight: 8, padding: 14 },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: Colors.mutedText },
  kpiValue: { fontSize: 22, fontWeight: '900', color: Colors.deepIndigo, marginVertical: 4 },
  kpiTrend: { fontSize: 11, fontWeight: '600', color: Colors.successGreen },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.darkNavy },
  requestCard: { marginHorizontal: 16, marginTop: 14, borderWidth: 2, borderColor: Colors.electricPurple, ...Shadows.glow },
  locDivider: { height: 1, backgroundColor: '#F0EDFD', marginVertical: 10 },
  routePreviewRow: { flexDirection: 'row', alignItems: 'center' },
  locDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  routePreviewText: { fontSize: 14, fontWeight: '700', color: Colors.darkNavy },
  otpInput: {
    backgroundColor: '#F3F0FC',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.darkNavy,
    textAlign: 'center',
    letterSpacing: 4,
    marginVertical: 6,
  },
  barChartRow: { flexDirection: 'row', alignItems: 'flex-end', height: 110, paddingTop: 10 },
  barFill: { width: 22, borderRadius: 6 },
});
