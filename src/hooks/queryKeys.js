export const queryKeys = {
  bairros: ['bairros'],
  propostas: (filtros = {}) => ['propostas', filtros],
  todasPropostas: ['propostas'],
  minhasPropostas: ['propostas', 'minhas'],
  proposta: (id) => ['proposta', id],
  comentarios: (propostaId) => ['comentarios', propostaId],
  demandas: (filtros = {}) => ['demandas', filtros],
  todasDemandas: ['demandas'],
  placar: (bairroId) => ['placar', bairroId],
  placarGeral: ['placar', 'geral'],
};
