import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS, RADIUS } from '../constants/theme';
import useThemedStyles from '../hooks/useThemedStyles';

export default function BarraApoios({ total, meta, compacta = false }) {
  const styles = useThemedStyles(createStyles);
  const progresso = meta > 0 ? Math.min(total / meta, 1) : 1;
  const atingida = meta > 0 && total >= meta;

  return (
    <View>
      <View style={[styles.trilho, compacta && styles.trilhoCompacto]}>
        <View style={[styles.preenchido, atingida && styles.atingida, { width: `${progresso * 100}%` }]} />
      </View>
      <Text style={styles.legenda}>
        <Text style={styles.numero}>{total}</Text>
        {meta > 0 ? ` de ${meta} apoios${atingida ? ' · meta atingida' : ''}` : ' apoios'}
      </Text>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    trilho: {
      height: 10,
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.surfaceAlt,
      overflow: 'hidden',
    },
    trilhoCompacto: { height: 6 },
    preenchido: {
      height: '100%',
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.secondary,
    },
    atingida: { backgroundColor: COLORS.success },
    legenda: {
      marginTop: 6,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.xs,
      color: COLORS.textSecondary,
    },
    numero: { fontFamily: FONTS.bold, color: COLORS.textPrimary },
  });
