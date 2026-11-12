import { AxiosError } from 'axios';
import * as db from './dados';
import { similaridade } from '../../utils/similaridade';

const ATRASO_MS = 350;
const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let sequencia = 100;
const novoId = () => (sequencia += 1);
const agora = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

function usuarioDoToken(config) {
  const auth = config.headers?.Authorization || config.headers?.authorization || '';
  const id = Number(String(auth).replace('Bearer mock-', ''));
  return db.usuarios.find((u) => u.id === id) ?? null;
}

const nomeDoBairro = (id) => db.bairros.find((b) => b.id === id)?.nome ?? null;
const nomeDoUsuario = (id) => db.usuarios.find((u) => u.id === id)?.nome ?? '';

function usuarioResponse(u) {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    papel: u.papel,
    bairroId: u.bairroId,
    bairroNome: nomeDoBairro(u.bairroId),
  };
}

function tokenResponse(u) {
  return {
    token: `mock-${u.id}`,
    tipo: 'Bearer',
    expiraEm: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    usuario: { id: u.id, nome: u.nome, email: u.email, papel: u.papel, bairroId: u.bairroId },
  };
}

function propostaResponse(p) {
  return {
    id: p.id,
    titulo: p.titulo,
    descricao: p.descricao,
    categoria: p.categoria,
    status: p.status,
    resumoIa: p.resumoIa ?? null,
    metaApoios: p.metaApoios,
    totalApoios: p.totalApoios,
    autorId: p.autorId,
    autorNome: nomeDoUsuario(p.autorId),
    bairroId: p.bairroId,
    bairroNome: nomeDoBairro(p.bairroId),
    dtCriacao: p.dtCriacao,
    dtVirouDemanda: p.dtVirouDemanda ?? null,
    prazoResposta: p.prazoResposta ?? null,
  };
}

function respostaResponse(p) {
  if (!p.resposta) return null;
  return {
    ...p.resposta,
    propostaId: p.id,
    statusProposta: p.status,
    gestorNome: nomeDoUsuario(p.resposta.gestorId),
  };
}

function detalheResponse(p) {
  return {
    ...propostaResponse(p),
    totalComentarios: db.comentarios.filter((c) => c.propostaId === p.id).length,
    resposta: respostaResponse(p),
  };
}

const pagina = (lista) => ({
  conteudo: lista,
  pagina: 0,
  tamanho: lista.length,
  totalElementos: lista.length,
  totalPaginas: 1,
  primeira: true,
  ultima: true,
});

function erro(config, status, detail, errors) {
  const data = {
    type: 'about:blank',
    title: 'Erro',
    status,
    detail,
    instance: config.url,
    ...(errors ? { errors } : {}),
  };
  return new AxiosError(detail, String(status), config, null, { status, data, headers: {}, config });
}

function buscarProposta(config, id) {
  const p = db.propostas.find((x) => x.id === Number(id));
  if (!p) throw erro(config, 404, `Proposta ${id} não encontrada.`);
  return p;
}

function exigirGestor(config, usuario) {
  if (usuario?.papel !== 'GESTOR') throw erro(config, 403, 'Acesso negado.');
}

function registrarApoio(p) {
  if (p.status === 'ABERTA' && p.totalApoios >= p.metaApoios) {
    p.status = 'DEMANDA';
    p.dtVirouDemanda = agora();
    const prazo = new Date();
    prazo.setDate(prazo.getDate() + db.PRAZO_RESPOSTA_DIAS);
    p.prazoResposta = prazo.toISOString().replace(/\.\d{3}Z$/, 'Z');
    return true;
  }
  return false;
}

