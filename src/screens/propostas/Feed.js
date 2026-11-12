import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import PropostaCard from '../../components/PropostaCard';
import FiltroChips from '../../components/FiltroChips';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { FILTROS_STATUS } from '../../constants/status';
import { LISTA_CATEGORIAS } from '../../constants/categorias';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePropostas } from '../../hooks/usePropostas';
import { usePermissoes } from '../../hooks/usePermissoes';
import { useDebounce } from '../../hooks/useDebounce';
import { useBairros } from '../../hooks/useBairros';
import { useNaoLidas } from '../../hooks/useNotificacoes';
import useThemedStyles from '../../hooks/useThemedStyles';

const FILTROS_CATEGORIA = [
  { valor: null, label: 'Todas as categorias', icon: 'grid' },
  ...LISTA_CATEGORIAS.map((c) => ({ valor: c.valor, label: c.label, icon: c.icon })),
];

export default function Feed({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { usuario } = useAuth();
  const { podeCriarProposta, isGestor } = usePermissoes();

  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const buscaAtrasada = useDebounce(busca.trim());

  const naoLidas = useNaoLidas();
  const { data: bairros = [] } = useBairros();
  const [bairroGestor, setBairroGestor] = useState(null);
  const bairroId = isGestor ? bairroGestor : usuario?.bairroId;

  const {
    data: propostas,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = usePropostas({ bairroId, status, categoria }, buscaAtrasada);
  const filtrosBairro = [{ valor: null, label: 'Todos os bairros', icon: 'map' }].concat(
    bairros.map((b) => ({ valor: b.id, label: b.nome, icon: 'map-pin' })),
  );

  const abrirProposta = (proposta) => navigation.navigate('PropostaDetalhe', { id: proposta.id });
  const temFiltro = !!(status || categoria || buscaAtrasada);

  const renderConteudo = () => {
    if (isLoading) return <LoadingOverlay mensagem="Buscando propostas do bairro..." />;
    if (isError) return <ErrorState error={error} onRetry={refetch} />;
    return (
      <FlatList
        data={propostas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PropostaCard
            proposta={item}
            onPress={() => abrirProposta(item)}
            mostrarPrazo
            mostrarBairro={!bairroId}
          />
        )}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          temFiltro ? (
            <EmptyState
              icon="search"
              title="Nenhuma proposta encontrada"
              message="Tente mudar a busca ou os filtros."
            />
          ) : (
            <EmptyState
              ilustracao
              title="Ainda não há propostas no seu bairro"
              message="Que tal ser a primeira pessoa a sugerir uma melhoria?"
              actionLabel={podeCriarProposta ? 'Nova proposta' : undefined}
              onAction={() => navigation.navigate('PropostaForm')}
            />
          )
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header
        title="Propostas"
        subtitle={isGestor ? 'Prefeitura' : usuario?.bairroNome}
        rightIcon="bell"
        rightLabel="Notificações"
        badge={naoLidas}
        onRightPress={() => navigation.navigate('Notificacoes')}
      />

      <View style={styles.filtros}>
        <View style={styles.busca}>
          <Feather name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar por rua, praça, assunto..."
            placeholderTextColor={COLORS.textMuted}
            value={busca}
            onChangeText={setBusca}
            returnKeyType="search"
            accessibilityLabel="Buscar propostas"
          />
          {!!busca && (
            <TouchableOpacity onPress={() => setBusca('')} accessibilityLabel="Limpar busca" hitSlop={10}>
              <Feather name="x" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        {isGestor && (
          <FiltroChips opcoes={filtrosBairro} selecionado={bairroGestor} onSelecionar={setBairroGestor} />
        )}
        <FiltroChips opcoes={FILTROS_STATUS} selecionado={status} onSelecionar={setStatus} />
        <FiltroChips opcoes={FILTROS_CATEGORIA} selecionado={categoria} onSelecionar={setCategoria} />
      </View>

      <View style={styles.flex}>{renderConteudo()}</View>

      {podeCriarProposta && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('PropostaForm')}
          accessibilityRole="button"
          accessibilityLabel="Nova proposta"
        >
          <Feather name="plus" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    filtros: { paddingTop: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.sm },
    busca: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginHorizontal: SPACING.lg,
      paddingHorizontal: SPACING.md,
      height: 46,
      borderRadius: RADIUS.md,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    buscaInput: {
      flex: 1,
      height: '100%',
      color: COLORS.textPrimary,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.md,
    },
    lista: { padding: SPACING.lg, paddingBottom: 100 },
    fab: {
      position: 'absolute',
      right: SPACING.xl,
      bottom: SPACING.xl,
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: COLORS.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOW.card,
      elevation: 6,
    },
  });
