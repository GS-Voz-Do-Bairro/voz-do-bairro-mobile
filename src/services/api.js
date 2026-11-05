import axios from 'axios';
import { API_URL, APOIOS_API_URL, REQUEST_TIMEOUT_MS, USE_MOCK } from '../config/env';
import { lerToken } from './tokenStorage';
import { mockAdapter } from './mock/mockAdapter';

let onSessaoExpirada = null;
export function registrarHandlerSessaoExpirada(handler) {
  onSessaoExpirada = handler;
}

function criarCliente(baseURL) {
  const cliente = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...(USE_MOCK ? { adapter: mockAdapter } : {}),
  });

  cliente.interceptors.request.use(async (config) => {
    const token = await lerToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  cliente.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const rotaDeAuth = error.config?.url?.startsWith('/auth/');
      if (status === 401 && !rotaDeAuth && onSessaoExpirada) onSessaoExpirada();

      if (__DEV__) {
        if (error.response) console.warn('[API]', status, error.config?.url, error.response.data);
        else console.warn('[API] Sem resposta do servidor:', error.config?.baseURL, error.message);
      }
      return Promise.reject(error);
    },
  );

  return cliente;
}

export const api = criarCliente(API_URL);
export const apoiosApi = criarCliente(APOIOS_API_URL);

export function extrairLista(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export default api;
