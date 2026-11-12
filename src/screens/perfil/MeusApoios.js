import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import BarraApoios from '../../components/BarraApoios';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useMeusApoios } from '../../hooks/useApoio';
import useThemedStyles from '../../hooks/useThemedStyles';
import { tempoRelativo } from '../../utils/dateUtils';

export default function MeusApoios({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: apoios, isLoading, isError, error, refetch, isRefetching } = useMeusApoios();

  const renderConteudo = () => {
    if (isLoading) return <LoadingOverlay mensagem="Carregando seus apoios..." />;
    if (isError) return <ErrorState error={error} onRetry={refetch} />;
    return (
      <FlatList
        data={apoios}
        keyExtractor={(item) => String(item.propostaId)}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PropostaDetalhe', { id: item.propostaId })}
            accessibilityRole="button"
            accessibilityLabel={`Proposta apoiada: ${item.titulo}`}
          >
            <View style={styles.topo}>
              <StatusBadge status={item.status} />
              <Text style={styles.data}>apoiada {tempoRelativo(item.apoiadoEm)}</Text>
            </View>
            <Text style={styles.titulo} numberOfLines={2}>
              {item.titulo}
            </Text>
            <BarraApoios total={item.totalApoios} meta={item.metaApoios} compacta />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="thumbs-up"
            title="Você ainda não apoiou nenhuma proposta"
            message="Veja as propostas do seu bairro e apoie as que você acha importantes."
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Meus apoios" onBack={() => navigation.goBack()} />
      {renderConteudo()}
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    lista: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      gap: SPACING.sm,
      ...SHADOW.card,
    },
    topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    data: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
    titulo: { fontFamily: FONTS.subtitle, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  });
