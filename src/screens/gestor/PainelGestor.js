import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';
import PropostaCard from '../../components/PropostaCard';
import FiltroChips from '../../components/FiltroChips';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDemandas } from '../../hooks/useDemandas';
import useThemedStyles from '../../hooks/useThemedStyles';
import { diasAte } from '../../utils/dateUtils';

const FILTROS = [
  { valor: 'PENDENTES', label: 'Pendentes', icon: 'inbox' },
  { valor: 'ATRASADA', label: 'Atrasadas', icon: 'alert-triangle' },
  { valor: 'SEMANA', label: 'Vencem em 7 dias', icon: 'clock' },
];

export default function PainelGestor({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState('PENDENTES');

  const {
    data: demandas = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDemandas({
    bairroId: usuario?.bairroId,
  });

  const atrasadas = demandas.filter((d) => d.status === 'ATRASADA');
  const venceSemana = demandas.filter((d) => {
    const dias = diasAte(d.prazoResposta);
    return d.status === 'DEMANDA' && dias !== null && dias >= 0 && dias <= 7;
  });
  const lista = filtro === 'ATRASADA' ? atrasadas : filtro === 'SEMANA' ? venceSemana : demandas;

  if (isLoading) return <LoadingOverlay mensagem="Carregando demandas..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Painel do gestor" subtitle={usuario?.bairroNome} />
      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />
          }
          ListHeaderComponent={
            <View style={styles.cabecalho}>
              <Text style={styles.saudacao}>Olá, {usuario?.nome?.split(' ')[0]}</Text>
              <Text style={styles.texto}>
                Estas demandas atingiram a meta de apoios e aguardam a resposta da prefeitura.
              </Text>
              <View style={styles.grade}>
                <StatCard icon="inbox" label="Pendentes" value={demandas.length} color={COLORS.primary} />
                <StatCard
                  icon="alert-triangle"
                  label="Atrasadas"
                  value={atrasadas.length}
                  color={COLORS.critical}
                />
                <StatCard
                  icon="clock"
                  label="Vencem em 7 dias"
                  value={venceSemana.length}
                  color={COLORS.warning}
                />
              </View>
              <FiltroChips
                opcoes={FILTROS}
                selecionado={filtro}
                onSelecionar={setFiltro}
                style={styles.chips}
              />
            </View>
          }
          renderItem={({ item }) => (
            <PropostaCard
              proposta={item}
              mostrarPrazo
              onPress={() => navigation.navigate('PropostaDetalhe', { id: item.id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="check-circle"
              title="Nenhuma demanda aqui"
              message="Todas as demandas deste filtro foram respondidas."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    lista: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
    cabecalho: { gap: SPACING.md, marginBottom: SPACING.md },
    saudacao: { fontFamily: FONTS.title, fontSize: FONTS.sizes.xl, color: COLORS.textPrimary },
    texto: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      lineHeight: 19,
    },
    grade: { flexDirection: 'row', gap: SPACING.sm },
    chips: { paddingHorizontal: 0 },
  });
