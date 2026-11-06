import React, { useState } from 'react';
import {
  Alert,
  Image,
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

import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useThemedStyles from '../../hooks/useThemedStyles';
import { validarLogin } from '../../utils/validators';
import { mensagemDeErro } from '../../utils/apiError';

export default function Login({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { login, processando } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erros, setErros] = useState({});

  const limparErro = (campo) => setErros((prev) => ({ ...prev, [campo]: null }));

  const handleLogin = async () => {
    const e = validarLogin({ email, senha });
    setErros(e);
    if (Object.keys(e).length) return;
    try {
      await login({ email, senha });
    } catch (error) {
      const status = error?.response?.status;
      const msg =
        status === 401 || status === 403
          ? 'E-mail ou senha incorretos.'
          : mensagemDeErro(error, 'Não foi possível entrar. Tente novamente.');
      Alert.alert('Erro ao entrar', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.appName}>Voz do Bairro</Text>
            <Text style={styles.tagline}>Proponha, apoie e acompanhe as melhorias do seu bairro.</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Entrar</Text>

            <CustomInput
              label="E-mail"
              icon="mail"
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={(texto) => {
                setEmail(texto);
                limparErro('email');
              }}
              error={erros.email}
            />

            <CustomInput
              label="Senha"
              icon="lock"
              placeholder="Sua senha"
              secureTextEntry={!senhaVisivel}
              autoComplete="password"
              value={senha}
              onChangeText={(texto) => {
                setSenha(texto);
                limparErro('senha');
              }}
              onSubmitEditing={handleLogin}
              error={erros.senha}
              right={
                <TouchableOpacity
                  onPress={() => setSenhaVisivel((v) => !v)}
                  accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
                  hitSlop={10}
                >
                  <Feather name={senhaVisivel ? 'eye-off' : 'eye'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              }
            />

            <PrimaryButton label="Entrar" icon="log-in" onPress={handleLogin} loading={processando} />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ainda não tem conta?</Text>
              <View style={styles.dividerLine} />
            </View>

            <PrimaryButton
              label="Criar conta"
              icon="user-plus"
              variant="outline"
              onPress={() => navigation.navigate('Cadastro')}
            />
          </View>

          <Image
            source={require('../../../assets/images/bairro.png')}
            style={styles.ilustracao}
            resizeMode="contain"
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
    container: { flexGrow: 1, padding: SPACING.xl, justifyContent: 'center' },
    hero: { alignItems: 'center', marginBottom: SPACING.xl },
    logo: { width: 76, height: 76, borderRadius: 20, marginBottom: SPACING.md },
    appName: { fontFamily: FONTS.title, fontSize: FONTS.sizes.xxxl, color: COLORS.textPrimary },
    tagline: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.md,
      color: COLORS.textSecondary,
      textAlign: 'center',
      marginTop: SPACING.xs,
      lineHeight: 22,
      maxWidth: 290,
    },
    formCard: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    formTitle: {
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.xl,
      color: COLORS.textPrimary,
      marginBottom: SPACING.lg,
    },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg, gap: SPACING.sm },
    dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    dividerText: { color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: FONTS.sizes.sm },
    ilustracao: { width: '100%', height: 130, marginTop: SPACING.xl },
  });
