import axios from 'axios';
import { API_URL, DOTNET_API_URL, USE_MOCK, semPrefixoApi } from '../config/env';

const TIMEOUT_MS = 70000;

async function verificar(url) {
  if (USE_MOCK) return { online: true, detalhe: 'Dados de exemplo' };
  const inicio = Date.now();
  try {
    const { data } = await axios.get(url, { timeout: TIMEOUT_MS });
    const status = data?.status ?? 'UP';
    return {
      online: ['UP', 'Healthy', 'Degraded'].includes(status),
      detalhe: `${status} · ${Date.now() - inicio} ms`,
    };
  } catch (error) {
    // o health da .NET responde 503 quando algum componente está fora
    const status = error.response?.data?.status;
    return {
      online: false,
      detalhe: status ?? (error.response ? `HTTP ${error.response.status}` : 'sem resposta'),
    };
  }
}

export const saudeService = {
  java: () => verificar(`${semPrefixoApi(API_URL)}/actuator/health`),
  dotnet: () => verificar(`${semPrefixoApi(DOTNET_API_URL)}/health`),
};

export default saudeService;
