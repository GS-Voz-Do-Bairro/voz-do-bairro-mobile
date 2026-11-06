import React, { useMemo } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingOverlay from '../components/LoadingOverlay';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

export default function Routes() {
  const { isAuthenticated, carregandoSessao } = useAuth();
  const { colors, isDark } = useTheme();

  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.secondary,
      },
    };
  }, [colors, isDark]);

  if (carregandoSessao) {
    return <LoadingOverlay mensagem="Abrindo o Voz do Bairro..." />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isAuthenticated || isDark ? 'light' : 'dark'} />
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
