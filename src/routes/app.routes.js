import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabRoutes from './tab.routes';
import PropostaDetalhe from '../screens/propostas/PropostaDetalhe';
import PropostaForm from '../screens/propostas/PropostaForm';
import ResponderDemanda from '../screens/gestor/ResponderDemanda';
import MinhasPropostas from '../screens/perfil/MinhasPropostas';
import SobreApp from '../screens/perfil/SobreApp';
import Notificacoes from '../screens/perfil/Notificacoes';
import MeusApoios from '../screens/perfil/MeusApoios';
import GerenciarBairros from '../screens/bairros/GerenciarBairros';
import BairroForm from '../screens/bairros/BairroForm';
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
      <Stack.Screen name="Notificacoes" component={Notificacoes} />
      {isGestor ? (
        <>
          <Stack.Screen name="ResponderDemanda" component={ResponderDemanda} />
          <Stack.Screen name="GerenciarBairros" component={GerenciarBairros} />
          <Stack.Screen name="BairroForm" component={BairroForm} />
        </>
      ) : (
        <>
          <Stack.Screen name="PropostaForm" component={PropostaForm} />
          <Stack.Screen name="MinhasPropostas" component={MinhasPropostas} />
          <Stack.Screen name="MeusApoios" component={MeusApoios} />
        </>
      )}
    </Stack.Navigator>
  );
}
