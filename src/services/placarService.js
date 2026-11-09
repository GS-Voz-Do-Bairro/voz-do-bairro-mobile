import api from './api';
import { ENDPOINTS } from './endpoints';
import { mapPlacar } from './mappers';
import { bairrosService } from './bairrosService';

export const placarService = {
  doBairro: async (bairroId) => {
    const { data } = await api.get(ENDPOINTS.placar.doBairro(bairroId));
    return mapPlacar(data);
  },

  geral: async () => {
    const bairros = await bairrosService.listar();
    const resultados = await Promise.allSettled(bairros.map((b) => placarService.doBairro(b.id)));
    return resultados.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  },
};

export default placarService;
