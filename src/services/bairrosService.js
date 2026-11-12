import { dotnetApi, extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { bairroParaApi, mapBairro } from './mappers';

export const bairrosService = {
  listar: async () => {
    const { data } = await dotnetApi.get(ENDPOINTS.bairros.listar);
    return extrairLista(data).map(mapBairro);
  },

  buscarPorId: async (id) => {
    const { data } = await dotnetApi.get(ENDPOINTS.bairros.porId(id));
    return mapBairro(data);
  },

  criar: async (dados) => {
    const { data } = await dotnetApi.post(ENDPOINTS.bairros.listar, bairroParaApi(dados));
    return mapBairro(data);
  },

  atualizar: async (id, dados) => {
    const { data } = await dotnetApi.put(ENDPOINTS.bairros.porId(id), bairroParaApi(dados));
    return mapBairro(data);
  },

  remover: (id) => dotnetApi.delete(ENDPOINTS.bairros.porId(id)),
};

export default bairrosService;
