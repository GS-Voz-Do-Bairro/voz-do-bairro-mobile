import { AxiosError } from 'axios';
import * as db from './dados';

const ATRASO_MS = 350;
const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let sequencia = 100;
const novoId = (prefixo) => `${prefixo}${(sequencia += 1)}`;
const agora = () => new Date().toISOString().slice(0, 19);

function usuarioDoToken(config) {
  const auth = config.headers?.Authorization || config.headers?.authorization || '';
  const id = String(auth).replace('Bearer mock-', '');
  return db.usuarios.find((u) => u.id === id) ?? null;
}

function usuarioPublico(u) {
  const bairro = db.bairros.find((b) => b.id === u.bairroId);
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    papel: u.papel,
    bairroId: u.bairroId,
    bairroNome: bairro?.nome,
  };
}

function propostaPublica(p, usuario) {
  const autor = db.usuarios.find((u) => u.id === p.autorId);
  const bairro = db.bairros.find((b) => b.id === p.bairroId);
  return {
    ...p,
    autorNome: autor?.nome,
    bairroNome: bairro?.nome,
    metaApoios: db.META_APOIOS,
    apoiadaPorMim: !!usuario && !!db.apoios[usuario.id]?.has(p.id),
    totalComentarios: db.comentarios.filter((c) => c.propostaId === p.id).length,
  };
}

function erro(config, status, mensagem, campos) {
  const response = { status, data: { status, mensagem, ...(campos ? { campos } : {}) }, headers: {}, config };
  return new AxiosError(mensagem, String(status), config, null, response);
}

const palavras = (texto) =>
  new Set(
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .split(/\W+/)
      .filter((p) => p.length > 3),
  );

function similaridade(a, b) {
  const pa = palavras(a);
  const pb = palavras(b);
  if (!pa.size || !pb.size) return 0;
  let comuns = 0;
  pa.forEach((p) => pb.has(p) && (comuns += 1));
  return comuns / Math.min(pa.size, pb.size);
}

function contarApoio(p) {
  if (p.status === 'ABERTA' && p.totalApoios >= db.META_APOIOS) {
    p.status = 'DEMANDA';
    const prazo = new Date();
    prazo.setDate(prazo.getDate() + 30);
    p.prazoResposta = prazo.toISOString().slice(0, 19);
  }
}

function placarDe(bairro) {
  const lista = db.propostas.filter((p) => p.bairroId === bairro.id);
  const conta = (...status) => lista.filter((p) => status.includes(p.status)).length;
  const atendidas = conta('ACEITA', 'AGENDADA', 'CONCLUIDA');
  const demandas = lista.filter((p) => p.status !== 'ABERTA').length;
  return {
    bairroId: bairro.id,
    bairroNome: bairro.nome,
    total: lista.length,
    recebendoApoios: conta('ABERTA'),
    aguardando: conta('DEMANDA'),
    atendidas,
    atrasadas: conta('ATRASADA'),
    ignoradas: lista.filter((p) => p.status === 'ATRASADA' && p.totalApoios > 70).length,
    recusadas: conta('RECUSADA'),
    taxaAtendimento: demandas ? Math.round((atendidas / demandas) * 100) : 0,
  };
}

