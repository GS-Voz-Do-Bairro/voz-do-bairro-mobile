import api, { extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapComentario } from './mappers';

export const comentariosService = {
  listar: async (propostaId) => {
    const { data } = await api.get(ENDPOINTS.comentarios.daProposta(propostaId));
    return extrairLista(data).map(mapComentario);
  },

  criar: async (propostaId, texto) => {
    const { data } = await api.post(ENDPOINTS.comentarios.daProposta(propostaId), { texto: texto.trim() });
    return mapComentario(data);
  },

  atualizar: async (id, texto) => {
    const { data } = await api.put(ENDPOINTS.comentarios.porId(id), { texto: texto.trim() });
    return mapComentario(data);
  },

  remover: (id) => api.delete(ENDPOINTS.comentarios.porId(id)),
};

export default comentariosService;
