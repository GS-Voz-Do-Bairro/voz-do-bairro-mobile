export const ENDPOINTS = {
  // API Java
  auth: {
    login: '/auth/login',
    registro: '/auth/register',
  },

  usuarios: {
    me: '/usuarios/me',
  },

  placar: {
    doBairro: (bairroId) => `/bairros/${bairroId}/placar`,
  },

  propostas: {
    listar: '/propostas', // ?bairroId&status&categoria&page&size&sort
    minhas: '/propostas/minhas',
    porId: (id) => `/propostas/${id}`,
    concluir: (id) => `/propostas/${id}/concluir`,
  },

  respostas: {
    daProposta: (propostaId) => `/propostas/${propostaId}/resposta`,
    rascunhoIa: (propostaId) => `/propostas/${propostaId}/resposta/rascunho-ia`,
  },

  notificacoes: {
    listar: '/notificacoes',
    marcarLida: (id) => `/notificacoes/${id}/lida`,
  },

  bairros: {
    listar: '/bairros',
    porId: (id) => `/bairros/${id}`,
  },

  apoios: {
    daProposta: (propostaId) => `/propostas/${propostaId}/apoios`,
  },

  comentarios: {
    daProposta: (propostaId) => `/propostas/${propostaId}/comentarios`,
    porId: (id) => `/comentarios/${id}`,
  },

  // serviço de IA (opcional)
  ia: {
    similares: '/ia/propostas/similares',
    transcricao: '/ia/transcricao',
  },
};

export default ENDPOINTS;
