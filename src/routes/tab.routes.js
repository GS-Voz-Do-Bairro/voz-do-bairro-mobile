import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Feed from '../screens/propostas/Feed';
import Placar from '../screens/placar/Placar';
import Perfil from '../screens/perfil/Perfil';
import PainelGestor from '../screens/gestor/PainelGestor';
import { FONTS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import useThemedStyles from '../hooks/useThemedStyles';

const Tab = createBottomTabNavigator();

const ICONES = {
  Painel: 'briefcase',
  Propostas: 'message-circle',
  Placar: 'bar-chart-2',
  Perfil: 'user',
};

export default function TabRoutes() {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { isGestor } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [styles.tabBar, { height: 64 + insets.bottom, paddingBottom: 10 + insets.bottom }],
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Feather name={ICONES[route.name] ?? 'circle'} size={20} color={color} />
          </View>
        ),
      })}
    >
      {isGestor && <Tab.Screen name="Painel" component={PainelGestor} />}
      <Tab.Screen name="Propostas" component={Feed} />
      <Tab.Screen name="Placar" component={Placar} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: COLORS.surface,
      borderTopColor: COLORS.border,
      borderTopWidth: 1,
      paddingTop: 8,
    },
    tabLabel: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.xs,
    },
    iconWrapper: {
      width: 40,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
    iconWrapperActive: {
      backgroundColor: COLORS.primarySoft,
    },
  });
