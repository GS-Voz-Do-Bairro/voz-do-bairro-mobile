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
    id: primeiro(data.id, data.usuarioId),
    nome: primeiro(data.nome, data.name, ''),
    email: data.email ?? '',
    papel: normalizarPapel(primeiro(data.papel, data.role, data.perfil)),
    bairroId: primeiro(data.bairroId, data.bairro?.id, null),
    bairroNome: primeiro(data.bairroNome, data.bairro?.nome, ''),
  };
}

export function mapLogin(data) {
  return {
    token: primeiro(data?.token, data?.accessToken, data?.jwt),
    usuario: mapUsuario(data?.usuario ?? data?.user ?? data),
  };
}

export function mapBairro(data) {
  return {
    id: data.id,
    nome: data.nome ?? data.name ?? '',
    cidade: data.cidade ?? '',
  };
}

export function mapResposta(data) {
  if (!data) return null;
  return {
    id: data.id,
    tipo: primeiro(data.tipo, data.decisao),
    justificativa: primeiro(data.justificativa, data.parecer, ''),
    dataPrevista: primeiro(data.dataPrevista, data.prazoExecucao, null),
    gestorNome: primeiro(data.gestorNome, data.gestor?.nome, ''),
    respondidaEm: primeiro(data.respondidaEm, data.criadaEm, data.createdAt, null),
    cumprida: !!primeiro(data.cumprida, data.concluida, false),
  };
}

export function mapProposta(data) {
  if (!data) return null;
  return {
    id: data.id,
    titulo: data.titulo ?? '',
    descricao: data.descricao ?? '',
    categoria: primeiro(data.categoria, 'OUTROS'),
    status: primeiro(data.status, 'ABERTA'),
    origem: primeiro(data.origem, 'TEXTO'),
    bairroId: primeiro(data.bairroId, data.bairro?.id),
    bairroNome: primeiro(data.bairroNome, data.bairro?.nome, ''),
    autorId: primeiro(data.autorId, data.usuarioId, data.autor?.id),
    autorNome: primeiro(data.autorNome, data.usuarioNome, data.autor?.nome, ''),
    totalApoios: Number(primeiro(data.totalApoios, data.apoios, 0)),
    metaApoios: Number(primeiro(data.metaApoios, data.meta, 0)),
    apoiadaPorMim: !!primeiro(data.apoiadaPorMim, data.apoiada, false),
    totalComentarios: Number(primeiro(data.totalComentarios, data.comentarios?.length, 0)),
    resumoIa: primeiro(data.resumoIa, data.resumo, null),
    prazoResposta: primeiro(data.prazoResposta, data.prazo, null),
    criadaEm: primeiro(data.criadaEm, data.dataCriacao, data.createdAt, null),
    resposta: mapResposta(primeiro(data.resposta, data.compromisso, null)),
  };
}

export function propostaParaApi({ titulo, descricao, categoria, bairroId, origem, transcricao }) {
  return {
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    categoria,
    bairroId,
    origem: origem ?? 'TEXTO',
    ...(transcricao ? { transcricao } : {}),
  };
}

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

export function mapComentario(data) {
  return {
    id: data.id,
    texto: primeiro(data.texto, data.conteudo, ''),
    autorId: primeiro(data.autorId, data.usuarioId, data.autor?.id),
    autorNome: primeiro(data.autorNome, data.usuarioNome, data.autor?.nome, ''),
    autorPapel: normalizarPapel(primeiro(data.autorPapel, data.autor?.papel, 'CIDADAO')),
    criadoEm: primeiro(data.criadoEm, data.dataCriacao, data.createdAt, null),
    editado: !!data.editado,
  };
}

export function mapPlacar(data) {
  return {
    bairroId: primeiro(data.bairroId, data.id),
    bairroNome: primeiro(data.bairroNome, data.nome, ''),
    total: Number(primeiro(data.total, data.totalPropostas, 0)),
    recebendoApoios: Number(primeiro(data.recebendoApoios, data.abertas, 0)),
    aguardando: Number(primeiro(data.aguardando, data.demandas, data.emPrazo, 0)),
    atendidas: Number(primeiro(data.atendidas, 0)),
    atrasadas: Number(primeiro(data.atrasadas, 0)),
    ignoradas: Number(primeiro(data.ignoradas, 0)),
    recusadas: Number(primeiro(data.recusadas, 0)),
    taxaAtendimento: Number(primeiro(data.taxaAtendimento, 0)),
  };
}
