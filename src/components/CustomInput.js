import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function CustomInput({
  label,
  icon,
  error,
  style,
  maxLength,
  multiline,
  value,
  right,
  ...props
}) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.wrapper, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, multiline && styles.multiline, !!error && styles.inputError]}>
        {!!icon && <Feather name={icon} size={18} color={COLORS.textSecondary} style={styles.icon} />}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={COLORS.textMuted}
          multiline={multiline}
          maxLength={maxLength}
          value={value}
          accessibilityLabel={label}
          {...props}
        />
        {right}
      </View>
      <View style={styles.footer}>
        <Text style={styles.errorText}>{error || ''}</Text>
        {!!maxLength && (
          <Text style={styles.counter}>
            {(value ?? '').length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      marginBottom: SPACING.sm,
    },
    label: {
      color: COLORS.textSecondary,
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.sm,
      marginBottom: SPACING.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.lg,
      minHeight: 52,
    },
    multiline: {
      alignItems: 'flex-start',
      paddingVertical: SPACING.md,
    },
    inputError: {
      borderColor: COLORS.critical,
    },
    icon: {
      marginRight: SPACING.sm,
    },
    input: {
      flex: 1,
      color: COLORS.textPrimary,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.md,
      minHeight: 50,
    },
    inputMultiline: {
      minHeight: 110,
      textAlignVertical: 'top',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minHeight: 18,
      marginTop: 2,
    },
    errorText: {
      flex: 1,
      color: COLORS.critical,
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.xs,
    },
    counter: {
      color: COLORS.textMuted,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.xs,
    },
  });
