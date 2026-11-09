import api from './api';
import { ENDPOINTS } from './endpoints';
import { propostasService } from './propostasService';
import { mapRascunho, mapResposta, respostaParaApi } from './mappers';
import { IA_TIMEOUT_MS } from '../config/env';

const STATUS_DO_PAINEL = ['DEMANDA', 'ATRASADA', 'EM_EXECUCAO'];

export const demandasService = {
  listar: async ({ bairroId } = {}) => {
    const listas = await Promise.all(
      STATUS_DO_PAINEL.map((status) => propostasService.listar({ bairroId, status })),
    );
    return listas
      .flat()
      .sort((a, b) => String(a.prazoResposta ?? '9').localeCompare(String(b.prazoResposta ?? '9')));
  },

  responder: async (propostaId, resposta) => {
    const { data } = await api.post(ENDPOINTS.respostas.daProposta(propostaId), respostaParaApi(resposta));
    return mapResposta(data);
  },

  gerarRascunho: async (propostaId) => {
    const { data } = await api.post(ENDPOINTS.respostas.rascunhoIa(propostaId), null, {
      timeout: IA_TIMEOUT_MS,
    });
    return mapRascunho(data);
  },

  concluir: (propostaId) => propostasService.concluir(propostaId),
};

export default demandasService;
