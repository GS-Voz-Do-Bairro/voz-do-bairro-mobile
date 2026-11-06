import React from 'react';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './src/services/queryClient';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { FONT_FILES } from './src/constants/theme';
import Routes from './src/routes';

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts(FONT_FILES);

  if (!fontesCarregadas && !erroFontes) return null;

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <Routes />
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
