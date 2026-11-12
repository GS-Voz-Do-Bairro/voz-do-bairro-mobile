import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import CategoriaTag from '../../components/CategoriaTag';
import BarraApoios from '../../components/BarraApoios';
import RespostaCard from '../../components/RespostaCard';
import ComentarioItem from '../../components/ComentarioItem';
import PrimaryButton from '../../components/PrimaryButton';
import LoadingOverlay from '../../components/LoadingOverlay';
import ErrorState from '../../components/ErrorState';
import { FONTS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useProposta, useRemoverProposta } from '../../hooks/usePropostas';
import { useApoio, useJaApoiou } from '../../hooks/useApoio';
import { useComentarios, useRemoverComentario, useSalvarComentario } from '../../hooks/useComentarios';
import { useConcluirDemanda } from '../../hooks/useDemandas';
import { usePermissoes } from '../../hooks/usePermissoes';
import useThemedStyles from '../../hooks/useThemedStyles';
import { diasAte, formatarData, textoPrazo } from '../../utils/dateUtils';
import { LIMITES, validarComentario } from '../../utils/validators';
import { mensagemDeErro } from '../../utils/apiError';

export default function PropostaDetalhe({ navigation, route }) {
  const { id, recemCriada } = route.params;
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const permissoes = usePermissoes();

  const { data: proposta, isLoading, isError, error, refetch, isRefetching } = useProposta(id);
  const { data: comentarios = [], isLoading: carregandoComentarios } = useComentarios(id);
  const apoio = useApoio(id);
  const { data: jaApoiou = false } = useJaApoiou(id, !permissoes.isGestor);
  const remover = useRemoverProposta();
  const salvarComentario = useSalvarComentario(id);
  const removerComentario = useRemoverComentario(id);
  const concluir = useConcluirDemanda(id);

  const [textoComentario, setTextoComentario] = useState('');
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [erroComentario, setErroComentario] = useState(null);

  if (isLoading) return <LoadingOverlay mensagem="Carregando proposta..." />;
  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Header title="Proposta" onBack={() => navigation.goBack()} />
        <ErrorState error={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const podeEditar = permissoes.podeEditarProposta(proposta);
  const podeExcluir = permissoes.podeExcluirProposta(proposta);
  const prazoVencido = diasAte(proposta.prazoResposta) < 0;

  const handleApoio = () => {
    apoio.mutate(!jaApoiou, {
      onError: (e) => Alert.alert('Não foi possível registrar o apoio', mensagemDeErro(e)),
    });
  };

  const handleExcluir = () => {
    Alert.alert('Excluir proposta', 'A proposta e os apoios recebidos serão removidos. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await remover.mutateAsync(id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Não foi possível excluir', mensagemDeErro(e));
          }
        },
      },
    ]);
  };

  const handleConcluir = () => {
    Alert.alert('Compromisso cumprido', 'Confirmar que o serviço prometido foi realizado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () =>
          concluir.mutate(undefined, {
            onError: (e) => Alert.alert('Não foi possível atualizar', mensagemDeErro(e)),
          }),
      },
    ]);
  };

  const handleEnviarComentario = async () => {
    const erro = validarComentario(textoComentario);
    setErroComentario(erro);
    if (erro) return;
    try {
      await salvarComentario.mutateAsync({ id: comentarioEditando?.id, texto: textoComentario });
      setTextoComentario('');
      setComentarioEditando(null);
    } catch (e) {
      Alert.alert('Não foi possível comentar', mensagemDeErro(e));
    }
  };

  const handleEditarComentario = (comentario) => {
    setComentarioEditando(comentario);
    setTextoComentario(comentario.texto);
    setErroComentario(null);
  };

  const cancelarEdicao = () => {
    setComentarioEditando(null);
    setTextoComentario('');
    setErroComentario(null);
  };

  const handleExcluirComentario = (comentario) => {
    Alert.alert('Excluir comentário', 'Deseja excluir este comentário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          removerComentario.mutate(comentario.id, {
            onError: (e) => Alert.alert('Não foi possível excluir', mensagemDeErro(e)),
          }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header
        title="Proposta"
        subtitle={proposta.bairroNome}
        onBack={() => navigation.goBack()}
        rightIcon={podeEditar ? 'edit-2' : undefined}
        rightLabel="Editar proposta"
        onRightPress={() => navigation.navigate('PropostaForm', { id })}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />
          }
        >
          {recemCriada && (
            <View style={styles.sucesso}>
              <Feather name="check-circle" size={18} color={COLORS.success} />
              <Text style={styles.sucessoTexto}>
                Proposta publicada! Compartilhe com os vizinhos para juntar apoios.
              </Text>
            </View>
          )}

          <View style={styles.topo}>
            <CategoriaTag categoria={proposta.categoria} />
            <StatusBadge status={proposta.status} />
          </View>
          <Text style={styles.titulo}>{proposta.titulo}</Text>
          <Text style={styles.meta}>
            Por {proposta.autorNome || 'morador'} em {formatarData(proposta.criadaEm)}
          </Text>

          {!proposta.resumoIa && proposta.status === 'ABERTA' && (
            <Text style={styles.resumoNota}>
              O resumo automático aparece em instantes. Puxe a tela para atualizar.
            </Text>
          )}
          {!!proposta.resumoIa && (
            <View style={styles.resumo}>
              <View style={styles.resumoCabecalho}>
                <Feather name="zap" size={14} color={COLORS.primary} />
                <Text style={styles.resumoTitulo}>Resumo</Text>
              </View>
              <Text style={styles.resumoTexto}>{proposta.resumoIa}</Text>
              <Text style={styles.resumoNota}>
                Resumo gerado automaticamente a partir da proposta e da discussão.
              </Text>
            </View>
          )}

          <Text style={styles.secao}>Descrição</Text>
          <Text style={styles.descricao}>{proposta.descricao}</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Apoios</Text>
            <BarraApoios total={proposta.totalApoios} meta={proposta.metaApoios} />
            {proposta.status === 'ABERTA' && proposta.metaApoios > proposta.totalApoios && (
              <Text style={styles.cardNota}>
                Faltam {proposta.metaApoios - proposta.totalApoios} apoios para virar demanda oficial.
              </Text>
            )}
            {permissoes.podeApoiar(proposta) && (
              <PrimaryButton
                label={jaApoiou ? 'Retirar apoio' : 'Apoiar proposta'}
                icon={jaApoiou ? 'x' : 'thumbs-up'}
                variant={jaApoiou ? 'outline' : 'secondary'}
                onPress={handleApoio}
                loading={apoio.isPending}
                style={styles.botao}
              />
            )}
            {jaApoiou && proposta.status !== 'ABERTA' && (
              <Text style={styles.cardNota}>Você apoiou esta proposta.</Text>
            )}
            {permissoes.ehAutor(proposta) && proposta.status === 'ABERTA' && (
              <Text style={styles.cardNota}>
                Você é o autor. Mostre a proposta aos vizinhos para juntar apoios.
              </Text>
            )}
          </View>

          {['DEMANDA', 'ATRASADA'].includes(proposta.status) && !!proposta.prazoResposta && (
            <View style={[styles.prazo, prazoVencido && styles.prazoVencido]}>
              <Feather
                name={prazoVencido ? 'alert-triangle' : 'clock'}
                size={20}
                color={prazoVencido ? COLORS.critical : COLORS.warning}
              />
              <View style={styles.flex}>
                <Text
                  style={[styles.prazoTitulo, { color: prazoVencido ? COLORS.critical : COLORS.warning }]}
                >
                  {textoPrazo(proposta.prazoResposta)}
                </Text>
                <Text style={styles.prazoTexto}>
                  {prazoVencido
                    ? 'A prefeitura não respondeu no prazo. O atraso aparece no placar do bairro.'
                    : `A prefeitura deve responder até ${formatarData(proposta.prazoResposta)}.`}
                </Text>
              </View>
            </View>
          )}

          {!!proposta.resposta && <RespostaCard resposta={proposta.resposta} />}

          {permissoes.podeResponder(proposta) && (
            <PrimaryButton
              label="Responder demanda"
              icon="edit-3"
              onPress={() => navigation.navigate('ResponderDemanda', { id })}
              style={styles.botao}
            />
          )}
          {permissoes.podeConcluir(proposta) && (
            <PrimaryButton
              label="Marcar compromisso como cumprido"
              icon="check-circle"
              variant="outline"
              onPress={handleConcluir}
              loading={concluir.isPending}
              style={styles.botao}
            />
          )}
          {podeExcluir && (
            <PrimaryButton
              label="Excluir proposta"
              icon="trash-2"
              variant="danger"
              small
              onPress={handleExcluir}
              loading={remover.isPending}
              style={styles.botao}
            />
          )}

          <Text style={styles.secao}>Comentários ({comentarios.length})</Text>
          {carregandoComentarios ? (
            <Text style={styles.vazio}>Carregando comentários...</Text>
          ) : comentarios.length === 0 ? (
            <Text style={styles.vazio}>Ninguém comentou ainda. Conte o que você sabe sobre o problema.</Text>
          ) : (
            comentarios.map((c) => (
              <ComentarioItem
                key={c.id}
                comentario={c}
                ehAutor={permissoes.ehAutorDoComentario(c)}
                onEditar={handleEditarComentario}
                onExcluir={handleExcluirComentario}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.caixaComentario}>
          {!!comentarioEditando && (
            <View style={styles.editandoBarra}>
              <Text style={styles.editandoTexto}>Editando comentário</Text>
              <TouchableOpacity onPress={cancelarEdicao} hitSlop={10}>
                <Text style={styles.editandoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
          {!!erroComentario && <Text style={styles.erro}>{erroComentario}</Text>}
          <View style={styles.linhaComentario}>
            <TextInput
              style={styles.inputComentario}
              placeholder="Escreva um comentário..."
              placeholderTextColor={COLORS.textMuted}
              value={textoComentario}
              onChangeText={(t) => {
                setTextoComentario(t);
                if (erroComentario) setErroComentario(null);
              }}
              maxLength={LIMITES.comentario.max}
              multiline
              accessibilityLabel="Comentário"
            />
            <TouchableOpacity
              style={styles.enviar}
              onPress={handleEnviarComentario}
              disabled={salvarComentario.isPending}
              accessibilityRole="button"
              accessibilityLabel="Enviar comentário"
            >
              <Feather name={comentarioEditando ? 'check' : 'send'} size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    content: { padding: SPACING.lg, paddingBottom: SPACING.xxl, gap: SPACING.md },
    sucesso: {
      flexDirection: 'row',
      gap: SPACING.sm,
      alignItems: 'center',
      backgroundColor: COLORS.success + '1F',
      borderRadius: RADIUS.md,
      padding: SPACING.md,
    },
    sucessoTexto: {
      flex: 1,
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textPrimary,
    },
    topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    titulo: { fontFamily: FONTS.title, fontSize: FONTS.sizes.xl, color: COLORS.textPrimary, lineHeight: 28 },
    meta: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: -6 },
    resumo: {
      backgroundColor: COLORS.primarySoft,
      borderRadius: RADIUS.md,
      padding: SPACING.lg,
      gap: 6,
    },
    resumoCabecalho: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    resumoTitulo: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.primary },
    resumoTexto: {
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.md,
      color: COLORS.textPrimary,
      lineHeight: 22,
    },
    resumoNota: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
    secao: {
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.lg,
      color: COLORS.textPrimary,
      marginTop: SPACING.sm,
    },
    descricao: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.md,
      color: COLORS.textSecondary,
      lineHeight: 23,
    },
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      gap: SPACING.sm,
      ...SHADOW.card,
    },
    cardTitulo: { fontFamily: FONTS.subtitle, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
    cardNota: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    botao: { marginTop: SPACING.xs },
    prazo: {
      flexDirection: 'row',
      gap: SPACING.md,
      backgroundColor: COLORS.warning + '1A',
      borderRadius: RADIUS.md,
      padding: SPACING.lg,
    },
    prazoVencido: { backgroundColor: COLORS.critical + '1A' },
    prazoTitulo: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.md },
    prazoTexto: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      marginTop: 2,
      lineHeight: 19,
    },
    vazio: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
    caixaComentario: {
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      backgroundColor: COLORS.surface,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
    },
    editandoBarra: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    editandoTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs, color: COLORS.primary },
    editandoCancelar: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
    erro: { color: COLORS.critical, fontFamily: FONTS.semibold, fontSize: FONTS.sizes.xs, marginBottom: 4 },
    linhaComentario: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm },
    inputComentario: {
      flex: 1,
      minHeight: 42,
      maxHeight: 110,
      borderRadius: RADIUS.md,
      backgroundColor: COLORS.surfaceAlt,
      paddingHorizontal: SPACING.md,
      paddingVertical: 10,
      color: COLORS.textPrimary,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.md,
    },
    enviar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
