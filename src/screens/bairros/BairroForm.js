import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, SPACING } from '../../constants/theme';
import { useBairro, useSalvarBairro } from '../../hooks/useBairros';
import useThemedStyles from '../../hooks/useThemedStyles';
import { validarBairro } from '../../utils/validators';
import { camposDoErro, mensagemDeErro } from '../../utils/apiError';

const FORM_INICIAL = { nome: '', subprefeitura: '', cidade: 'São Paulo', metaApoiosPadrao: '50' };

export default function BairroForm({ navigation, route }) {
  const styles = useThemedStyles(createStyles);
  const id = route.params?.id;
  const editando = !!id;
  const { data: bairro, isLoading } = useBairro(id);
  const salvar = useSalvarBairro();

  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (bairro) {
      setForm({
        nome: bairro.nome,
        subprefeitura: bairro.subprefeitura,
        cidade: bairro.cidade,
        metaApoiosPadrao: String(bairro.metaApoiosPadrao ?? ''),
      });
    }
  }, [bairro]);

  const alterar = (campo) => (valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: null }));
  };

  const handleSalvar = async () => {
    const e = validarBairro(form);
    setErros(e);
    if (Object.keys(e).length) return;
    try {
      await salvar.mutateAsync({ id, dados: form });
      navigation.goBack();
    } catch (error) {
      const campos = camposDoErro(error);
      if (Object.keys(campos).length) setErros(campos);
      Alert.alert(
        'Não foi possível salvar',
        error.response?.status === 409
          ? 'Já existe um bairro com esse nome nessa cidade.'
          : mensagemDeErro(error),
      );
    }
  };

  if (editando && isLoading) return <LoadingOverlay mensagem="Carregando bairro..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title={editando ? 'Editar bairro' : 'Novo bairro'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <CustomInput
            label="Nome"
            icon="map-pin"
            placeholder="Ex.: Jardim Ângela"
            maxLength={100}
            value={form.nome}
            onChangeText={alterar('nome')}
            error={erros.nome}
          />
          <CustomInput
            label="Subprefeitura"
            icon="home"
            placeholder="Ex.: M'Boi Mirim"
            maxLength={100}
            value={form.subprefeitura}
            onChangeText={alterar('subprefeitura')}
            error={erros.subprefeitura}
          />
          <CustomInput
            label="Cidade"
            icon="map"
            maxLength={100}
            value={form.cidade}
            onChangeText={alterar('cidade')}
            error={erros.cidade}
          />
          <CustomInput
            label="Meta de apoios"
            icon="users"
            keyboardType="number-pad"
            value={form.metaApoiosPadrao}
            onChangeText={(t) => alterar('metaApoiosPadrao')(t.replace(/\D/g, ''))}
            error={erros.metaApoiosPadrao}
          />
          <Text style={styles.dica}>
            A meta vale para as novas propostas do bairro. Propostas já publicadas mantêm a meta original.
          </Text>
          <PrimaryButton
            label={editando ? 'Salvar alterações' : 'Cadastrar bairro'}
            icon="save"
            onPress={handleSalvar}
            loading={salvar.isPending}
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
    content: { padding: SPACING.xl },
    dica: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textMuted,
      lineHeight: 19,
      marginBottom: SPACING.lg,
    },
  });
