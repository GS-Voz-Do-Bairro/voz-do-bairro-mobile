import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS, SHADOW, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function StatCard({ icon, label, value, color }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const tint = color || COLORS.primary;
  return (
    <View style={styles.card} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={[styles.iconWrapper, { backgroundColor: tint + '22' }]}>
        <Feather name={icon} size={18} color={tint} />
      </View>
      <Text style={[styles.value, { color: tint }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      ...SHADOW.card,
    },
    iconWrapper: {
      width: 34,
      height: 34,
      borderRadius: RADIUS.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
    },
    value: { fontFamily: FONTS.title, fontSize: FONTS.sizes.xxl },
    label: { color: COLORS.textSecondary, fontFamily: FONTS.semibold, fontSize: FONTS.sizes.xs },
  });
