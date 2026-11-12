import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import LoadingOverlay from '../../components/LoadingOverlay';
import ErrorState from '../../components/ErrorState';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';
import { DECISOES, corDoTom } from '../../constants/status';
import { useTheme } from '../../contexts/ThemeContext';
import { useProposta } from '../../hooks/usePropostas';
import { useRascunhoParecer, useResponderDemanda } from '../../hooks/useDemandas';
import useThemedStyles from '../../hooks/useThemedStyles';
import { brParaIso, mascaraData, textoPrazo } from '../../utils/dateUtils';
import { LIMITES, validarResposta } from '../../utils/validators';
import { camposDoErro, mensagemDeErro } from '../../utils/apiError';

export default function ResponderDemanda({ navigation, route }) {
  const { id } = route.params;
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);

  const { data: proposta, isLoading, isError, error, refetch } = useProposta(id);
  const responder = useResponderDemanda(id);
  const rascunho = useRascunhoParecer(id);

  const [decisao, setDecisao] = useState(null);
  const [justificativa, setJustificativa] = useState('');
  const [prazoTexto, setPrazoTexto] = useState('');
  const [sugestao, setSugestao] = useState(null);
  const [erros, setErros] = useState({});

  if (isLoading) return <LoadingOverlay mensagem="Carregando demanda..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  const escolherDecisao = (valor) => {
    setDecisao(valor);
    setErros((prev) => ({ ...prev, decisao: null }));
  };

  const handleRascunho = async () => {
    try {
      const resultado = await rascunho.mutateAsync();
      setSugestao(resultado);
      setJustificativa(resultado.justificativa);
      if (!decisao && resultado.sugestaoDecisao) setDecisao(resultado.sugestaoDecisao);
      setErros((prev) => ({ ...prev, justificativa: null }));
    } catch (e) {
      Alert.alert('Não foi possível gerar o rascunho', mensagemDeErro(e));
    }
  };

  const enviar = async (dados) => {
    try {
      await responder.mutateAsync(dados);
      Alert.alert('Resposta enviada', 'Os moradores já podem ver a resposta da prefeitura.');
      navigation.goBack();
    } catch (e) {
      const campos = camposDoErro(e);
      if (Object.keys(campos).length) setErros(campos);
      Alert.alert('Não foi possível enviar', mensagemDeErro(e));
    }
  };

  const handleEnviar = () => {
    const prazoExecucao = prazoTexto ? brParaIso(prazoTexto) : null;
    const e = validarResposta({ decisao, justificativa, prazoExecucao });
    if (decisao === 'ACEITA' && prazoTexto && !prazoExecucao)
      e.prazoExecucao = 'Data inválida. Use dd/mm/aaaa.';
    setErros(e);
    if (Object.keys(e).length) return;

    const dados = { decisao, justificativa, prazoExecucao };
    Alert.alert('Enviar resposta', 'A resposta fica pública para todos os moradores. Confirma o envio?', [
      { text: 'Revisar', style: 'cancel' },
      { text: 'Enviar', onPress: () => enviar(dados) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Responder demanda" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.demanda}>
            <Text style={styles.demandaTitulo}>{proposta.titulo}</Text>
            <Text style={styles.demandaResumo}>{proposta.resumoIa || proposta.descricao}</Text>
            <Text style={styles.demandaInfo}>
              {proposta.totalApoios} apoios · {textoPrazo(proposta.prazoResposta)}
            </Text>
          </View>

          <Text style={styles.label}>Decisão</Text>
          <View style={styles.decisoes}>
            {Object.entries(DECISOES).map(([valor, info]) => {
              const ativo = decisao === valor;
              const cor = corDoTom(info.tom, COLORS);
              return (
                <TouchableOpacity
                  key={valor}
                  style={[styles.decisao, ativo && { backgroundColor: cor, borderColor: cor }]}
                  onPress={() => escolherDecisao(valor)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativo }}
                >
                  <Feather name={info.icon} size={18} color={ativo ? '#FFFFFF' : cor} />
                  <Text style={[styles.decisaoTexto, ativo && styles.decisaoTextoAtivo]}>{info.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.erro}>{erros.decisao || ''}</Text>

          {decisao === 'ACEITA' && (
            <CustomInput
              label="Prazo de execução"
              icon="calendar"
              placeholder="dd/mm/aaaa"
              keyboardType="number-pad"
              value={prazoTexto}
              onChangeText={(t) => {
                setPrazoTexto(mascaraData(t));
                setErros((prev) => ({ ...prev, prazoExecucao: null }));
              }}
              error={erros.prazoExecucao}
            />
          )}

          <View style={styles.parecerCabecalho}>
            <Text style={styles.label}>Parecer para os moradores</Text>
            <TouchableOpacity
              style={styles.botaoIa}
              onPress={handleRascunho}
              disabled={rascunho.isPending}
              accessibilityRole="button"
              accessibilityLabel="Gerar rascunho do parecer"
            >
              <Feather name="zap" size={14} color={COLORS.primary} />
              <Text style={styles.botaoIaTexto}>{rascunho.isPending ? 'Gerando...' : 'Gerar rascunho'}</Text>
            </TouchableOpacity>
          </View>
          <CustomInput
            placeholder="Explique a decisão de forma clara para a comunidade."
            multiline
            maxLength={LIMITES.justificativa.max}
            value={justificativa}
            onChangeText={(t) => {
              setJustificativa(t);
              setErros((prev) => ({ ...prev, justificativa: null }));
            }}
            error={erros.justificativa}
          />
          {sugestao ? (
            <View style={styles.sugestao}>
              {!!sugestao.sugestaoDecisao && (
                <Text style={styles.sugestaoTitulo}>
                  Sugestão: {DECISOES[sugestao.sugestaoDecisao]?.resultado ?? sugestao.sugestaoDecisao}
                </Text>
              )}
              {sugestao.pontosDeAtencao.map((ponto) => (
                <View key={ponto} style={styles.ponto}>
                  <Feather name="alert-circle" size={13} color={COLORS.warning} />
                  <Text style={styles.pontoTexto}>{ponto}</Text>
                </View>
              ))}
              <Text style={styles.dica}>
                {sugestao.aviso || 'O rascunho é só um ponto de partida: revise antes de enviar.'}
              </Text>
            </View>
          ) : (
            <Text style={styles.dica}>O rascunho é só um ponto de partida: revise antes de enviar.</Text>
          )}

          <PrimaryButton
            label="Enviar resposta"
            icon="send"
            onPress={handleEnviar}
            loading={responder.isPending}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    content: { padding: SPACING.xl, paddingBottom: SPACING.xxl },
    demanda: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      gap: 6,
      marginBottom: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    demandaTitulo: { fontFamily: FONTS.subtitle, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
    demandaResumo: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      lineHeight: 19,
    },
    demandaInfo: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs, color: COLORS.warning },
    label: {
      color: COLORS.textSecondary,
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.sm,
      marginBottom: SPACING.sm,
    },
    decisoes: { flexDirection: 'row', gap: SPACING.sm },
    decisao: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
      paddingVertical: SPACING.md,
      borderRadius: RADIUS.md,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      backgroundColor: COLORS.surface,
    },
    decisaoTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
    decisaoTextoAtivo: { color: '#FFFFFF' },
    erro: {
      color: COLORS.critical,
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.xs,
      minHeight: 18,
      marginTop: 4,
    },
    parecerCabecalho: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.sm,
    },
    botaoIa: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.primarySoft,
      marginBottom: SPACING.sm,
    },
    botaoIaTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs, color: COLORS.primary },
    sugestao: {
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      gap: 6,
      marginBottom: SPACING.lg,
    },
    sugestaoTitulo: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
    ponto: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
    pontoTexto: { flex: 1, fontFamily: FONTS.regular, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    dica: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.xs,
      color: COLORS.textMuted,
      marginBottom: SPACING.lg,
    },
  });
