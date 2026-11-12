import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { DECISOES, corDoTom } from '../constants/status';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { diasAte, formatarData } from '../utils/dateUtils';

export default function RespostaCard({ resposta }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const info = DECISOES[resposta.decisao] ?? DECISOES.ACEITA;
  const cor = corDoTom(info.tom, COLORS);
  const compromissoAtrasado =
    !resposta.cumprida && resposta.decisao === 'ACEITA' && diasAte(resposta.prazoExecucao) < 0;

  return (
    <View style={[styles.card, { borderLeftColor: cor }]}>
      <View style={styles.cabecalho}>
        <Feather name="briefcase" size={16} color={cor} />
        <Text style={styles.titulo}>Resposta da prefeitura</Text>
      </View>
      <Text style={[styles.decisao, { color: cor }]}>{info.resultado}</Text>
      <Text style={styles.texto}>{resposta.justificativa}</Text>

      {!!resposta.prazoExecucao && (
        <View style={styles.linha}>
          <Feather name="calendar" size={13} color={COLORS.textSecondary} />
          <Text style={styles.linhaTexto}>Prazo de execução: {formatarData(resposta.prazoExecucao)}</Text>
        </View>
      )}
      {resposta.cumprida && (
        <View style={styles.linha}>
          <Feather name="check-circle" size={13} color={COLORS.success} />
          <Text style={[styles.linhaTexto, { color: COLORS.success }]}>Compromisso cumprido</Text>
        </View>
      )}
      {compromissoAtrasado && (
        <View style={styles.linha}>
          <Feather name="alert-triangle" size={13} color={COLORS.critical} />
          <Text style={[styles.linhaTexto, { color: COLORS.critical }]}>O prazo de execução já passou</Text>
        </View>
      )}

      <Text style={styles.assinatura}>
        {resposta.gestorNome ? `${resposta.gestorNome} · ` : ''}
        {formatarData(resposta.respondidaEm)}
      </Text>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      borderLeftWidth: 4,
      padding: SPACING.lg,
      gap: SPACING.xs,
    },
    cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    titulo: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    decisao: { fontFamily: FONTS.subtitle, fontSize: FONTS.sizes.lg, marginTop: 2 },
    texto: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, lineHeight: 20 },
    linha: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    linhaTexto: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    assinatura: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.xs,
      color: COLORS.textMuted,
      marginTop: 6,
    },
  });
