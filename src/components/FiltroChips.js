import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function FiltroChips({ opcoes, selecionado, onSelecionar, style }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.lista, style]}
    >
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === selecionado;
        return (
          <TouchableOpacity
            key={String(opcao.valor)}
            style={[styles.chip, ativo && styles.chipAtivo]}
            onPress={() => onSelecionar(opcao.valor)}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
          >
            {!!opcao.icon && (
              <Feather name={opcao.icon} size={13} color={ativo ? COLORS.onPrimary : COLORS.textSecondary} />
            )}
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>{opcao.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    lista: { gap: SPACING.sm, paddingHorizontal: SPACING.lg },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 14,
      height: 34,
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    chipAtivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    texto: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
    textoAtivo: { color: COLORS.onPrimary },
  });
