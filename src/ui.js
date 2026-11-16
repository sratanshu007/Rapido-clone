import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radius, Shadows } from './theme';

export const Logo = ({ size = 'md', dark = false }) => {
  const isLg = size === 'lg';
  return (
    <View style={st.logoRow}>
      <View style={[st.logoBadge, isLg && st.logoBadgeLg]}>
        <Text style={[st.logoLetter, isLg && { fontSize: 24 }]}>R</Text>
      </View>
      <View>
        <Text style={[st.logoText, dark ? { color: Colors.pureWhite } : { color: Colors.deepIndigo }, isLg && { fontSize: 24 }]}>
          Ride<Text style={{ color: Colors.electricPurple }}>Nova</Text>
        </Text>
        <Text style={[st.logoTagline, dark ? { color: Colors.softViolet } : { color: Colors.mutedText }]}>
          Ride Smarter. Live Better.
        </Text>
      </View>
    </View>
  );
};

export const PrimaryButton = ({ title, onPress, icon, style, disabled, color = Colors.electricPurple }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    disabled={disabled}
    style={[
      st.primaryBtn,
      { backgroundColor: color },
      Shadows.md,
      disabled && { opacity: 0.5 },
      style,
    ]}
  >
    {icon ? <Text style={{ marginRight: 8, fontSize: 16 }}>{icon}</Text> : null}
    <Text style={st.primaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

export const SecondaryButton = ({ title, onPress, icon, style, color = Colors.electricPurple }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[st.secondaryBtn, { borderColor: color }, style]}
  >
    {icon ? <Text style={{ marginRight: 8, fontSize: 16 }}>{icon}</Text> : null}
    <Text style={[st.secondaryBtnText, { color }]}>{title}</Text>
  </TouchableOpacity>
);

export const Card = ({ children, style, active, onPress }) => {
  const content = (
    <View
      style={[
        st.card,
        Shadows.sm,
        active && { borderColor: Colors.electricPurple, borderWidth: 2, backgroundColor: Colors.lightLavender },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

export const Badge = ({ text, color = Colors.electricPurple, bg = Colors.lightLavender }) => (
  <View style={[st.badge, { backgroundColor: bg }]}>
    <Text style={[st.badgeText, { color }]}>{text}</Text>
  </View>
);

export const Header = ({ title, onBack, rightAction }) => (
  <View style={st.header}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} style={st.headerBack}>
        <Text style={{ fontSize: 18, color: Colors.deepIndigo, fontWeight: '700' }}>←</Text>
      </TouchableOpacity>
    ) : (
      <View style={{ width: 32 }} />
    )}
    <Text style={st.headerTitle}>{title}</Text>
    {rightAction || <View style={{ width: 32 }} />}
  </View>
);

export const SimulatedMap = ({ showRoute = false, driverName, etaText }) => (
  <View style={st.mapContainer}>
    {/* Map Grid Road Simulation */}
    <View style={st.mapGridH1} />
    <View style={st.mapGridH2} />
    <View style={st.mapGridV1} />
    <View style={st.mapGridV2} />
    <View style={st.mapParkArea} />

    {/* Route Polyline Simulation */}
    {showRoute && (
      <View style={st.routePathContainer}>
        <View style={st.routePolyline} />
        <View style={st.routePolylineVertical} />
      </View>
    )}

    {/* Pickup Pin */}
    <View style={[st.pinContainer, { top: 38, left: 50 }]}>
      <View style={[st.pinDot, { backgroundColor: Colors.successGreen }]} />
      <Text style={st.pinLabel}>Pickup: Connaught Place</Text>
    </View>

    {/* Drop Pin */}
    <View style={[st.pinContainer, { bottom: 42, right: 40 }]}>
      <View style={[st.pinDot, { backgroundColor: Colors.electricPurple }]} />
      <Text style={st.pinLabel}>Drop: Cyber Hub</Text>
    </View>

    {/* Moving / Live Vehicle Marker */}
    <View style={[st.carMarker, Shadows.md, { top: showRoute ? 110 : 80, left: showRoute ? 140 : 180 }]}>
      <Text style={{ fontSize: 20 }}>🚘</Text>
      {driverName ? (
        <View style={st.carTooltip}>
          <Text style={st.carTooltipText}>{driverName} • {etaText || '2 min'}</Text>
        </View>
      ) : null}
    </View>

    {/* Nearby idle vehicles */}
    <View style={[st.nearbyCar, { top: 60, right: 60 }]}><Text style={{ fontSize: 14 }}>🚗</Text></View>
    <View style={[st.nearbyCar, { bottom: 50, left: 100 }]}><Text style={{ fontSize: 14 }}>🛺</Text></View>
    <View style={[st.nearbyCar, { top: 140, right: 120 }]}><Text style={{ fontSize: 14 }}>⚡</Text></View>
  </View>
);

const st = StyleSheet.create({
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.electricPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    ...Shadows.glow,
  },
  logoBadgeLg: { width: 50, height: 50, borderRadius: 16 },
  logoLetter: { color: Colors.pureWhite, fontSize: 19, fontWeight: '900', fontStyle: 'italic' },
  logoText: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  logoTagline: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  primaryBtn: {
    height: 52,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  primaryBtnText: { color: Colors.pureWhite, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    height: 48,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 6,
    backgroundColor: Colors.pureWhite,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700' },
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE8FB',
    marginVertical: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDFD',
  },
  headerBack: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.cloudWhite, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.darkNavy },
  mapContainer: {
    height: 220,
    backgroundColor: '#EBEBF5',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#DCD6F7',
  },
  mapGridH1: { position: 'absolute', top: 70, left: 0, right: 0, height: 16, backgroundColor: '#FFFFFF' },
  mapGridH2: { position: 'absolute', top: 150, left: 0, right: 0, height: 20, backgroundColor: '#FFFFFF' },
  mapGridV1: { position: 'absolute', top: 0, bottom: 0, left: 90, width: 16, backgroundColor: '#FFFFFF' },
  mapGridV2: { position: 'absolute', top: 0, bottom: 0, left: 220, width: 22, backgroundColor: '#FFFFFF' },
  mapParkArea: { position: 'absolute', top: 10, right: 20, width: 70, height: 50, borderRadius: 8, backgroundColor: '#D8F3DC' },
  routePathContainer: { position: 'absolute', top: 50, left: 95, width: 140, height: 120 },
  routePolyline: { position: 'absolute', top: 20, left: 0, width: 130, height: 6, backgroundColor: Colors.electricPurple, borderRadius: 3 },
  routePolylineVertical: { position: 'absolute', top: 20, left: 125, width: 6, height: 80, backgroundColor: Colors.electricPurple, borderRadius: 3 },
  pinContainer: { position: 'absolute', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.pureWhite, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#D9D2F7', ...Shadows.sm },
  pinDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  pinLabel: { fontSize: 10, fontWeight: '700', color: Colors.darkNavy },
  carMarker: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.pureWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.electricPurple,
  },
  carTooltip: { position: 'absolute', top: -20, backgroundColor: Colors.darkNavy, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  carTooltipText: { color: Colors.pureWhite, fontSize: 9, fontWeight: '700' },
  nearbyCar: { position: 'absolute', opacity: 0.8 },
});
