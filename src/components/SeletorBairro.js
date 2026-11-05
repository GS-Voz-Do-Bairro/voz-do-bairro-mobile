import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function SeletorBairro({ label, bairros, carregando, valor, onSelecionar, error }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [aberto, setAberto] = useState(false);
  const selecionado = bairros?.find((b) => b.id === valor);

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.campo, !!error && styles.campoErro]}
        onPress={() => setAberto(true)}
        disabled={carregando}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Feather name="map-pin" size={18} color={COLORS.textSecondary} />
        <Text style={[styles.valor, !selecionado && styles.placeholder]}>
          {carregando ? 'Carregando bairros...' : (selecionado?.nome ?? 'Selecione o seu bairro')}
        </Text>
        <Feather name="chevron-down" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
      <Text style={styles.erro}>{error || ''}</Text>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <TouchableOpacity style={styles.fundo} activeOpacity={1} onPress={() => setAberto(false)}>
          <View style={styles.lista}>
            <Text style={styles.listaTitulo}>Escolha o seu bairro</Text>
            <FlatList
              data={bairros ?? []}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onSelecionar(item.id);
                    setAberto(false);
                  }}
                >
                  <View style={styles.flex}>
                    <Text style={styles.itemNome}>{item.nome}</Text>
                    {!!item.cidade && <Text style={styles.itemCidade}>{item.cidade}</Text>}
                  </View>
                  {item.id === valor && <Feather name="check" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    wrapper: { width: '100%', marginBottom: SPACING.sm },
    label: {
      color: COLORS.textSecondary,
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.sm,
      marginBottom: SPACING.xs,
    },
    campo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.lg,
      height: 52,
    },
    campoErro: { borderColor: COLORS.critical },
    valor: { flex: 1, fontFamily: FONTS.regular, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
    placeholder: { color: COLORS.textMuted },
    erro: {
      color: COLORS.critical,
      fontFamily: FONTS.semibold,
      fontSize: FONTS.sizes.xs,
      minHeight: 18,
      marginTop: 2,
    },
    fundo: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', padding: SPACING.xl },
    lista: {
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      maxHeight: '70%',
    },
    listaTitulo: {
      fontFamily: FONTS.subtitle,
      fontSize: FONTS.sizes.lg,
      color: COLORS.textPrimary,
      marginBottom: SPACING.sm,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderLight,
    },
    flex: { flex: 1 },
    itemNome: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
    itemCidade: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  });
