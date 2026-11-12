import React, { useEffect } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { DURACAO_MAXIMA_MS, useGravadorAudio } from '../hooks/useGravadorAudio';
import { formatarDuracao } from '../utils/dateUtils';

export default function GravadorAudio({ onTranscrever, transcrevendo }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const gravador = useGravadorAudio();
  const { gravando, duracaoMs, parar } = gravador;

  useEffect(() => {
    if (gravando && duracaoMs >= DURACAO_MAXIMA_MS) parar();
  }, [gravando, duracaoMs, parar]);

  const handleGravar = async () => {
    if (gravando) {
      await parar();
      return;
    }
    const permitido = await gravador.iniciar();
    if (!permitido) {
      Alert.alert('Microfone bloqueado', 'Permita o uso do microfone para gravar sua proposta.', [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instrucao}>
        {gravando
          ? 'Gravando... conte o problema e onde ele fica.'
          : gravador.uri
            ? 'Ouça a gravação e envie para transformar em texto.'
            : 'Toque no microfone e fale com calma. Você pode gravar até 2 minutos.'}
      </Text>

      <TouchableOpacity
        style={[styles.botaoMic, gravando && styles.botaoGravando]}
        onPress={handleGravar}
        disabled={transcrevendo}
        accessibilityRole="button"
        accessibilityLabel={gravando ? 'Parar gravação' : 'Começar gravação'}
      >
        <Feather name={gravando ? 'square' : 'mic'} size={34} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={[styles.tempo, gravando && { color: COLORS.critical }]}>
        {formatarDuracao(duracaoMs)} / {formatarDuracao(DURACAO_MAXIMA_MS)}
      </Text>

      {!!gravador.uri && !gravando && (
        <View style={styles.acoes}>
          <View style={styles.linha}>
            <PrimaryButton
              label={gravador.reproduzindo ? 'Pausar' : 'Ouvir'}
              icon={gravador.reproduzindo ? 'pause' : 'play'}
              variant="ghost"
              small
              onPress={gravador.alternarReproducao}
              style={styles.flex}
            />
            <PrimaryButton
              label="Descartar"
              icon="trash-2"
              variant="ghost"
              small
              onPress={gravador.descartar}
              disabled={transcrevendo}
              style={styles.flex}
            />
          </View>
          <PrimaryButton
            label="Transformar em texto"
            icon="file-text"
            variant="secondary"
            loading={transcrevendo}
            onPress={() => onTranscrever(gravador.uri)}
          />
        </View>
      )}
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.xl,
      gap: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    instrucao: {
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    botaoMic: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: COLORS.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    botaoGravando: { backgroundColor: COLORS.critical },
    tempo: { fontFamily: FONTS.subtitle, fontSize: FONTS.sizes.lg, color: COLORS.textPrimary },
    acoes: { width: '100%', gap: SPACING.sm },
    linha: { flexDirection: 'row', gap: SPACING.sm },
    flex: { flex: 1 },
  });
