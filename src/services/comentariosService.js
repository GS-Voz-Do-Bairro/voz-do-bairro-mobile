import { dotnetApi, extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapComentario } from './mappers';
import { comIdempotencia } from '../utils/idempotencia';

export const comentariosService = {
  listar: async (propostaId) => {
    const { data } = await dotnetApi.get(ENDPOINTS.comentarios.daProposta(propostaId), {
      params: { page: 1, pageSize: 50 },
    });
    return extrairLista(data).map(mapComentario);
  },

  criar: async (propostaId, texto) => {
    const { data } = await comIdempotencia((headers) =>
      dotnetApi.post(ENDPOINTS.comentarios.daProposta(propostaId), { texto: texto.trim() }, { headers }),
    );
    return mapComentario(data);
  },

  atualizar: async (id, texto) => {
    const { data } = await dotnetApi.put(ENDPOINTS.comentarios.porId(id), { texto: texto.trim() });
    return mapComentario(data);
  },

  remover: (id) => dotnetApi.delete(ENDPOINTS.comentarios.porId(id)),
};

export default comentariosService;
