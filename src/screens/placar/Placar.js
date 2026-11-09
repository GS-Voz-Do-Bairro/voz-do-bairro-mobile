import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import FiltroChips from '../../components/FiltroChips';
import LoadingOverlay from '../../components/LoadingOverlay';
import ErrorState from '../../components/ErrorState';
import { FONTS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBairros } from '../../hooks/useBairros';
import { usePlacarDoBairro, usePlacarGeral } from '../../hooks/usePlacar';
import useThemedStyles from '../../hooks/useThemedStyles';

function percentual(placar) {
  return placar?.percentualNoPrazo == null ? null : Math.round(placar.percentualNoPrazo);
}

export default function Placar() {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { usuario } = useAuth();
  const { data: bairros = [] } = useBairros();

  const [escolhido, setEscolhido] = useState(null);
  const bairroId = escolhido ?? usuario?.bairroId ?? bairros[0]?.id;

  const doBairro = usePlacarDoBairro(bairroId);
  const geral = usePlacarGeral();

  const atualizar = () => {
    doBairro.refetch();
    geral.refetch();
  };

  const placar = doBairro.data;
  const pct = percentual(placar);
  const ranking = [...(geral.data ?? [])].sort((a, b) => (percentual(b) ?? -1) - (percentual(a) ?? -1));
  const opcoesBairro = bairros.map((b) => ({ valor: b.id, label: b.nome, icon: 'map-pin' }));

  const renderConteudo = () => {
    if (!bairroId || doBairro.isLoading) return <LoadingOverlay mensagem="Montando o placar..." />;
    if (doBairro.isError) return <ErrorState error={doBairro.error} onRetry={doBairro.refetch} />;
    return (
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
          <Text style={styles.destaqueRotulo}>Demandas respondidas no prazo</Text>
          <Text style={styles.destaqueValor}>{pct == null ? '—' : `${pct}%`}</Text>
          <View style={styles.trilho}>
            <View style={[styles.preenchido, { width: `${pct ?? 0}%` }]} />
          </View>
          <Text style={styles.destaqueNota}>
            {pct == null
              ? 'Ainda não há demandas com prazo neste bairro.'
              : `${placar.respondidasNoPrazo} no prazo · ${placar.respondidas} respondidas · ${placar.vencidasSemResposta} vencidas sem resposta`}
          </Text>
        </View>

        <View style={styles.grade}>
          <StatCard icon="award" label="Concluídas" value={placar.concluidas} color={COLORS.success} />
          <StatCard icon="tool" label="Em execução" value={placar.emExecucao} color={COLORS.primary} />
        </View>
        <View style={styles.grade}>
          <StatCard
            icon="alert-triangle"
            label="Atrasadas"
            value={placar.atrasadas}
            color={COLORS.critical}
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
            Uma proposta vira demanda quando atinge a meta de apoios. A partir daí a prefeitura tem 15 dias
            para responder. Quem não responde a tempo aparece como atrasada.
          </Text>
        </View>

        {ranking.length > 1 && (
          <>
            <Text style={styles.secao}>Comparativo entre bairros</Text>
            <View style={styles.card}>
              {ranking.map((b, i) => {
                const atual = b.bairroId === bairroId;
                const p = percentual(b);
                return (
                  <View key={b.bairroId} style={[styles.linha, i > 0 && styles.linhaBorda]}>
                    <Text style={styles.posicao}>{i + 1}º</Text>
                    <View style={styles.flex}>
                      <Text style={[styles.bairro, atual && { color: COLORS.primary }]}>{b.bairroNome}</Text>
                      <View style={styles.trilhoMenor}>
                        <View style={[styles.preenchidoMenor, { width: `${p ?? 0}%` }]} />
                      </View>
                      <Text style={styles.detalhe}>
                        {b.concluidas + b.emExecucao} atendidas · {b.atrasadas} atrasadas · {b.total}{' '}
                        propostas
                      </Text>
                    </View>
                    <Text style={styles.percentual}>{p == null ? '—' : `${p}%`}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Placar do bairro" subtitle={placar?.bairroNome || usuario?.bairroNome} />
      {opcoesBairro.length > 1 && (
        <View>
          <FiltroChips
            opcoes={opcoesBairro}
            selecionado={bairroId}
            onSelecionar={setEscolhido}
            style={styles.chips}
          />
        </View>
      )}
      <View style={styles.flex}>{renderConteudo()}</View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    chips: { paddingVertical: SPACING.md },
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
