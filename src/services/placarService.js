import api, { extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapPlacar } from './mappers';

export const placarService = {
  geral: async () => {
    const { data } = await api.get(ENDPOINTS.placar.geral);
    return extrairLista(data).map(mapPlacar);
  },

  doBairro: async (bairroId) => {
    const { data } = await api.get(ENDPOINTS.placar.doBairro(bairroId));
    return mapPlacar(data);
  },
};

export default placarService;
