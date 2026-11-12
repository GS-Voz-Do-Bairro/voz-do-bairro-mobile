export function gerarChaveIdempotencia() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const TENTATIVAS = 2;

/**
 * Executa a requisição com um Idempotency-Key. Se a rede cair sem resposta,
 * tenta de novo com a MESMA chave, e a API devolve o resultado da primeira vez.
 */
export async function comIdempotencia(requisicao) {
  const chave = gerarChaveIdempotencia();
  let ultimoErro;
  for (let i = 0; i < TENTATIVAS; i += 1) {
    try {
      return await requisicao({ 'Idempotency-Key': chave });
    } catch (error) {
      ultimoErro = error;
      if (error.response) break;
    }
  }
  throw ultimoErro;
}
