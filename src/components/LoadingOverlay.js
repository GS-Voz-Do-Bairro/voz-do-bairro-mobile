import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function LoadingOverlay({ mensagem = 'Carregando...' }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{mensagem}</Text>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.background,
      gap: 16,
      padding: 24,
    },
    text: {
      color: COLORS.textSecondary,
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.md,
      textAlign: 'center',
    },
  });
