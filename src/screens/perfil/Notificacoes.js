import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useMarcarComoLida, useNotificacoes } from '../../hooks/useNotificacoes';
import useThemedStyles from '../../hooks/useThemedStyles';
import { formatarDataHora, tempoRelativo } from '../../utils/dateUtils';

function separarTipo(mensagem) {
  const m = /^\[([^\]]+)\]\s*(.*)$/s.exec(mensagem ?? '');
  return m ? { tipo: m[1], texto: m[2] } : { tipo: null, texto: mensagem };
}

function iconeDoTipo(tipo) {
  const t = (tipo ?? '').toLowerCase();
  if (t.includes('meta')) return 'flag';
  if (t.includes('prazo')) return 'alert-triangle';
  if (t.includes('resposta')) return 'briefcase';
  if (t.includes('conclu')) return 'award';
  return 'bell';
}

export default function Notificacoes({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: notificacoes, isLoading, isError, error, refetch, isRefetching } = useNotificacoes();
  const marcar = useMarcarComoLida();

  const abrir = (n) => {
    if (!n.lida) marcar.mutate(n.id);
    if (n.propostaId) navigation.navigate('PropostaDetalhe', { id: n.propostaId });
  };

  const renderConteudo = () => {
    if (isLoading) return <LoadingOverlay mensagem="Carregando notificações..." />;
    if (isError) return <ErrorState error={error} onRetry={refetch} />;
    return (
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />
        }
        renderItem={({ item }) => {
          const { tipo, texto } = separarTipo(item.mensagem);
          return (
            <TouchableOpacity
              style={[styles.item, !item.lida && styles.naoLida]}
              onPress={() => abrir(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.lida ? '' : 'Não lida. '}${item.mensagem}`}
            >
              <View style={styles.icone}>
                <Feather name={iconeDoTipo(tipo)} size={18} color={COLORS.primary} />
              </View>
              <View style={styles.corpo}>
                {!!tipo && <Text style={styles.tipo}>{tipo}</Text>}
                <Text style={styles.texto}>{texto}</Text>
                <Text style={styles.data} accessibilityLabel={formatarDataHora(item.criadaEm)}>
                  {tempoRelativo(item.criadaEm)}
                </Text>
              </View>
              {!item.lida && <View style={styles.ponto} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="bell"
            title="Nenhuma notificação"
            message="Você será avisado quando uma proposta sua bater a meta ou receber resposta da prefeitura."
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Notificações" onBack={() => navigation.goBack()} />
      {renderConteudo()}
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    lista: { padding: SPACING.lg, gap: SPACING.sm, paddingBottom: SPACING.xxl },
    item: {
      flexDirection: 'row',
      gap: SPACING.md,
      alignItems: 'flex-start',
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    naoLida: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
    icone: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    corpo: { flex: 1, gap: 2 },
    tipo: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs, color: COLORS.primary },
    texto: {
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textPrimary,
      lineHeight: 19,
    },
    data: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
    ponto: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.secondary, marginTop: 4 },
  });
