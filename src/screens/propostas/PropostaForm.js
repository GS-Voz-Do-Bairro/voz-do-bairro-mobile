import React, { useEffect, useState } from 'react';
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
import GravadorAudio from '../../components/GravadorAudio';
import ModalSimilares from '../../components/ModalSimilares';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';
import { LISTA_CATEGORIAS } from '../../constants/categorias';
import { AUDIO_HABILITADO } from '../../config/env';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  useBuscarSimilares,
  useProposta,
  useSalvarProposta,
  useTranscreverAudio,
} from '../../hooks/usePropostas';
import useThemedStyles from '../../hooks/useThemedStyles';
import { LIMITES, validarProposta } from '../../utils/validators';
import { camposDoErro, mensagemDeErro } from '../../utils/apiError';

const FORM_INICIAL = { titulo: '', descricao: '', categoria: null, origem: 'TEXTO', transcricao: null };

export default function PropostaForm({ navigation, route }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { usuario } = useAuth();
  const id = route.params?.id;
  const editando = !!id;

  const { data: proposta, isLoading } = useProposta(id);
  const salvar = useSalvarProposta();
  const buscarSimilares = useBuscarSimilares();
  const transcrever = useTranscreverAudio();

  const [modo, setModo] = useState('texto');
  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});
  const [similares, setSimilares] = useState([]);

  useEffect(() => {
    if (proposta) {
      setForm({
        titulo: proposta.titulo,
        descricao: proposta.descricao,
        categoria: proposta.categoria,
        origem: 'TEXTO',
        transcricao: null,
      });
    }
  }, [proposta]);

  const alterar = (campo) => (valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: null }));
  };

  const handleTranscrever = async (uri) => {
    try {
      const resultado = await transcrever.mutateAsync(uri);
      setForm((prev) => ({
        ...prev,
        titulo: resultado.titulo || prev.titulo,
        descricao: resultado.descricao || prev.descricao,
        categoria: resultado.categoria || prev.categoria,
        origem: 'AUDIO',
        transcricao: resultado.transcricao,
      }));
      setErros({});
      setModo('texto');
    } catch (error) {
      Alert.alert(
        'Não foi possível transcrever',
        mensagemDeErro(error, 'Tente gravar de novo ou escreva a proposta.'),
      );
    }
  };

  const publicar = async () => {
    try {
      const dados = { ...form, bairroId: usuario.bairroId };
      const salva = await salvar.mutateAsync({ id, dados });
      setSimilares([]);
      if (editando) {
        navigation.goBack();
      } else {
        navigation.replace('PropostaDetalhe', { id: salva.id, recemCriada: true });
      }
    } catch (error) {
      setSimilares([]);
      const campos = camposDoErro(error);
      if (Object.keys(campos).length) setErros(campos);
      Alert.alert('Não foi possível salvar', mensagemDeErro(error));
    }
  };

  const handleSalvar = async () => {
    const e = validarProposta(form);
    setErros(e);
    if (Object.keys(e).length) return;

    if (editando) {
      await publicar();
      return;
    }

    try {
      const encontradas = await buscarSimilares.mutateAsync({
        titulo: form.titulo,
        descricao: form.descricao,
        bairroId: usuario.bairroId,
      });
      if (encontradas.length) {
        setSimilares(encontradas);
        return;
      }
    } catch {
      // ignora
    }
    await publicar();
  };

  if (editando && isLoading) return <LoadingOverlay mensagem="Carregando proposta..." />;

  const salvando = salvar.isPending || buscarSimilares.isPending;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title={editando ? 'Editar proposta' : 'Nova proposta'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {!editando && AUDIO_HABILITADO && (
            <View style={styles.modos}>
              {[
                { valor: 'texto', label: 'Escrever', icon: 'edit-3' },
                { valor: 'audio', label: 'Falar', icon: 'mic' },
              ].map((opcao) => {
                const ativo = modo === opcao.valor;
                return (
                  <TouchableOpacity
                    key={opcao.valor}
                    style={[styles.modo, ativo && styles.modoAtivo]}
                    onPress={() => setModo(opcao.valor)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: ativo }}
                  >
                    <Feather
                      name={opcao.icon}
                      size={16}
                      color={ativo ? COLORS.onPrimary : COLORS.textSecondary}
                    />
                    <Text style={[styles.modoTexto, ativo && styles.modoTextoAtivo]}>{opcao.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {modo === 'audio' ? (
            <GravadorAudio onTranscrever={handleTranscrever} transcrevendo={transcrever.isPending} />
          ) : (
            <>
              {form.origem === 'AUDIO' && !!form.transcricao && (
                <View style={styles.aviso}>
                  <Feather name="info" size={16} color={COLORS.info} />
                  <Text style={styles.avisoTexto}>
                    Texto gerado a partir do seu áudio. Confira e ajuste o que precisar antes de publicar.
                  </Text>
                </View>
              )}

              <CustomInput
                label="Título"
                placeholder="Ex.: Buraco na Rua das Palmeiras, 230"
                maxLength={LIMITES.titulo.max}
                value={form.titulo}
                onChangeText={alterar('titulo')}
                error={erros.titulo}
              />
              <CustomInput
                label="Descrição"
                placeholder="Conte qual é o problema, onde fica e como ele afeta os moradores."
                multiline
                maxLength={LIMITES.descricao.max}
                value={form.descricao}
                onChangeText={alterar('descricao')}
                error={erros.descricao}
              />

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categorias}>
                {LISTA_CATEGORIAS.map((c) => {
                  const ativo = form.categoria === c.valor;
                  return (
                    <TouchableOpacity
                      key={c.valor}
                      style={[styles.categoria, ativo && { backgroundColor: c.cor, borderColor: c.cor }]}
                      onPress={() => alterar('categoria')(c.valor)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: ativo }}
                    >
                      <Feather name={c.icon} size={15} color={ativo ? '#FFFFFF' : c.cor} />
                      <Text style={[styles.categoriaTexto, ativo && styles.categoriaTextoAtivo]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.erro}>{erros.categoria || ''}</Text>

              {!editando && (
                <Text style={styles.dica}>
                  Sua proposta aparece para os vizinhos do bairro {usuario?.bairroNome}. Quando atingir a meta
                  de apoios, ela vira uma demanda oficial e a prefeitura tem prazo para responder.
                </Text>
              )}

              <PrimaryButton
                label={editando ? 'Salvar alterações' : 'Publicar proposta'}
                icon={editando ? 'save' : 'send'}
                onPress={handleSalvar}
                loading={salvando}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalSimilares
        visivel={similares.length > 0}
        similares={similares}
        publicando={salvar.isPending}
        onFechar={() => setSimilares([])}
        onPublicarMesmoAssim={publicar}
        onVerProposta={(p) => {
          setSimilares([]);
          navigation.navigate('PropostaDetalhe', { id: p.id });
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    content: { padding: SPACING.xl, paddingBottom: SPACING.xxl },
    modos: {
      flexDirection: 'row',
      backgroundColor: COLORS.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: 4,
      marginBottom: SPACING.xl,
    },
    modo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 42,
      borderRadius: RADIUS.sm,
    },
    modoAtivo: { backgroundColor: COLORS.primary },
    modoTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
    modoTextoAtivo: { color: COLORS.onPrimary },
    aviso: {
      flexDirection: 'row',
      gap: SPACING.sm,
      backgroundColor: COLORS.info + '1A',
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.lg,
    },
    avisoTexto: {
      flex: 1,
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textPrimary,
      lineHeight: 19,
    },
    label: {
      color: COLORS.textSecondary,
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.sm,
      marginBottom: SPACING.sm,
    },
    categorias: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    categoria: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      height: 38,
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.surface,
    },
    categoriaTexto: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
    categoriaTextoAtivo: { color: '#FFFFFF' },
    erro: {
      color: COLORS.critical,
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.xs,
      minHeight: 18,
      marginTop: 4,
    },
    dica: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textMuted,
      lineHeight: 19,
      marginVertical: SPACING.md,
    },
  });
