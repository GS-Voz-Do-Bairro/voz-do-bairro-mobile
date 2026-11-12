import { dotnetApi, extrairLista } from './api';
import { ENDPOINTS } from './endpoints';
import { mapApoio, mapMeuApoio, mapResumoApoios } from './mappers';
import { comIdempotencia } from '../utils/idempotencia';

export const apoiosService = {
  apoiar: async (propostaId) => {
    const { data } = await comIdempotencia((headers) =>
      dotnetApi.post(ENDPOINTS.apoios.daProposta(propostaId), null, { headers }),
    );
    return mapApoio(data);
  },

  retirar: (propostaId) => dotnetApi.delete(ENDPOINTS.apoios.daProposta(propostaId)),

  resumo: async (propostaId) => {
    const { data } = await dotnetApi.get(ENDPOINTS.apoios.resumo(propostaId));
    return mapResumoApoios(data);
  },

  meus: async () => {
    const { data } = await dotnetApi.get(ENDPOINTS.apoios.meus, { params: { page: 1, pageSize: 50 } });
    return extrairLista(data).map(mapMeuApoio);
  },
};

export default apoiosService;
