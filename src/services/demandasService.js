import api, { extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapProposta, mapResposta } from './mappers';
import { UPLOAD_TIMEOUT_MS } from '../config/env';

export const demandasService = {
  listar: async ({ bairroId, status } = {}) => {
    const { data } = await api.get(ENDPOINTS.demandas.listar, { params: { bairroId, status } });
    return extrairLista(data).map(mapProposta);
  },

  responder: async (propostaId, { tipo, justificativa, dataPrevista }) => {
    const { data } = await api.post(ENDPOINTS.demandas.resposta(propostaId), {
      tipo,
      justificativa: justificativa.trim(),
      dataPrevista: dataPrevista || null,
    });
    return mapResposta(data);
  },

  gerarRascunho: async (propostaId, tipo) => {
    const { data } = await api.post(
      ENDPOINTS.demandas.rascunho(propostaId),
      { tipo },
      { timeout: UPLOAD_TIMEOUT_MS },
    );
    return data?.texto ?? data?.rascunho ?? '';
  },

  concluir: (propostaId) => api.put(ENDPOINTS.demandas.concluir(propostaId)),
};

export default demandasService;
