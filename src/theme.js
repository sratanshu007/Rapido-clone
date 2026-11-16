export const Colors = {
  deepIndigo: '#24105C',
  electricPurple: '#713CF5',
  softViolet: '#A78BFA',
  lightLavender: '#EEE8FF',
  cloudWhite: '#F7F7FC',
  pureWhite: '#FFFFFF',
  darkNavy: '#171725',
  successGreen: '#17B890',
  warningAmber: '#FFB547',
  dangerRed: '#F05252',
  mutedText: '#6E7191',
  border: '#E4DFFA',
  cardBg: '#FFFFFF',
  overlay: 'rgba(36, 16, 92, 0.45)',
  radarBg: '#180B3B',
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 9999,
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '800', color: Colors.darkNavy },
  h2: { fontSize: 22, fontWeight: '700', color: Colors.darkNavy },
  h3: { fontSize: 18, fontWeight: '700', color: Colors.darkNavy },
  body: { fontSize: 15, fontWeight: '400', color: Colors.darkNavy },
  bodyBold: { fontSize: 15, fontWeight: '600', color: Colors.darkNavy },
  caption: { fontSize: 12, fontWeight: '500', color: Colors.mutedText },
};

export const Shadows = {
  sm: {
    shadowColor: Colors.deepIndigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.electricPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: Colors.electricPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
};
