import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import LoadingOverlay from '../../components/LoadingOverlay';
import ErrorState from '../../components/ErrorState';
import { FONTS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePlacarDoBairro, usePlacarGeral } from '../../hooks/usePlacar';
import useThemedStyles from '../../hooks/useThemedStyles';

function taxa(placar) {
  if (placar.taxaAtendimento) return placar.taxaAtendimento;
  const demandas = placar.atendidas + placar.atrasadas + placar.aguardando + placar.recusadas;
  return demandas ? Math.round((placar.atendidas / demandas) * 100) : 0;
}

export default function Placar() {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { usuario } = useAuth();

  const doBairro = usePlacarDoBairro(usuario?.bairroId);
  const geral = usePlacarGeral();

  const atualizar = () => {
    doBairro.refetch();
    geral.refetch();
  };

  if (doBairro.isLoading) return <LoadingOverlay mensagem="Montando o placar..." />;

  const placar = doBairro.data;
  const ranking = [...(geral.data ?? [])].sort((a, b) => taxa(b) - taxa(a));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Placar do bairro" subtitle={usuario?.bairroNome} />
      {doBairro.isError ? (
        <ErrorState error={doBairro.error} onRetry={doBairro.refetch} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={doBairro.isRefetching}
              onRefresh={atualizar}
              colors={[COLORS.primary]}
            />
          }
        >
          <View style={styles.destaque}>
            <Text style={styles.destaqueRotulo}>Demandas atendidas pela prefeitura</Text>
            <Text style={styles.destaqueValor}>{taxa(placar)}%</Text>
            <View style={styles.trilho}>
              <View style={[styles.preenchido, { width: `${taxa(placar)}%` }]} />
            </View>
            <Text style={styles.destaqueNota}>{placar.total} propostas publicadas no bairro</Text>
          </View>

          <View style={styles.grade}>
            <StatCard icon="check-circle" label="Atendidas" value={placar.atendidas} color={COLORS.success} />
            <StatCard
              icon="alert-triangle"
              label="Atrasadas"
              value={placar.atrasadas}
              color={COLORS.critical}
            />
          </View>
          <View style={styles.grade}>
            <StatCard
              icon="eye-off"
              label="Ignoradas"
              value={placar.ignoradas}
              color={COLORS.secondaryDark}
            />
            <StatCard
              icon="clock"
              label="Aguardando resposta"
              value={placar.aguardando}
              color={COLORS.warning}
            />
          </View>
          <View style={styles.grade}>
            <StatCard
              icon="users"
              label="Recebendo apoios"
              value={placar.recebendoApoios}
              color={COLORS.info}
            />
            <StatCard icon="x-circle" label="Recusadas" value={placar.recusadas} color={COLORS.neutral} />
          </View>

          <View style={styles.explicacao}>
            <Feather name="info" size={16} color={COLORS.textSecondary} />
            <Text style={styles.explicacaoTexto}>
              Uma proposta vira demanda quando atinge a meta de apoios. A partir daí a prefeitura tem prazo
              para responder. Quem não responde a tempo aparece como atrasada.
            </Text>
          </View>

          {ranking.length > 1 && (
            <>
              <Text style={styles.secao}>Comparativo entre bairros</Text>
              <View style={styles.card}>
                {ranking.map((b, i) => {
                  const atual = b.bairroId === usuario?.bairroId;
                  return (
                    <View key={b.bairroId} style={[styles.linha, i > 0 && styles.linhaBorda]}>
                      <Text style={styles.posicao}>{i + 1}º</Text>
                      <View style={styles.flex}>
                        <Text style={[styles.bairro, atual && { color: COLORS.primary }]}>
                          {b.bairroNome}
                          {atual ? ' (seu bairro)' : ''}
                        </Text>
                        <View style={styles.trilhoMenor}>
                          <View style={[styles.preenchidoMenor, { width: `${taxa(b)}%` }]} />
                        </View>
                        <Text style={styles.detalhe}>
                          {b.atendidas} atendidas · {b.atrasadas} atrasadas
                        </Text>
                      </View>
                      <Text style={styles.percentual}>{taxa(b)}%</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
    destaque: {
      backgroundColor: COLORS.header,
      borderRadius: RADIUS.lg,
      padding: SPACING.xl,
      gap: SPACING.sm,
    },
    destaqueRotulo: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.85)' },
    destaqueValor: { fontFamily: FONTS.title, fontSize: 44, color: '#FFFFFF', lineHeight: 52 },
    destaqueNota: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.8)' },
    trilho: {
      height: 10,
      borderRadius: RADIUS.full,
      backgroundColor: 'rgba(255,255,255,0.25)',
      overflow: 'hidden',
    },
    preenchido: { height: '100%', borderRadius: RADIUS.full, backgroundColor: COLORS.secondary },
    grade: { flexDirection: 'row', gap: SPACING.md },
    explicacao: {
      flexDirection: 'row',
      gap: SPACING.sm,
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
    },
    explicacaoTexto: {
      flex: 1,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      lineHeight: 19,
    },
    secao: {
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.lg,
      color: COLORS.textPrimary,
      marginTop: SPACING.sm,
    },
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      paddingHorizontal: SPACING.lg,
      ...SHADOW.card,
    },
    linha: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md },
    linhaBorda: { borderTopWidth: 1, borderTopColor: COLORS.borderLight },
    posicao: { fontFamily: FONTS.title, fontSize: FONTS.sizes.md, color: COLORS.textMuted, width: 28 },
    bairro: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
    trilhoMenor: {
      height: 6,
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.surfaceAlt,
      overflow: 'hidden',
      marginVertical: 5,
    },
    preenchidoMenor: { height: '100%', backgroundColor: COLORS.success, borderRadius: RADIUS.full },
    detalhe: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
    percentual: { fontFamily: FONTS.title, fontSize: FONTS.sizes.lg, color: COLORS.textPrimary },
  });
