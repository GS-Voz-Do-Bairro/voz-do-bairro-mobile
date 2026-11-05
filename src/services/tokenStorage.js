import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'vozdobairro.token';
const USUARIO_KEY = '@vozdobairro:usuario';

const usarSecureStore = Platform.OS !== 'web';

export async function salvarToken(token) {
  if (usarSecureStore) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function lerToken() {
  return usarSecureStore ? SecureStore.getItemAsync(TOKEN_KEY) : AsyncStorage.getItem(TOKEN_KEY);
}

export async function salvarUsuario(usuario) {
  await AsyncStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export async function lerUsuario() {
  const raw = await AsyncStorage.getItem(USUARIO_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function limparSessao() {
  if (usarSecureStore) await SecureStore.deleteItemAsync(TOKEN_KEY);
  else await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USUARIO_KEY);
}
