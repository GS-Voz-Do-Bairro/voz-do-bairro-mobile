import { Platform } from 'react-native';
import api, { extrairLista, iaApi } from './api';
import { ENDPOINTS } from './endpoints';
import { mapProposta, mapSimilar, mapTranscricao, propostaParaApi } from './mappers';
import { IA_TIMEOUT_MS } from '../config/env';
import { similaridade } from '../utils/similaridade';

const TAMANHO_PAGINA = 100;
const SIMILARIDADE_MINIMA = 0.4;
const STATUS_EM_ANDAMENTO = ['ABERTA', 'DEMANDA', 'ATRASADA', 'EM_EXECUCAO'];

export const propostasService = {
  listar: async ({ bairroId, status, categoria } = {}) => {
    const params = { bairroId, status, categoria, page: 0, size: TAMANHO_PAGINA, sort: 'dtCriacao,desc' };
    const { data } = await api.get(ENDPOINTS.propostas.listar, { params });
    return extrairLista(data).map(mapProposta);
  },

  minhas: async () => {
    const params = { page: 0, size: TAMANHO_PAGINA, sort: 'dtCriacao,desc' };
    const { data } = await api.get(ENDPOINTS.propostas.minhas, { params });
    return extrairLista(data).map(mapProposta);
  },

  buscarPorId: async (id) => {
    const { data } = await api.get(ENDPOINTS.propostas.porId(id));
    return mapProposta(data);
  },

  criar: async (dados) => {
    const { data } = await api.post(ENDPOINTS.propostas.listar, propostaParaApi(dados));
    return mapProposta(data);
  },

  atualizar: async (id, dados) => {
    const { data } = await api.put(ENDPOINTS.propostas.porId(id), propostaParaApi(dados));
    return mapProposta(data);
  },

  remover: (id) => api.delete(ENDPOINTS.propostas.porId(id)),

  concluir: async (id) => {
    const { data } = await api.patch(ENDPOINTS.propostas.concluir(id));
    return mapProposta(data);
  },

  buscarSimilares: async ({ titulo, descricao, bairroId }) => {
    if (iaApi) {
      const { data } = await iaApi.post(ENDPOINTS.ia.similares, { titulo, descricao, bairroId });
      return extrairLista(data).map(mapSimilar);
    }
    const doBairro = await propostasService.listar({ bairroId });
    const texto = `${titulo} ${descricao}`;
    return doBairro
      .filter((p) => STATUS_EM_ANDAMENTO.includes(p.status))
      .map((p) => ({ ...p, similaridade: similaridade(texto, `${p.titulo} ${p.descricao}`) }))
      .filter((p) => p.similaridade >= SIMILARIDADE_MINIMA)
      .sort((a, b) => b.similaridade - a.similaridade)
      .slice(0, 3);
  },

  transcreverAudio: async (uri) => {
    if (!iaApi) throw new Error('Serviço de transcrição não configurado.');
    const formData = new FormData();
    if (Platform.OS === 'web') {
      const blob = await (await fetch(uri)).blob();
      formData.append('audio', blob, 'proposta.webm');
    } else {
      formData.append('audio', { uri, name: 'proposta.m4a', type: 'audio/m4a' });
    }
    const { data } = await iaApi.post(ENDPOINTS.ia.transcricao, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: IA_TIMEOUT_MS,
    });
    return mapTranscricao(data);
  },
};

export default propostasService;
