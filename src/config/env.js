const JAVA_PADRAO = 'https://voz-do-bairro-java.onrender.com/api';

function limpar(url) {
  return url ? url.replace(/\/+$/, '') : '';
}

export const API_URL = limpar(process.env.EXPO_PUBLIC_API_URL) || JAVA_PADRAO;

export const IA_API_URL = limpar(process.env.EXPO_PUBLIC_IA_API_URL);

export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

// o plano gratuito do Render hiberna e a primeira chamada pode levar quase 1 minuto
export const REQUEST_TIMEOUT_MS = 70000;

export const IA_TIMEOUT_MS = 90000;

export const AUDIO_HABILITADO = USE_MOCK || !!IA_API_URL;

/** URL da API sem o /api do final (usada no health check). */
export function semPrefixoApi(url) {
  return url.replace(/\/api$/, '');
}
