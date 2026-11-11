import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { tempoRelativo } from '../utils/dateUtils';

export default function ComentarioItem({ comentario, ehAutor, onEditar, onExcluir }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const iniciais = (comentario.autorNome || '?')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{iniciais}</Text>
      </View>
      <View style={styles.corpo}>
        <View style={styles.cabecalho}>
          <Text style={styles.nome} numberOfLines={1}>
            {comentario.autorNome}
          </Text>
          <Text style={styles.data}>
            {tempoRelativo(comentario.criadoEm)}
            {comentario.editado ? ' · editado' : ''}
          </Text>
        </View>
        <Text style={styles.texto}>{comentario.texto}</Text>
        {ehAutor && (
          <View style={styles.acoes}>
            <TouchableOpacity
              style={styles.acao}
              onPress={() => onEditar(comentario)}
              accessibilityLabel="Editar comentário"
            >
              <Feather name="edit-2" size={13} color={COLORS.textMuted} />
              <Text style={styles.acaoTexto}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acao}
              onPress={() => onExcluir(comentario)}
              accessibilityLabel="Excluir comentário"
            >
              <Feather name="trash-2" size={13} color={COLORS.critical} />
              <Text style={[styles.acaoTexto, { color: COLORS.critical }]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: { flexDirection: 'row', gap: SPACING.md, paddingVertical: SPACING.md },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.primary },
    corpo: { flex: 1 },
    cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    nome: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, maxWidth: '55%' },
    data: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
    texto: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      marginTop: 3,
      lineHeight: 19,
    },
    acoes: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.xs },
    acao: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 2 },
    acaoTexto: { fontFamily: FONTS.semibold, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  });
