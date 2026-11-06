import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import CategoriaTag from './CategoriaTag';
import BarraApoios from './BarraApoios';
import { FONTS, RADIUS, SHADOW, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { tempoRelativo, textoPrazo, diasAte } from '../utils/dateUtils';

export default function PropostaCard({ proposta, onPress, mostrarPrazo = false }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const prazoVencido = diasAte(proposta.prazoResposta) < 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Proposta: ${proposta.titulo}`}
    >
      <View style={styles.topo}>
        <CategoriaTag categoria={proposta.categoria} />
        <StatusBadge status={proposta.status} />
      </View>

      <Text style={styles.titulo} numberOfLines={2}>
        {proposta.titulo}
      </Text>
      <Text style={styles.resumo} numberOfLines={2}>
        {proposta.resumoIa || proposta.descricao}
      </Text>

      {proposta.status === 'ABERTA' ? (
        <BarraApoios total={proposta.totalApoios} meta={proposta.metaApoios} compacta />
      ) : (
        mostrarPrazo &&
        !!proposta.prazoResposta && (
          <View style={styles.prazo}>
            <Feather name="clock" size={13} color={prazoVencido ? COLORS.critical : COLORS.warning} />
            <Text style={[styles.prazoTexto, { color: prazoVencido ? COLORS.critical : COLORS.warning }]}>
              {textoPrazo(proposta.prazoResposta)}
            </Text>
          </View>
        )
      )}

      <View style={styles.rodape}>
        <View style={styles.info}>
          <Feather name="thumbs-up" size={13} color={COLORS.textMuted} />
          <Text style={styles.infoTexto}>{proposta.totalApoios}</Text>
          <Feather name="message-square" size={13} color={COLORS.textMuted} style={styles.espaco} />
          <Text style={styles.infoTexto}>{proposta.totalComentarios}</Text>
          {proposta.origem === 'AUDIO' && (
            <Feather name="mic" size={13} color={COLORS.textMuted} style={styles.espaco} />
          )}
        </View>
        <Text style={styles.infoTexto}>
          {proposta.autorNome ? `${proposta.autorNome.split(' ')[0]} · ` : ''}
          {tempoRelativo(proposta.criadaEm)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      gap: SPACING.sm,
      ...SHADOW.card,
    },
    topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    titulo: {
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.md,
      color: COLORS.textPrimary,
      lineHeight: 22,
    },
    resumo: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      lineHeight: 19,
    },
    prazo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    prazoTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs },
    rodape: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.xs,
    },
    info: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    espaco: { marginLeft: 8 },
    infoTexto: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  });
