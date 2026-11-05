import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import { FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function EmptyState({ icon = 'inbox', title, message, ilustracao, actionLabel, onAction }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      {ilustracao ? (
        <Image
          source={require('../../assets/images/bairro.png')}
          style={styles.ilustracao}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.iconWrapper}>
          <Feather name={icon} size={30} color={COLORS.primary} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!actionLabel && !!onAction && <PrimaryButton label={actionLabel} onPress={onAction} small />}
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: SPACING.xl,
      gap: SPACING.md,
    },
    ilustracao: { width: 240, height: 120 },
    iconWrapper: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: COLORS.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: COLORS.textPrimary,
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.md,
      textAlign: 'center',
    },
    message: {
      color: COLORS.textSecondary,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
