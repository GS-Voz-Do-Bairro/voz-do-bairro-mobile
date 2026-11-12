import api, { extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapNotificacao } from './mappers';

export const notificacoesService = {
  listar: async () => {
    const { data } = await api.get(ENDPOINTS.notificacoes.listar, { params: { page: 0, size: 50 } });
    return extrairLista(data).map(mapNotificacao);
  },

  marcarComoLida: async (id) => {
    const { data } = await api.patch(ENDPOINTS.notificacoes.marcarLida(id));
    return mapNotificacao(data);
  },
};

export default notificacoesService;
