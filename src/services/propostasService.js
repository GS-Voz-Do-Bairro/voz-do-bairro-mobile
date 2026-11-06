import { Platform } from 'react-native';
import api, { extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapProposta, mapSimilar, mapTranscricao, propostaParaApi } from './mappers';
import { UPLOAD_TIMEOUT_MS } from '../config/env';

export const propostasService = {
  listar: async ({ bairroId, status, categoria, busca, page = 0, size = 50 } = {}) => {
    const params = { bairroId, status, categoria, busca: busca || undefined, page, size };
    const { data } = await api.get(ENDPOINTS.propostas.listar, { params });
    return extrairLista(data).map(mapProposta);
  },

  minhas: async () => {
    const { data } = await api.get(ENDPOINTS.propostas.minhas);
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

  buscarSimilares: async ({ titulo, descricao, bairroId }) => {
    const { data } = await api.post(ENDPOINTS.propostas.similares, { titulo, descricao, bairroId });
    return extrairLista(data).map(mapSimilar);
  },

  transcreverAudio: async (uri) => {
    const formData = new FormData();
    if (Platform.OS === 'web') {
      const blob = await (await fetch(uri)).blob();
      formData.append('audio', blob, 'proposta.webm');
    } else {
      formData.append('audio', { uri, name: 'proposta.m4a', type: 'audio/m4a' });
    }
    const { data } = await api.post(ENDPOINTS.propostas.transcricao, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: UPLOAD_TIMEOUT_MS,
    });
    return mapTranscricao(data);
  },
};

export default propostasService;