const rotas = [
  [
    'post',
    /^\/auth\/login$/,
    ({ body, config }) => {
      const u = db.usuarios.find((x) => x.email === body.email?.toLowerCase() && x.senha === body.senha);
      if (!u) throw erro(config, 401, 'E-mail ou senha inválidos.');
      return { token: `mock-${u.id}`, tipo: 'Bearer', usuario: usuarioPublico(u) };
    },
  ],
  [
    'post',
    /^\/auth\/registro$/,
    ({ body, config }) => {
      if (db.usuarios.some((x) => x.email === body.email?.toLowerCase())) {
        throw erro(config, 409, 'E-mail já cadastrado.');
      }
      const u = { id: novoId('u'), ...body, email: body.email.toLowerCase(), papel: 'CIDADAO' };
      db.usuarios.push(u);
      return { token: `mock-${u.id}`, tipo: 'Bearer', usuario: usuarioPublico(u) };
    },
  ],
  [
    'get',
    /^\/auth\/me$/,
    ({ usuario, config }) => {
      if (!usuario) throw erro(config, 401, 'Token inválido.');
      return usuarioPublico(usuario);
    },
  ],
  ['get', /^\/bairros$/, () => db.bairros, { publica: true }],

  [
    'get',
    /^\/propostas$/,
    ({ params, usuario }) => {
      let lista = db.propostas;
      if (params.bairroId) lista = lista.filter((p) => p.bairroId === params.bairroId);
      if (params.status) lista = lista.filter((p) => p.status === params.status);
      if (params.categoria) lista = lista.filter((p) => p.categoria === params.categoria);
      if (params.busca) {
        const termo = params.busca.toLowerCase();
        lista = lista.filter((p) => `${p.titulo} ${p.descricao}`.toLowerCase().includes(termo));
      }
      const content = [...lista]
        .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
        .map((p) => propostaPublica(p, usuario));
      return { content, totalElements: content.length, number: 0 };
    },
  ],
  [
    'get',
    /^\/propostas\/minhas$/,
    ({ usuario }) =>
      db.propostas.filter((p) => p.autorId === usuario.id).map((p) => propostaPublica(p, usuario)),
  ],
  [
    'post',
    /^\/propostas\/similares$/,
    ({ body }) =>
      db.propostas
        .filter((p) => p.bairroId === body.bairroId)
        .map((p) => ({
          p,
          s: similaridade(`${body.titulo} ${body.descricao}`, `${p.titulo} ${p.descricao}`),
        }))
        .filter(({ s }) => s >= 0.3)
        .sort((a, b) => b.s - a.s)
        .slice(0, 3)
        .map(({ p, s }) => ({ ...propostaPublica(p), similaridade: Number(s.toFixed(2)) })),
  ],
  [
    'post',
    /^\/propostas\/transcricao$/,
    () => ({
      transcricao:
        'Oi, eu moro na rua Projetada 3 e tem muito entulho jogado na esquina, tá dando rato e escorpião, as crianças brincam ali perto.',
      tituloSugerido: 'Retirada de entulho na Rua Projetada 3',
      descricaoSugerida:
        'Há entulho acumulado na esquina da Rua Projetada 3, atraindo ratos e escorpiões perto de onde as crianças brincam.',
      categoriaSugerida: 'ZELADORIA',
    }),
  ],
  [
    'get',
    /^\/propostas\/([\w-]+)$/,
    ({ match, usuario, config }) => {
      const p = db.propostas.find((x) => x.id === match[1]);
      if (!p) throw erro(config, 404, 'Proposta não encontrada.');
      return propostaPublica(p, usuario);
    },
  ],
  [
    'post',
    /^\/propostas$/,
    ({ body, usuario }) => {
      const p = {
        id: novoId('p'),
        ...body,
        status: 'ABERTA',
        autorId: usuario.id,
        totalApoios: 1,
        criadaEm: agora(),
        resumoIa: body.descricao.length > 140 ? `${body.descricao.slice(0, 137)}...` : body.descricao,
      };
      db.propostas.push(p);
      db.apoios[usuario.id] = db.apoios[usuario.id] ?? new Set();
      db.apoios[usuario.id].add(p.id);
      return propostaPublica(p, usuario);
    },
  ],
  [
    'put',
    /^\/propostas\/([\w-]+)$/,
    ({ match, body, usuario, config }) => {
      const p = db.propostas.find((x) => x.id === match[1]);
      if (!p) throw erro(config, 404, 'Proposta não encontrada.');
      if (p.autorId !== usuario.id) throw erro(config, 403, 'Só o autor pode editar a proposta.');
      if (p.status !== 'ABERTA')
        throw erro(config, 409, 'A proposta já virou demanda e não pode ser alterada.');
      Object.assign(p, body);
      return propostaPublica(p, usuario);
    },
  ],
  [
    'delete',
    /^\/propostas\/([\w-]+)$/,
    ({ match, usuario, config }) => {
      const i = db.propostas.findIndex((x) => x.id === match[1]);
      if (i < 0) throw erro(config, 404, 'Proposta não encontrada.');
      if (db.propostas[i].autorId !== usuario.id)
        throw erro(config, 403, 'Só o autor pode excluir a proposta.');
      if (db.propostas[i].status !== 'ABERTA')
        throw erro(config, 409, 'A proposta já virou demanda e não pode ser excluída.');
      db.propostas.splice(i, 1);
      return null;
    },
  ],

  [
    'get',
    /^\/propostas\/([\w-]+)\/comentarios$/,
    ({ match }) =>
      db.comentarios
        .filter((c) => c.propostaId === match[1])
        .map((c) => {
          const autor = db.usuarios.find((u) => u.id === c.autorId);
          return { ...c, autorNome: autor?.nome, autorPapel: autor?.papel };
        }),
  ],
  [
    'post',
    /^\/propostas\/([\w-]+)\/comentarios$/,
    ({ match, body, usuario }) => {
      const c = {
        id: novoId('c'),
        propostaId: match[1],
        autorId: usuario.id,
        texto: body.texto,
        criadoEm: agora(),
      };
      db.comentarios.push(c);
      return { ...c, autorNome: usuario.nome, autorPapel: usuario.papel };
    },
  ],
  [
    'put',
    /^\/comentarios\/([\w-]+)$/,
    ({ match, body, usuario, config }) => {
      const c = db.comentarios.find((x) => x.id === match[1]);
      if (!c || c.autorId !== usuario.id) throw erro(config, 403, 'Só o autor pode editar o comentário.');
      c.texto = body.texto;
      c.editado = true;
      return { ...c, autorNome: usuario.nome, autorPapel: usuario.papel };
    },
  ],
  [
    'delete',
    /^\/comentarios\/([\w-]+)$/,
    ({ match, usuario, config }) => {
      const i = db.comentarios.findIndex((x) => x.id === match[1]);
      if (i < 0 || db.comentarios[i].autorId !== usuario.id)
        throw erro(config, 403, 'Só o autor pode excluir o comentário.');
      db.comentarios.splice(i, 1);
      return null;
    },
  ],

  [
    'post',
    /^\/apoios$/,
    ({ body, usuario, config }) => {
      const p = db.propostas.find((x) => x.id === body.propostaId);
      if (!p) throw erro(config, 404, 'Proposta não encontrada.');
      db.apoios[usuario.id] = db.apoios[usuario.id] ?? new Set();
      if (!db.apoios[usuario.id].has(p.id)) {
        db.apoios[usuario.id].add(p.id);
        p.totalApoios += 1;
        contarApoio(p);
      }
      return { propostaId: p.id, totalApoios: p.totalApoios, apoiada: true };
    },
  ],
  [
    'delete',
    /^\/apoios\/([\w-]+)$/,
    ({ match, usuario, config }) => {
      const p = db.propostas.find((x) => x.id === match[1]);
      if (!p) throw erro(config, 404, 'Proposta não encontrada.');
      if (p.status !== 'ABERTA')
        throw erro(config, 409, 'A proposta já virou demanda e o apoio não pode ser retirado.');
      if (db.apoios[usuario.id]?.delete(p.id)) p.totalApoios -= 1;
      return null;
    },
  ],

  [
    'get',
    /^\/demandas$/,
    ({ params, usuario }) =>
      db.propostas
        .filter(
          (p) =>
            ['DEMANDA', 'ATRASADA'].includes(p.status) ||
            (params.status === 'TODAS' && p.status !== 'ABERTA'),
        )
        .filter((p) => !params.bairroId || p.bairroId === params.bairroId)
        .sort((a, b) => (a.prazoResposta ?? '').localeCompare(b.prazoResposta ?? ''))
        .map((p) => propostaPublica(p, usuario)),
  ],
  [
    'post',
    /^\/demandas\/([\w-]+)\/rascunho$/,
    ({ match, body }) => {
      const p = db.propostas.find((x) => x.id === match[1]);
      const textos = {
        ACEITA: `A Prefeitura recebeu a demanda "${p?.titulo}" e confirma que ela será atendida. A equipe responsável fará a vistoria no local e iniciará o serviço dentro do prazo informado.`,
        AGENDADA: `A demanda "${p?.titulo}" foi incluída no cronograma de serviços da região. A execução está prevista para a data informada, e os moradores serão avisados de qualquer alteração.`,
        RECUSADA: `Após análise, a demanda "${p?.titulo}" não poderá ser atendida neste momento. [Explique o motivo: competência de outro órgão, restrição orçamentária ou técnica.] A Prefeitura encaminhará o pedido ao órgão responsável.`,
      };
      return { texto: textos[body.tipo] ?? textos.ACEITA };
    },
  ],
  [
    'post',
    /^\/demandas\/([\w-]+)\/resposta$/,
    ({ match, body, usuario, config }) => {
      const p = db.propostas.find((x) => x.id === match[1]);
      if (!p) throw erro(config, 404, 'Demanda não encontrada.');
      p.status = body.tipo;
      p.resposta = { id: novoId('r'), ...body, gestorNome: usuario.nome, respondidaEm: agora() };
      return p.resposta;
    },
  ],
  [
    'put',
    /^\/demandas\/([\w-]+)\/concluir$/,
    ({ match }) => {
      const p = db.propostas.find((x) => x.id === match[1]);
      p.status = 'CONCLUIDA';
      if (p.resposta) p.resposta.cumprida = true;
      return null;
    },
  ],

  ['get', /^\/placar$/, () => db.bairros.map(placarDe)],
  ['get', /^\/placar\/([\w-]+)$/, ({ match }) => placarDe(db.bairros.find((b) => b.id === match[1]))],
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
    if (!usuario && !opcoes?.publica && !url.startsWith('/auth/')) throw erro(config, 401, 'Token inválido.');
    const data = handler({ match, body, params: config.params ?? {}, usuario, config });
    return { data, status: data === null ? 204 : 200, statusText: 'OK', headers: {}, config };
  }
  throw erro(config, 404, `Rota não encontrada no mock: ${metodo.toUpperCase()} ${url}`);
}
