import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { FONTS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useThemedStyles from '../../hooks/useThemedStyles';
import { BUILD_INFO } from '../../config/buildInfo';
import { useNaoLidas } from '../../hooks/useNotificacoes';

const OPCOES_TEMA = [
  { value: 'system', label: 'Sistema', icon: 'smartphone' },
  { value: 'light', label: 'Claro', icon: 'sun' },
  { value: 'dark', label: 'Escuro', icon: 'moon' },
];

const PAPEL_LABEL = { CIDADAO: 'Cidadão', GESTOR: 'Gestor da prefeitura' };

function ItemMenu({ icon, label, descricao, onPress, styles, COLORS }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.itemIcone}>
        <Feather name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.itemLabel}>{label}</Text>
        {!!descricao && <Text style={styles.itemDescricao}>{descricao}</Text>}
      </View>
      <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

export default function Perfil({ navigation }) {
  const { colors: COLORS, preference, setPreference } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { usuario, isGestor, logout } = useAuth();
  const [saindo, setSaindo] = useState(false);
  const naoLidas = useNaoLidas();

  const iniciais = (usuario?.nome || '?')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja sair do Voz do Bairro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setSaindo(true);
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Perfil" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSecao}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciais}</Text>
          </View>
          <Text style={styles.nome}>{usuario?.nome}</Text>
          <Text style={styles.email}>{usuario?.email}</Text>
          <View style={styles.selos}>
            <View style={styles.selo}>
              <Feather name={isGestor ? 'briefcase' : 'user'} size={12} color={COLORS.primary} />
              <Text style={styles.seloTexto}>{PAPEL_LABEL[usuario?.papel] ?? usuario?.papel}</Text>
            </View>
            {!!usuario?.bairroNome && (
              <View style={styles.selo}>
                <Feather name="map-pin" size={12} color={COLORS.primary} />
                <Text style={styles.seloTexto}>{usuario.bairroNome}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          {!isGestor && (
            <ItemMenu
              icon="file-text"
              label="Minhas propostas"
              descricao="Acompanhe, edite ou exclua o que você publicou"
              onPress={() => navigation.navigate('MinhasPropostas')}
              styles={styles}
              COLORS={COLORS}
            />
          )}
          {!isGestor && (
            <ItemMenu
              icon="thumbs-up"
              label="Meus apoios"
              descricao="Propostas que você apoiou"
              onPress={() => navigation.navigate('MeusApoios')}
              styles={styles}
              COLORS={COLORS}
            />
          )}
          {isGestor && (
            <ItemMenu
              icon="map"
              label="Bairros"
              descricao="Cadastre bairros e ajuste a meta de apoios"
              onPress={() => navigation.navigate('GerenciarBairros')}
              styles={styles}
              COLORS={COLORS}
            />
          )}
          <ItemMenu
            icon="bell"
            label="Notificações"
            descricao={
              naoLidas ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Avisos sobre as suas propostas'
            }
            onPress={() => navigation.navigate('Notificacoes')}
            styles={styles}
            COLORS={COLORS}
          />
          <ItemMenu
            icon="info"
            label="Sobre o app"
            descricao={`Versão ${BUILD_INFO.versao} · ${BUILD_INFO.commitCurto}`}
            onPress={() => navigation.navigate('SobreApp')}
            styles={styles}
            COLORS={COLORS}
          />
        </View>

        <View style={[styles.card, styles.cardPadding]}>
          <Text style={styles.cardTitulo}>Aparência</Text>
          <View style={styles.segmentos}>
            {OPCOES_TEMA.map((opcao) => {
              const ativo = preference === opcao.value;
              return (
                <TouchableOpacity
                  key={opcao.value}
                  style={[styles.segmento, ativo && styles.segmentoAtivo]}
                  onPress={() => setPreference(opcao.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativo }}
                >
                  <Feather
                    name={opcao.icon}
                    size={15}
                    color={ativo ? COLORS.onPrimary : COLORS.textSecondary}
                  />
                  <Text style={[styles.segmentoTexto, ativo && styles.segmentoTextoAtivo]}>
                    {opcao.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <PrimaryButton
          label="Sair da conta"
          icon="log-out"
          variant="danger"
          onPress={handleLogout}
          loading={saindo}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl },
    avatarSecao: { alignItems: 'center', marginTop: SPACING.sm },
    avatar: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
    },
    avatarTexto: { fontFamily: FONTS.title, fontSize: FONTS.sizes.xxl, color: COLORS.onPrimary },
    nome: { fontFamily: FONTS.title, fontSize: FONTS.sizes.xl, color: COLORS.textPrimary },
    email: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    selos: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginTop: SPACING.sm,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    selo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: COLORS.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: RADIUS.full,
    },
    seloTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs, color: COLORS.primary },
    card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, ...SHADOW.card },
    cardPadding: { padding: SPACING.lg },
    cardTitulo: {
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.md,
      color: COLORS.textPrimary,
      marginBottom: SPACING.md,
    },
    item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg },
    itemIcone: {
      width: 38,
      height: 38,
      borderRadius: RADIUS.sm,
      backgroundColor: COLORS.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemLabel: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
    itemDescricao: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
    segmentos: { flexDirection: 'row', gap: SPACING.sm },
    segmento: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 40,
      borderRadius: RADIUS.sm,
      backgroundColor: COLORS.surfaceAlt,
    },
    segmentoAtivo: { backgroundColor: COLORS.primary },
    segmentoTexto: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    segmentoTextoAtivo: { color: COLORS.onPrimary },
  });
