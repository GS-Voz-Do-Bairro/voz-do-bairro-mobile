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
import { TIPOS_RESPOSTA, corDoTom } from '../../constants/status';
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

  const [tipo, setTipo] = useState(null);
  const [justificativa, setJustificativa] = useState('');
  const [dataTexto, setDataTexto] = useState('');
  const [erros, setErros] = useState({});

  if (isLoading) return <LoadingOverlay mensagem="Carregando demanda..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  const precisaData = tipo === 'AGENDADA' || tipo === 'ACEITA';

  const handleRascunho = async () => {
    if (!tipo) {
      setErros({ tipo: 'Escolha a decisão para gerar o rascunho.' });
      return;
    }
    try {
      const texto = await rascunho.mutateAsync(tipo);
      setJustificativa(texto);
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
    const dataPrevista = dataTexto ? brParaIso(dataTexto) : null;
    const e = validarResposta({ tipo, justificativa, dataPrevista });
    if (dataTexto && !dataPrevista) e.dataPrevista = 'Data inválida. Use dd/mm/aaaa.';
    setErros(e);
    if (Object.keys(e).length) return;

    const dados = { tipo, justificativa, dataPrevista: precisaData ? dataPrevista : null };
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
            {Object.entries(TIPOS_RESPOSTA).map(([valor, info]) => {
              const ativo = tipo === valor;
              const cor = corDoTom(info.tom, COLORS);
              return (
                <TouchableOpacity
                  key={valor}
                  style={[styles.decisao, ativo && { backgroundColor: cor, borderColor: cor }]}
                  onPress={() => {
                    setTipo(valor);
                    setErros((prev) => ({ ...prev, tipo: null }));
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativo }}
                >
                  <Feather name={info.icon} size={18} color={ativo ? '#FFFFFF' : cor} />
                  <Text style={[styles.decisaoTexto, ativo && styles.decisaoTextoAtivo]}>{info.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.erro}>{erros.tipo || ''}</Text>

          {precisaData && (
            <CustomInput
              label={tipo === 'AGENDADA' ? 'Data prevista' : 'Data prevista (opcional)'}
              icon="calendar"
              placeholder="dd/mm/aaaa"
              keyboardType="number-pad"
              value={dataTexto}
              onChangeText={(t) => {
                setDataTexto(mascaraData(t));
                setErros((prev) => ({ ...prev, dataPrevista: null }));
              }}
              error={erros.dataPrevista}
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
          <Text style={styles.dica}>O rascunho é só um ponto de partida: revise antes de enviar.</Text>

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
    dica: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.xs,
      color: COLORS.textMuted,
      marginBottom: SPACING.lg,
    },
  });
