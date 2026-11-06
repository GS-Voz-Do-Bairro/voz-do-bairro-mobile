import { apoiosApi } from './api';
import { ENDPOINTS } from './endpoints';
import { gerarChaveIdempotencia } from '../utils/idempotencia';

const TENTATIVAS = 2;

function erroDeRede(error) {
  return !error.response;
}

async function comReenvio(requisicao) {
  const chave = gerarChaveIdempotencia();
  let ultimoErro;
  for (let i = 0; i < TENTATIVAS; i += 1) {
    try {
      return await requisicao(chave);
    } catch (error) {
      ultimoErro = error;
      if (!erroDeRede(error)) break;
    }
  }
  throw ultimoErro;
}

export const apoiosService = {
  apoiar: (propostaId) =>
    comReenvio((chave) =>
      apoiosApi.post(ENDPOINTS.apoios.apoiar, { propostaId }, { headers: { 'Idempotency-Key': chave } }),
    ),

  retirar: (propostaId) =>
    comReenvio((chave) =>
      apoiosApi.delete(ENDPOINTS.apoios.retirar(propostaId), { headers: { 'Idempotency-Key': chave } }),
    ),

  situacao: async (propostaId) => {
    const { data } = await apoiosApi.get(ENDPOINTS.apoios.situacao(propostaId));
    return {
      apoiada: !!(data?.apoiada ?? data?.apoiadaPorMim),
      totalApoios: Number(data?.totalApoios ?? data?.total ?? 0),
    };
  },
};

export default apoiosService;
