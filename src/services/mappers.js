function primeiro(...valores) {
  return valores.find((v) => v !== undefined && v !== null);
}

const normalizarPapel = (papel) =>
  String(papel ?? 'CIDADAO')
    .replace('ROLE_', '')
    .toUpperCase();

export function mapUsuario(data) {
  if (!data) return null;
  return {
    id: data.id,
    nome: data.nome ?? '',
    email: data.email ?? '',
    papel: normalizarPapel(data.papel),
    bairroId: data.bairroId ?? null,
    bairroNome: data.bairroNome ?? '',
  };
}

export function mapLogin(data) {
  return {
    token: data?.token,
    expiraEm: data?.expiraEm ?? null,
    usuario: mapUsuario(data?.usuario),
  };
}

export function mapBairro(data) {
  return {
    id: data.id,
    nome: data.nome ?? '',
    subprefeitura: data.subprefeitura ?? '',
    cidade: data.cidade ?? '',
    metaApoiosPadrao: data.metaApoiosPadrao ?? null,
  };
}

/** Formulário de bairro → BairroRequest (API .NET). */
export function bairroParaApi({ nome, subprefeitura, cidade, metaApoiosPadrao }) {
  return {
    nome: nome.trim(),
    subprefeitura: subprefeitura.trim(),
    cidade: cidade?.trim() || null,
    metaApoiosPadrao: metaApoiosPadrao ? Number(metaApoiosPadrao) : null,
  };
}

export function mapResposta(data) {
  if (!data) return null;
  return {
    id: data.id,
    decisao: data.decisao,
    justificativa: data.justificativa ?? '',
    prazoExecucao: data.prazoExecucao ?? null,
    gestorNome: data.gestorNome ?? '',
    respondidaEm: data.dtResposta ?? null,
    statusProposta: data.statusProposta ?? null,
  };
}

export function mapProposta(data) {
  if (!data) return null;
  const resposta = mapResposta(data.resposta);
  return {
    id: data.id,
    titulo: data.titulo ?? '',
    descricao: data.descricao ?? '',
    categoria: data.categoria ?? 'OUTROS',
    status: data.status ?? 'ABERTA',
    resumoIa: data.resumoIa ?? null,
    metaApoios: Number(data.metaApoios ?? 0),
    totalApoios: Number(data.totalApoios ?? 0),
    autorId: data.autorId,
    autorNome: data.autorNome ?? '',
    bairroId: data.bairroId,
    bairroNome: data.bairroNome ?? '',
    criadaEm: data.dtCriacao ?? null,
    virouDemandaEm: data.dtVirouDemanda ?? null,
    prazoResposta: data.prazoResposta ?? null,
    totalComentarios: data.totalComentarios ?? null,
    resposta: resposta ? { ...resposta, cumprida: data.status === 'CONCLUIDA' } : null,
  };
}

export function propostaParaApi({ titulo, descricao, categoria, bairroId }) {
  return {
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    categoria,
    bairroId,
  };
}

export function respostaParaApi({ decisao, justificativa, prazoExecucao }) {
  return {
    decisao,
    justificativa: justificativa.trim(),
    prazoExecucao: decisao === 'ACEITA' ? prazoExecucao : null,
  };
}

export function mapRascunho(data) {
  return {
    sugestaoDecisao: data?.sugestaoDecisao ?? null,
    justificativa: data?.justificativa ?? '',
    pontosDeAtencao: Array.isArray(data?.pontosDeAtencao) ? data.pontosDeAtencao : [],
    geradoPorIa: !!data?.geradoPorIa,
    aviso: data?.aviso ?? '',
  };
}

export function mapPlacar(data) {
  const porStatus = data?.porStatus ?? {};
  const conta = (status) => Number(porStatus[status] ?? 0);
  return {
    bairroId: data.bairroId,
    bairroNome: data.bairroNome ?? '',
    total: Number(data.totalPropostas ?? 0),
    recebendoApoios: conta('ABERTA'),
    aguardando: conta('DEMANDA'),
    atrasadas: conta('ATRASADA'),
    emExecucao: conta('EM_EXECUCAO'),
    concluidas: conta('CONCLUIDA'),
    recusadas: conta('RECUSADA'),
    respondidas: Number(data.demandasRespondidas ?? 0),
    respondidasNoPrazo: Number(data.demandasRespondidasNoPrazo ?? 0),
    vencidasSemResposta: Number(data.demandasVencidasSemResposta ?? 0),
    percentualNoPrazo: data.percentualRespondidasNoPrazo ?? null,
  };
}

export function mapNotificacao(data) {
  return {
    id: data.id,
    propostaId: data.propostaId ?? null,
    mensagem: data.mensagem ?? '',
    lida: !!data.lida,
    criadaEm: data.dtCriacao ?? null,
  };
}

// API .NET

/** ComentarioResponse. */
export function mapComentario(data) {
  return {
    id: data.id,
    texto: data.texto ?? '',
    autorId: data.usuarioId,
    autorNome: data.autorNome ?? '',
    criadoEm: data.dtCriacao ?? null,
    editado: !!data.dtEdicao,
  };
}

/** ApoioResponse (depois de apoiar). */
export function mapApoio(data) {
  return {
    propostaId: data?.propostaId,
    totalApoios: Number(data?.totalApoios ?? 0),
    metaApoios: Number(data?.metaApoios ?? 0),
    status: data?.statusProposta ?? null,
    virouDemanda: !!data?.virouDemanda,
    prazoResposta: data?.prazoResposta ?? null,
  };
}

/** ResumoApoiosResponse. usuarioApoiou vem null sem token. */
export function mapResumoApoios(data) {
  return {
    totalApoios: Number(data?.totalApoios ?? 0),
    metaApoios: Number(data?.metaApoios ?? 0),
    percentual: Number(data?.percentual ?? 0),
    status: data?.status ?? null,
    usuarioApoiou: !!data?.usuarioApoiou,
  };
}

/** MeuApoioResponse. */
export function mapMeuApoio(data) {
  return {
    propostaId: data.propostaId,
    titulo: data.tituloProposta ?? '',
    status: data.statusProposta ?? 'ABERTA',
    totalApoios: Number(data.totalApoios ?? 0),
    metaApoios: Number(data.metaApoios ?? 0),
    apoiadoEm: data.dtApoio ?? null,
  };
}

// Serviço de IA

export function mapSimilar(data) {
  return {
    ...mapProposta(data.proposta ?? data),
    similaridade: Number(primeiro(data.similaridade, data.score, 0)),
  };
}

export function mapTranscricao(data) {
  return {
    transcricao: primeiro(data.transcricao, data.texto, ''),
    titulo: primeiro(data.tituloSugerido, data.titulo, ''),
    descricao: primeiro(data.descricaoSugerida, data.descricao, data.transcricao, ''),
    categoria: primeiro(data.categoriaSugerida, data.categoria, null),
  };
}
