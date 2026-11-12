export const LIGHT_COLORS = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0FB',
  header: '#3346D3',
  primary: '#3346D3',
  primaryDark: '#2333A8',
  primarySoft: '#E3E7FF',
  secondary: '#FF7A45',
  secondaryDark: '#E2602C',

  critical: '#D93F45',
  warning: '#D98A0B',
  success: '#1F9D6B',
  info: '#2F80D1',
  neutral: '#7A819C',

  textPrimary: '#1B2140',
  textSecondary: '#535A78',
  textMuted: '#8C92AD',

  border: '#DDE0EE',
  borderLight: '#EEF0F7',
  overlay: 'rgba(15, 18, 40, 0.55)',

  white: '#FFFFFF',
  onPrimary: '#FFFFFF',
};

export const DARK_COLORS = {
  background: '#0F1220',
  surface: '#181C2F',
  surfaceAlt: '#20253D',
  header: '#1C2250',
  primary: '#7B8BFF',
  primaryDark: '#5C6CE6',
  primarySoft: '#262D5A',
  secondary: '#FF9466',
  secondaryDark: '#FF7A45',

  critical: '#FF6B70',
  warning: '#F5B650',
  success: '#45C98F',
  info: '#6CB2F5',
  neutral: '#9CA2BF',

  textPrimary: '#EEF0FA',
  textSecondary: '#B3B8D2',
  textMuted: '#7E849F',

  border: '#2B3150',
  borderLight: '#20253D',
  overlay: 'rgba(0, 0, 0, 0.65)',

  white: '#FFFFFF',
  onPrimary: '#0F1220',
};

export const FONT_FILES = {
  'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
  'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
};

export const FONTS = {
  title: 'Poppins-Bold',
  subtitle: 'Poppins-SemiBold',
  regular: 'Nunito-Regular',
  semibold: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  sizes: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  full: 100,
};

export const SHADOW = {
  card: {
    shadowColor: '#1B2140',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
};
