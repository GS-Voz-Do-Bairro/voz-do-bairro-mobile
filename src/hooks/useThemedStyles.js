import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function useThemedStyles(createStyles) {
  const { colors } = useTheme();
  return useMemo(() => createStyles(colors), [colors, createStyles]);
}
