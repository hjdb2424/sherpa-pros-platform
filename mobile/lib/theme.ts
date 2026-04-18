import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#00a9e0',
  primaryLight: '#e0f7ff',
  primaryDark: '#0ea5e9',
  accent: '#ff4500',
  accentLight: '#fff0eb',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  background: '#ffffff',
  surface: '#ffffff',
  surfaceSecondary: '#f8fafc',
  text: '#18181b',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  textInverse: '#ffffff',
  border: 'rgba(0, 169, 224, 0.2)',
  borderLight: '#f4f4f5',
  borderMedium: '#e4e4e7',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryGlow: {
    shadowColor: '#00a9e0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});

export const typography = StyleSheet.create({
  heroDisplay: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  heading: { fontSize: 24, fontWeight: '700' },
  subheading: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' },
  badge: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
});
