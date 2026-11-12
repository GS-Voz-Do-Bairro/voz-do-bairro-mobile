import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS } from '../constants/theme';
import { corDoTom, infoStatus } from '../constants/status';
import { useTheme } from '../contexts/ThemeContext';

export default function StatusBadge({ status }) {
  const { colors } = useTheme();
  const info = infoStatus(status);
  const cor = corDoTom(info.tom, colors);
  return (
    <View style={[styles.badge, { backgroundColor: cor + '1F' }]}>
      <Feather name={info.icon} size={12} color={cor} />
      <Text style={[styles.texto, { color: cor }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  texto: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xs,
  },
});
