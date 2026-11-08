import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabRoutes from './tab.routes';
import PropostaDetalhe from '../screens/propostas/PropostaDetalhe';
import PropostaForm from '../screens/propostas/PropostaForm';
import ResponderDemanda from '../screens/gestor/ResponderDemanda';
import MinhasPropostas from '../screens/perfil/MinhasPropostas';
import SobreApp from '../screens/perfil/SobreApp';
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  const { isGestor } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabRoutes} options={{ animation: 'fade' }} />
      <Stack.Screen name="PropostaDetalhe" component={PropostaDetalhe} />
      <Stack.Screen name="SobreApp" component={SobreApp} />
      {isGestor ? (
        <Stack.Screen name="ResponderDemanda" component={ResponderDemanda} />
      ) : (
        <>
          <Stack.Screen name="PropostaForm" component={PropostaForm} />
          <Stack.Screen name="MinhasPropostas" component={MinhasPropostas} />
        </>
      )}
    </Stack.Navigator>
  );
}
