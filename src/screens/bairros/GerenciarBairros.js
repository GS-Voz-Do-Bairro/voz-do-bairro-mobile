import React from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useBairros, useRemoverBairro } from '../../hooks/useBairros';
import useThemedStyles from '../../hooks/useThemedStyles';
import { mensagemDeErro } from '../../utils/apiError';

export default function GerenciarBairros({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: bairros, isLoading, isError, error, refetch, isRefetching } = useBairros();
  const remover = useRemoverBairro();

  const handleExcluir = (bairro) => {
    Alert.alert('Excluir bairro', `Excluir o bairro ${bairro.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          remover.mutate(bairro.id, {
            onError: (e) =>
              Alert.alert(
                'Não foi possível excluir',
                e.response?.status === 409
                  ? 'O bairro tem propostas ou moradores cadastrados e não pode ser excluído.'
                  : mensagemDeErro(e),
              ),
          }),
      },
    ]);
  };

  const renderConteudo = () => {
    if (isLoading) return <LoadingOverlay mensagem="Carregando bairros..." />;
    if (isError) return <ErrorState error={error} onRetry={refetch} />;
    return (
      <FlatList
        data={bairros}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.icone}>
              <Feather name="map-pin" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.corpo}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.detalhe}>
                {item.subprefeitura} · {item.cidade}
              </Text>
              <Text style={styles.meta}>Meta de apoios: {item.metaApoiosPadrao}</Text>
            </View>
            <TouchableOpacity
              style={styles.acao}
              onPress={() => navigation.navigate('BairroForm', { id: item.id })}
              accessibilityLabel={`Editar ${item.nome}`}
            >
              <Feather name="edit-2" size={17} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acao}
              onPress={() => handleExcluir(item)}
              accessibilityLabel={`Excluir ${item.nome}`}
            >
              <Feather name="trash-2" size={17} color={COLORS.critical} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="map" title="Nenhum bairro cadastrado" />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header
        title="Bairros"
        onBack={() => navigation.goBack()}
        rightIcon="plus"
        rightLabel="Novo bairro"
        onRightPress={() => navigation.navigate('BairroForm')}
      />
      {renderConteudo()}
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    lista: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      ...SHADOW.card,
    },
    icone: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    corpo: { flex: 1 },
    nome: { fontFamily: FONTS.subtitle, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
    detalhe: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    meta: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
    acao: { padding: 6 },
  });
