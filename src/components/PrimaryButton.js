import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function PrimaryButton({
  label,
  icon,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  small = false,
  style,
}) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled || loading;
  const vazado = variant === 'outline' || variant === 'ghost';
  const corConteudo = vazado ? COLORS.primary : variant === 'primary' ? COLORS.onPrimary : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[styles.base, small && styles.small, styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={corConteudo} />
      ) : (
        <>
          {!!icon && <Feather name={icon} size={small ? 16 : 18} color={corConteudo} />}
          <Text style={[styles.label, small && styles.labelSmall, { color: corConteudo }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    base: {
      height: 52,
      paddingHorizontal: 18,
      borderRadius: RADIUS.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    small: { height: 40, paddingHorizontal: 14, gap: 6 },
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.secondary },
    danger: { backgroundColor: COLORS.critical },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    ghost: { backgroundColor: COLORS.primarySoft },
    disabled: { opacity: 0.55 },
    label: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.md,
    },
    labelSmall: { fontSize: FONTS.sizes.sm },
  });
