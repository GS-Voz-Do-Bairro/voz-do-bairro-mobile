export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    registro: '/auth/registro',
    me: '/auth/me',
  },

  bairros: {
    listar: '/bairros',
  },

  propostas: {
    listar: '/propostas', // ?bairroId&status&categoria&busca&page&size
    minhas: '/propostas/minhas',
    porId: (id) => `/propostas/${id}`,
    similares: '/propostas/similares',
    transcricao: '/propostas/transcricao',
  },

  comentarios: {
    daProposta: (propostaId) => `/propostas/${propostaId}/comentarios`,
    porId: (id) => `/comentarios/${id}`,
  },

  // API .NET
  apoios: {
    apoiar: '/apoios',
    retirar: (propostaId) => `/apoios/${propostaId}`,
    situacao: (propostaId) => `/apoios/${propostaId}/situacao`,
  },

  demandas: {
    listar: '/demandas', // ?bairroId&status
    resposta: (propostaId) => `/demandas/${propostaId}/resposta`,
    rascunho: (propostaId) => `/demandas/${propostaId}/rascunho`,
    concluir: (propostaId) => `/demandas/${propostaId}/concluir`,
  },

  placar: {
    geral: '/placar',
    doBairro: (bairroId) => `/placar/${bairroId}`,
  },
};

export default ENDPOINTS;
