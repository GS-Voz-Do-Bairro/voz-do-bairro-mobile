import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import SeletorBairro from '../../components/SeletorBairro';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useBairros } from '../../hooks/useBairros';
import useThemedStyles from '../../hooks/useThemedStyles';
import { LIMITES, validarCadastro } from '../../utils/validators';
import { camposDoErro, mensagemDeErro } from '../../utils/apiError';

const FORM_INICIAL = { nome: '', email: '', senha: '', confirmarSenha: '', bairroId: null };

export default function Cadastro({ navigation }) {
  const styles = useThemedStyles(createStyles);
  const { registrar, processando } = useAuth();
  const { data: bairros, isLoading: carregandoBairros, isError: erroBairros, refetch } = useBairros();

  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});

  const alterar = (campo) => (valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: null }));
  };

  const handleCadastrar = async () => {
    const e = validarCadastro(form);
    setErros(e);
    if (Object.keys(e).length) return;
    try {
      await registrar(form);
    } catch (error) {
      const campos = camposDoErro(error);
      if (Object.keys(campos).length) setErros(campos);
      Alert.alert('Não foi possível criar a conta', mensagemDeErro(error));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Criar conta" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.intro}>
            Com a conta você publica propostas, apoia as dos vizinhos e acompanha a resposta da prefeitura.
          </Text>

          <View style={styles.card}>
            <CustomInput
              label="Nome completo"
              icon="user"
              placeholder="Como você se chama"
              autoComplete="name"
              maxLength={LIMITES.nome.max}
              value={form.nome}
              onChangeText={alterar('nome')}
              error={erros.nome}
            />
            <CustomInput
              label="E-mail"
              icon="mail"
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={form.email}
              onChangeText={alterar('email')}
              error={erros.email}
            />
            <SeletorBairro
              label="Bairro"
              bairros={bairros}
              carregando={carregandoBairros}
              valor={form.bairroId}
              onSelecionar={alterar('bairroId')}
              error={erros.bairroId || (erroBairros ? 'Não foi possível carregar os bairros.' : null)}
            />
            {erroBairros && (
              <PrimaryButton label="Recarregar bairros" variant="ghost" small onPress={refetch} />
            )}
            <CustomInput
              label="Senha"
              icon="lock"
              placeholder="Mínimo de 6 caracteres"
              secureTextEntry
              autoComplete="new-password"
              value={form.senha}
              onChangeText={alterar('senha')}
              error={erros.senha}
            />
            <CustomInput
              label="Confirmar senha"
              icon="lock"
              placeholder="Repita a senha"
              secureTextEntry
              value={form.confirmarSenha}
              onChangeText={alterar('confirmarSenha')}
              error={erros.confirmarSenha}
            />

            <PrimaryButton label="Criar conta" icon="check" onPress={handleCadastrar} loading={processando} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    container: { padding: SPACING.xl },
    intro: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.md,
      color: COLORS.textSecondary,
      lineHeight: 22,
      marginBottom: SPACING.lg,
    },
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
  });