function placarDe(bairro) {
  const lista = db.propostas.filter((p) => p.bairroId === bairro.id);
  const porStatus = { ABERTA: 0, DEMANDA: 0, ATRASADA: 0, EM_EXECUCAO: 0, CONCLUIDA: 0, RECUSADA: 0 };
  lista.forEach((p) => {
    porStatus[p.status] += 1;
  });
  const respondidas = lista.filter((p) => p.resposta);
  const noPrazo = respondidas.filter((p) => !p.prazoResposta || p.resposta.dtResposta <= p.prazoResposta);
  const vencidas = porStatus.ATRASADA;
  const base = respondidas.length + vencidas;
  return {
    bairroId: bairro.id,
    bairroNome: bairro.nome,
    totalPropostas: lista.length,
    porStatus,
    demandasRespondidas: respondidas.length,
    demandasRespondidasNoPrazo: noPrazo.length,
    demandasVencidasSemResposta: vencidas,
    percentualRespondidasNoPrazo: base ? Math.round((noPrazo.length * 1000) / base) / 10 : null,
  };
}

function comentarioResponse(c) {
  return {
    id: c.id,
    propostaId: c.propostaId,
    usuarioId: c.usuarioId,
    autorNome: nomeDoUsuario(c.usuarioId),
    texto: c.texto,
    dtCriacao: c.dtCriacao,
    dtEdicao: c.dtEdicao ?? null,
  };
}

const jaApoiou = (usuarioId, propostaId) =>
  db.apoios.some((a) => a.usuarioId === usuarioId && a.propostaId === propostaId);

// paginação no formato da API .NET (página começa em 1)
const paginaNet = (lista) => ({
  itens: lista,
  pagina: 1,
  tamanhoPagina: 50,
  totalItens: lista.length,
  totalPaginas: lista.length ? 1 : 0,
});

function buscarBairro(config, id) {
  const b = db.bairros.find((x) => x.id === Number(id));
  if (!b) throw erro(config, 404, `Bairro ${id} não encontrado.`);
  return b;
}

function dadosBairro(body) {
  return {
    nome: body.nome?.trim(),
    subprefeitura: body.subprefeitura?.trim(),
    cidade: body.cidade?.trim() || 'São Paulo',
    metaApoiosPadrao: body.metaApoiosPadrao ?? 50,
  };
}

function validarBairroUnico(config, body, idAtual) {
  const cidade = body.cidade?.trim() || 'São Paulo';
  const repetido = db.bairros.some(
    (b) =>
      b.id !== idAtual && b.nome.toLowerCase() === body.nome?.trim().toLowerCase() && b.cidade === cidade,
  );
  if (repetido) throw erro(config, 409, 'Já existe um bairro com esse nome nessa cidade.');
}

// Idempotency-Key obrigatório, como na API .NET: a mesma chave devolve a resposta guardada
const respostasGuardadas = new Map();
function comChave(config, usuario, executar) {
  const chave = config.headers?.['Idempotency-Key'];
  if (!chave) throw erro(config, 400, 'O header Idempotency-Key é obrigatório.');
  const id = `${usuario.id}:${chave}`;
  if (respostasGuardadas.has(id)) return respostasGuardadas.get(id);
  const resposta = executar();
  respostasGuardadas.set(id, resposta);
  return resposta;
}

