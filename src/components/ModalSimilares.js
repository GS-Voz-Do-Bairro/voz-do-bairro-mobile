import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import StatusBadge from './StatusBadge';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function ModalSimilares({
  visivel,
  similares,
  onVerProposta,
  onPublicarMesmoAssim,
  onFechar,
  publicando,
}) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <View style={styles.fundo}>
        <View style={styles.folha}>
          <View style={styles.icone}>
            <Feather name="copy" size={22} color={COLORS.secondaryDark} />
          </View>
          <Text style={styles.titulo}>Já existe uma proposta parecida</Text>
          <Text style={styles.texto}>
            Apoiar uma proposta que já existe ajuda ela a chegar mais rápido na meta. Quer ver antes de
            publicar a sua?
          </Text>

          <ScrollView style={styles.lista}>
            {similares.map((p) => (
              <TouchableOpacity key={p.id} style={styles.item} onPress={() => onVerProposta(p)}>
                <View style={styles.itemCorpo}>
                  <Text style={styles.itemTitulo} numberOfLines={2}>
                    {p.titulo}
                  </Text>
                  <View style={styles.itemInfo}>
                    <StatusBadge status={p.status} />
                    <Text style={styles.itemApoios}>{p.totalApoios} apoios</Text>
                  </View>
                </View>
                {p.similaridade > 0 && (
                  <Text style={styles.percentual}>{Math.round(p.similaridade * 100)}%</Text>
                )}
                <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <PrimaryButton
            label="Publicar a minha mesmo assim"
            variant="outline"
            onPress={onPublicarMesmoAssim}
            loading={publicando}
          />
          <TouchableOpacity onPress={onFechar} style={styles.cancelar} disabled={publicando}>
            <Text style={styles.cancelarTexto}>Voltar e editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    fundo: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
    folha: {
      backgroundColor: COLORS.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: SPACING.xl,
      gap: SPACING.md,
      maxHeight: '85%',
    },
    icone: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.secondary + '26',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    titulo: {
      fontFamily: FONTS.title,
      fontSize: FONTS.sizes.lg,
      color: COLORS.textPrimary,
      textAlign: 'center',
    },
    texto: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    lista: { flexGrow: 0 },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    itemCorpo: { flex: 1, gap: 6 },
    itemTitulo: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
    itemInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    itemApoios: { fontFamily: FONTS.regular, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
    percentual: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm, color: COLORS.secondaryDark },
    cancelar: { alignItems: 'center', paddingVertical: SPACING.sm },
    cancelarTexto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  });
