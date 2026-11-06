const URL_PADRAO = 'http://10.0.2.2:8080/api';

function limpar(url) {
  return url ? url.replace(/\/+$/, '') : '';
}

export const API_URL = limpar(process.env.EXPO_PUBLIC_API_URL) || URL_PADRAO;

export const APOIOS_API_URL = limpar(process.env.EXPO_PUBLIC_APOIOS_API_URL) || API_URL;

export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export const REQUEST_TIMEOUT_MS = 30000;

export const UPLOAD_TIMEOUT_MS = 90000;
