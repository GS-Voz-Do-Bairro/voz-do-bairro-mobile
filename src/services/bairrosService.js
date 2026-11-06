import api, { extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapBairro } from './mappers';

export const bairrosService = {
  listar: async () => {
    const { data } = await api.get(ENDPOINTS.bairros.listar);
    return extrairLista(data).map(mapBairro);
  },
};

export default bairrosService;
