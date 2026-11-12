import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

const STORAGE_KEY = '@vozdobairro:tema';
export const THEME_PREFERENCES = ['system', 'light', 'dark'];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved && THEME_PREFERENCES.includes(saved)) setPreferenceState(saved);
      })
      .catch(() => {});
  }, []);

  const setPreference = useCallback(async (nova) => {
    setPreferenceState(nova);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nova);
    } catch {
      // ignora
    }
  }, []);

  const mode = preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      preference,
      setPreference,
      colors: mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
    }),
    [mode, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>.');
  return ctx;
}

export default ThemeContext;
