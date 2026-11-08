import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';
import PropostaCard from '../../components/PropostaCard';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useMinhasPropostas } from '../../hooks/usePropostas';
import useThemedStyles from '../../hooks/useThemedStyles';

export default function MinhasPropostas({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: propostas, isLoading, isError, error, refetch, isRefetching } = useMinhasPropostas();

  const renderConteudo = () => {
    if (isLoading) return <LoadingOverlay mensagem="Carregando suas propostas..." />;
    if (isError) return <ErrorState error={error} onRetry={refetch} />;
    return (
      <FlatList
        data={propostas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />
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
            ilustracao
            title="Você ainda não publicou propostas"
            message="Viu algo que precisa melhorar no bairro? Conte para os vizinhos."
            actionLabel="Nova proposta"
            onAction={() => navigation.navigate('PropostaForm')}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Minhas propostas" onBack={() => navigation.goBack()} />
      {renderConteudo()}
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    lista: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  });
