import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { FONTS, SPACING } from '../constants/theme';
import useThemedStyles from '../hooks/useThemedStyles';

export default function Header({ title, subtitle, onBack, rightIcon, onRightPress, rightLabel }) {
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {onBack ? (
          <TouchableOpacity style={styles.iconButton} onPress={onBack} accessibilityLabel="Voltar">
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress} accessibilityLabel={rightLabel}>
            <Feather name={rightIcon} size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: COLORS.header,
    },
    container: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
    },
    titleWrapper: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: SPACING.sm,
    },
    title: {
      color: '#FFFFFF',
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.lg,
    },
    subtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.xs,
    },
    iconButton: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    iconPlaceholder: {
      width: 38,
    },
  });