const rotas = [
  // Autenticação e usuário
  [
    'post',
    /^\/auth\/login$/,
    ({ body, config }) => {
      const u = db.usuarios.find((x) => x.email === body.email?.toLowerCase() && x.senha === body.senha);
      if (!u) throw erro(config, 401, 'E-mail ou senha inválidos.');
      return tokenResponse(u);
    },
  ],
  [
    'post',
    /^\/auth\/register$/,
    ({ body, config }) => {
      if (db.usuarios.some((x) => x.email === body.email?.toLowerCase()))
        throw erro(config, 409, 'E-mail já cadastrado.');
      const u = { id: novoId(), ...body, email: body.email.toLowerCase(), papel: 'CIDADAO' };
      db.usuarios.push(u);
      return tokenResponse(u);
    },
  ],
  ['get', /^\/usuarios\/me$/, ({ usuario }) => usuarioResponse(usuario)],

  // Bairros e placar (públicos)
  [
    'get',
    /^\/bairros\/(\d+)\/placar$/,
    ({ match, config }) => {
      const bairro = db.bairros.find((b) => b.id === Number(match[1]));
      if (!bairro) throw erro(config, 404, 'Bairro não encontrado.');
      return placarDe(bairro);
    },
    { publica: true },
  ],

  // Propostas
  [
    'get',
    /^\/propostas$/,
    ({ params }) => {
      let lista = db.propostas;
      if (params.bairroId) lista = lista.filter((p) => p.bairroId === Number(params.bairroId));
      if (params.status) lista = lista.filter((p) => p.status === params.status);
      if (params.categoria) lista = lista.filter((p) => p.categoria === params.categoria);
      return pagina([...lista].sort((a, b) => b.dtCriacao.localeCompare(a.dtCriacao)).map(propostaResponse));
    },
  ],
  [
    'get',
    /^\/propostas\/minhas$/,
    ({ usuario }) => pagina(db.propostas.filter((p) => p.autorId === usuario.id).map(propostaResponse)),
  ],
  ['get', /^\/propostas\/(\d+)$/, ({ match, config }) => detalheResponse(buscarProposta(config, match[1]))],
  [
    'post',
    /^\/propostas$/,
    ({ body, usuario, config }) => {
      if (usuario.papel !== 'CIDADAO') throw erro(config, 403, 'Acesso negado.');
      const bairro = db.bairros.find((b) => b.id === Number(body.bairroId));
      const p = {
        id: novoId(),
        titulo: body.titulo,
        descricao: body.descricao,
        categoria: body.categoria,
        bairroId: bairro?.id,
        status: 'ABERTA',
        autorId: usuario.id,
        metaApoios: bairro?.metaApoiosPadrao ?? 30,
        totalApoios: 0,
        dtCriacao: agora(),
        resumoIa: null,
      };
      db.propostas.push(p);
      setTimeout(() => {
        p.resumoIa = p.descricao.length > 160 ? `${p.descricao.slice(0, 157)}...` : p.descricao;
      }, 4000);
      return propostaResponse(p);
    },
    { status: 201 },
  ],
  [
    'put',
    /^\/propostas\/(\d+)$/,
    ({ match, body, usuario, config }) => {
      const p = buscarProposta(config, match[1]);
      if (p.autorId !== usuario.id) throw erro(config, 403, 'Somente o autor pode editar a proposta.');
      if (p.status !== 'ABERTA')
        throw erro(
          config,
          422,
          `Só é possível editar propostas com status ABERTA (status atual: ${p.status}).`,
        );
      Object.assign(p, { titulo: body.titulo, descricao: body.descricao, categoria: body.categoria });
      return propostaResponse(p);
    },
  ],
  [
    'delete',
    /^\/propostas\/(\d+)$/,
    ({ match, usuario, config }) => {
      const p = buscarProposta(config, match[1]);
      if (usuario.papel !== 'GESTOR') {
        if (p.autorId !== usuario.id)
          throw erro(config, 403, 'Somente o autor ou um gestor pode excluir a proposta.');
        if (p.status !== 'ABERTA')
          throw erro(config, 422, 'O autor só pode excluir propostas com status ABERTA.');
        if (p.totalApoios > 0)
          throw erro(config, 422, 'A proposta já recebeu apoios e não pode mais ser excluída pelo autor.');
      }
      db.propostas.splice(db.propostas.indexOf(p), 1);
      return null;
    },
  ],
  [
    'patch',
    /^\/propostas\/(\d+)\/concluir$/,
    ({ match, usuario, config }) => {
      exigirGestor(config, usuario);
      const p = buscarProposta(config, match[1]);
      if (p.status !== 'EM_EXECUCAO')
        throw erro(config, 422, `Só propostas EM_EXECUCAO podem ser concluídas (status atual: ${p.status}).`);
      p.status = 'CONCLUIDA';
      return propostaResponse(p);
    },
  ],

  // Resposta da prefeitura
  [
    'post',
    /^\/propostas\/(\d+)\/resposta\/rascunho-ia$/,
    ({ match, usuario, config }) => {
      exigirGestor(config, usuario);
      const p = buscarProposta(config, match[1]);
      return {
        propostaId: p.id,
        sugestaoDecisao: 'ACEITA',
        justificativa: `A Prefeitura recebeu a demanda "${p.titulo}" e vai atendê-la. A equipe da subprefeitura fará a vistoria no local e executará o serviço até o prazo informado.`,
        pontosDeAtencao: [
          'Confirmar a viabilidade técnica com a equipe responsável',
          'Verificar o orçamento do trimestre',
        ],
        geradoPorIa: true,
        aviso: 'Rascunho gerado por IA. Revise antes de usar: a decisão é do gestor.',
      };
    },
  ],
  [
    'post',
    /^\/propostas\/(\d+)\/resposta$/,
    ({ match, body, usuario, config }) => {
      exigirGestor(config, usuario);
      const p = buscarProposta(config, match[1]);
      if (p.resposta)
        throw erro(config, 409, 'Esta proposta já foi respondida. Use PUT para editar a resposta.');
      if (!['DEMANDA', 'ATRASADA'].includes(p.status)) {
        throw erro(
          config,
          422,
          `Só é possível responder propostas com status DEMANDA ou ATRASADA (status atual: ${p.status}).`,
        );
      }
      if (body.decisao === 'ACEITA' && !body.prazoExecucao) {
        throw erro(config, 400, 'Um ou mais campos são inválidos.', {
          prazoExecucao: ['é obrigatório quando a decisão é ACEITA'],
        });
      }
      p.status = body.decisao === 'ACEITA' ? 'EM_EXECUCAO' : 'RECUSADA';
      p.resposta = {
        id: novoId(),
        gestorId: usuario.id,
        decisao: body.decisao,
        justificativa: body.justificativa,
        prazoExecucao: body.prazoExecucao ?? null,
        dtResposta: agora(),
      };
      return respostaResponse(p);
    },
    { status: 201 },
  ],

  // Notificações
  [
    'get',
    /^\/notificacoes$/,
    ({ usuario }) =>
      pagina(
        db.notificacoes
          .filter((n) => n.usuarioId === usuario.id)
          .sort((a, b) => b.dtCriacao.localeCompare(a.dtCriacao))
          .map(({ usuarioId: _dono, ...n }) => n),
      ),
  ],
  [
    'patch',
    /^\/notificacoes\/(\d+)\/lida$/,
    ({ match, usuario, config }) => {
      const n = db.notificacoes.find((x) => x.id === Number(match[1]) && x.usuarioId === usuario.id);
      if (!n) throw erro(config, 404, 'Notificação não encontrada.');
      n.lida = true;
      return n;
    },
  ],

  // API .NET: bairros
  [
    'get',
    /^\/bairros$/,
    () => [...db.bairros].sort((a, b) => a.nome.localeCompare(b.nome)),
    { publica: true },
  ],
  ['get', /^\/bairros\/(\d+)$/, ({ match, config }) => buscarBairro(config, match[1]), { publica: true }],
  [
    'post',
    /^\/bairros$/,
    ({ body, usuario, config }) => {
      exigirGestor(config, usuario);
      validarBairroUnico(config, body);
      const b = { id: novoId(), ...dadosBairro(body) };
      db.bairros.push(b);
      return b;
    },
    { status: 201 },
  ],
  [
    'put',
    /^\/bairros\/(\d+)$/,
    ({ match, body, usuario, config }) => {
      exigirGestor(config, usuario);
      const b = buscarBairro(config, match[1]);
      validarBairroUnico(config, body, b.id);
      Object.assign(b, dadosBairro(body));
      return b;
    },
  ],
  [
    'delete',
    /^\/bairros\/(\d+)$/,
    ({ match, usuario, config }) => {
      exigirGestor(config, usuario);
      const b = buscarBairro(config, match[1]);
      const emUso =
        db.propostas.some((p) => p.bairroId === b.id) || db.usuarios.some((u) => u.bairroId === b.id);
      if (emUso) throw erro(config, 409, 'O bairro possui propostas ou usuários vinculados.');
      db.bairros.splice(db.bairros.indexOf(b), 1);
      return null;
    },
  ],

  // API .NET: apoios
  [
    'post',
    /^\/propostas\/(\d+)\/apoios$/,
    ({ match, usuario, config }) =>
      comChave(config, usuario, () => {
        if (usuario.papel !== 'CIDADAO') throw erro(config, 403, 'Acesso negado.');
        const p = buscarProposta(config, match[1]);
        if (p.status !== 'ABERTA') {
          throw erro(config, 422, `A proposta está ${p.status} e não aceita mais apoios.`);
        }
        if (p.autorId === usuario.id) throw erro(config, 422, 'O autor não pode apoiar a própria proposta.');
        if (jaApoiou(usuario.id, p.id)) throw erro(config, 409, 'Você já apoiou esta proposta.');
        const dtApoio = agora();
        db.apoios.push({ usuarioId: usuario.id, propostaId: p.id, dtApoio });
        p.totalApoios += 1;
        const virouDemanda = registrarApoio(p);
        return {
          propostaId: p.id,
          usuarioId: usuario.id,
          dtApoio,
          totalApoios: p.totalApoios,
          metaApoios: p.metaApoios,
          statusProposta: p.status,
          virouDemanda,
          prazoResposta: p.prazoResposta ?? null,
        };
      }),
    { status: 201 },
  ],
  [
    'delete',
    /^\/propostas\/(\d+)\/apoios$/,
    ({ match, usuario, config }) => {
      if (usuario.papel !== 'CIDADAO') throw erro(config, 403, 'Acesso negado.');
      const p = buscarProposta(config, match[1]);
      const i = db.apoios.findIndex((a) => a.usuarioId === usuario.id && a.propostaId === p.id);
      if (i < 0) throw erro(config, 404, 'Você não apoiou esta proposta.');
      if (p.status !== 'ABERTA') {
        throw erro(config, 422, 'A proposta não está mais ABERTA; o apoio passou a ser definitivo.');
      }
      db.apoios.splice(i, 1);
      p.totalApoios -= 1;
      return null;
    },
  ],
  [
    'get',
    /^\/propostas\/(\d+)\/apoios\/resumo$/,
    ({ match, usuario, config }) => {
      const p = buscarProposta(config, match[1]);
      return {
        propostaId: p.id,
        totalApoios: p.totalApoios,
        metaApoios: p.metaApoios,
        percentual: Math.min(100, Math.round((p.totalApoios * 10000) / p.metaApoios) / 100),
        status: p.status,
        usuarioApoiou: usuario ? jaApoiou(usuario.id, p.id) : null,
      };
    },
    { publica: true },
  ],
  [
    'get',
    /^\/usuarios\/me\/apoios$/,
    ({ usuario }) =>
      paginaNet(
        db.apoios
          .filter((a) => a.usuarioId === usuario.id)
          .sort((a, b) => b.dtApoio.localeCompare(a.dtApoio))
          .map((a) => {
            const p = db.propostas.find((x) => x.id === a.propostaId);
            return {
              propostaId: a.propostaId,
              tituloProposta: p?.titulo ?? '',
              statusProposta: p?.status ?? 'ABERTA',
              totalApoios: p?.totalApoios ?? 0,
              metaApoios: p?.metaApoios ?? 0,
              dtApoio: a.dtApoio,
            };
          }),
      ),
  ],

  // API .NET: comentários
  [
    'get',
    /^\/propostas\/(\d+)\/comentarios$/,
    ({ match, config }) => {
      buscarProposta(config, match[1]);
      return paginaNet(
        db.comentarios
          .filter((c) => c.propostaId === Number(match[1]))
          .sort((a, b) => a.dtCriacao.localeCompare(b.dtCriacao))
          .map(comentarioResponse),
      );
    },
    { publica: true },
  ],
  [
    'post',
    /^\/propostas\/(\d+)\/comentarios$/,
    ({ match, body, usuario, config }) =>
      comChave(config, usuario, () => {
        buscarProposta(config, match[1]);
        if (!body.texto?.trim()) {
          throw erro(config, 400, 'Um ou mais campos são inválidos.', { texto: ['não pode ser vazio'] });
        }
        const c = {
          id: novoId(),
          propostaId: Number(match[1]),
          usuarioId: usuario.id,
          texto: body.texto.trim(),
          dtCriacao: agora(),
        };
        db.comentarios.push(c);
        return comentarioResponse(c);
      }),
    { status: 201 },
  ],
  [
    'put',
    /^\/comentarios\/(\d+)$/,
    ({ match, body, usuario, config }) => {
      const c = db.comentarios.find((x) => x.id === Number(match[1]));
      if (!c) throw erro(config, 404, 'Comentário não encontrado.');
      if (c.usuarioId !== usuario.id) throw erro(config, 403, 'Somente o autor pode editar o comentário.');
      c.texto = body.texto;
      c.dtEdicao = agora();
      return comentarioResponse(c);
    },
  ],
  [
    'delete',
    /^\/comentarios\/(\d+)$/,
    ({ match, usuario, config }) => {
      const i = db.comentarios.findIndex((x) => x.id === Number(match[1]));
      if (i < 0) throw erro(config, 404, 'Comentário não encontrado.');
      if (db.comentarios[i].usuarioId !== usuario.id && usuario.papel !== 'GESTOR') {
        throw erro(config, 403, 'Somente o autor ou um gestor pode excluir o comentário.');
      }
      db.comentarios.splice(i, 1);
      return null;
    },
  ],

  // Serviço de IA
  [
    'post',
    /^\/ia\/propostas\/similares$/,
    ({ body }) =>
      db.propostas
        .filter((p) => p.bairroId === Number(body.bairroId) && !['CONCLUIDA', 'RECUSADA'].includes(p.status))
        .map((p) => ({
          p,
          s: similaridade(`${body.titulo} ${body.descricao}`, `${p.titulo} ${p.descricao}`),
        }))
        .filter(({ s }) => s >= 0.3)
        .sort((a, b) => b.s - a.s)
        .slice(0, 3)
        .map(({ p, s }) => ({ proposta: propostaResponse(p), similaridade: Number(s.toFixed(2)) })),
  ],
  [
    'post',
    /^\/ia\/transcricao$/,
    () => ({
      transcricao:
        'Oi, eu moro na rua Projetada 3 e tem muito entulho jogado na esquina, tá dando rato e escorpião, as crianças brincam ali perto.',
      tituloSugerido: 'Retirada de entulho na Rua Projetada 3',
      descricaoSugerida:
        'Há entulho acumulado na esquina da Rua Projetada 3, atraindo ratos e escorpiões perto de onde as crianças brincam.',
      categoriaSugerida: 'ZELADORIA',
    }),
  ],
];

export async function mockAdapter(config) {
  await dormir(ATRASO_MS);
  const metodo = (config.method || 'get').toLowerCase();
  const url = (config.url || '').split('?')[0];
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data ?? {});
  const usuario = usuarioDoToken(config);

  for (const [m, regex, handler, opcoes] of rotas) {
    const match = url.match(regex);
    if (m !== metodo || !match) continue;
    if (!usuario && !opcoes?.publica && !url.startsWith('/auth/'))
      throw erro(config, 401, 'Token ausente ou inválido.');
    const data = handler({ match, body, params: config.params ?? {}, usuario, config });
    const status = data === null ? 204 : (opcoes?.status ?? 200);
    return { data, status, statusText: 'OK', headers: {}, config };
  }
  throw erro(config, 404, `Rota não encontrada nos dados de exemplo: ${metodo.toUpperCase()} ${url}`);
}
