const diasAtras = (d, h = 13) => {
  const data = new Date();
  data.setUTCDate(data.getUTCDate() - d);
  data.setUTCHours(h, 0, 0, 0);
  return data.toISOString().replace('.000', '');
};
const diasAFrente = (d) => diasAtras(-d);
const dataPura = (iso) => iso.slice(0, 10);

export const PRAZO_RESPOSTA_DIAS = 15;

export const bairros = [
  { id: 1, nome: 'Vila Mariana', subprefeitura: 'Vila Mariana', cidade: 'São Paulo', metaApoiosPadrao: 50 },
  { id: 2, nome: 'Capão Redondo', subprefeitura: 'Campo Limpo', cidade: 'São Paulo', metaApoiosPadrao: 30 },
  { id: 3, nome: 'Itaquera', subprefeitura: 'Itaquera', cidade: 'São Paulo', metaApoiosPadrao: 40 },
];

export const usuarios = [
  {
    id: 1,
    nome: 'Maria Cidadã',
    email: 'cidadao@vozdobairro.com',
    senha: 'Senha@123',
    papel: 'CIDADAO',
    bairroId: 2,
  },
  {
    id: 2,
    nome: 'João Vizinho',
    email: 'vizinho@vozdobairro.com',
    senha: 'Senha@123',
    papel: 'CIDADAO',
    bairroId: 2,
  },
  {
    id: 3,
    nome: 'Carla Gestora',
    email: 'gestor@vozdobairro.com',
    senha: 'Senha@123',
    papel: 'GESTOR',
    bairroId: null,
  },
];

export const propostas = [
  {
    id: 1,
    titulo: 'Tapar buraco na Rua das Palmeiras',
    descricao:
      'Tem um buraco enorme na altura do número 230. Já caíram duas motos e os carros desviam pela calçada.',
    categoria: 'ZELADORIA',
    status: 'ATRASADA',
    bairroId: 2,
    autorId: 2,
    metaApoios: 30,
    totalApoios: 41,
    dtCriacao: diasAtras(40),
    dtVirouDemanda: diasAtras(19),
    prazoResposta: diasAtras(4),
    resumoIa:
      'Moradores pedem o conserto de um buraco na Rua das Palmeiras, altura do nº 230, que já causou acidentes com motos.',
  },
  {
    id: 2,
    titulo: 'Iluminação na Rua Agnaldo Macedo',
    descricao:
      'A rua fica totalmente escura à noite entre os números 100 e 400. Moradores voltando do trabalho e da escola se sentem inseguros.',
    categoria: 'SEGURANCA',
    status: 'ABERTA',
    bairroId: 2,
    autorId: 1,
    metaApoios: 30,
    totalApoios: 18,
    dtCriacao: diasAtras(6),
    resumoIa:
      'Pedido de iluminação na Rua Agnaldo Macedo, que fica escura à noite entre os números 100 e 400.',
  },
  {
    id: 3,
    titulo: 'Ônibus até o posto de saúde aos sábados',
    descricao: 'A linha 6045 não circula aos sábados e quem precisa do posto tem que andar 40 minutos.',
    categoria: 'MOBILIDADE',
    status: 'EM_EXECUCAO',
    bairroId: 2,
    autorId: 2,
    metaApoios: 30,
    totalApoios: 52,
    dtCriacao: diasAtras(55),
    dtVirouDemanda: diasAtras(30),
    prazoResposta: diasAtras(15),
    resumoIa:
      'Moradores pedem que a linha 6045 circule aos sábados para facilitar o acesso ao posto de saúde.',
    resposta: {
      id: 1,
      gestorId: 3,
      decisao: 'ACEITA',
      justificativa:
        'A SPTrans incluirá a linha 6045 na grade de sábado a partir do próximo mês, com saídas a cada 30 minutos.',
      prazoExecucao: dataPura(diasAFrente(20)),
      dtResposta: diasAtras(18),
    },
  },
  {
    id: 4,
    titulo: 'Pediatra na UBS Jardim Comercial',
    descricao:
      'Faz três meses que a UBS está sem pediatra. As consultas estão sendo marcadas para outro bairro.',
    categoria: 'SAUDE',
    status: 'DEMANDA',
    bairroId: 2,
    autorId: 1,
    metaApoios: 30,
    totalApoios: 34,
    dtCriacao: diasAtras(18),
    dtVirouDemanda: diasAtras(6),
    prazoResposta: diasAFrente(9),
    resumoIa:
      'A UBS Jardim Comercial está há três meses sem pediatra, e as famílias são encaminhadas para outro bairro.',
  },
  {
    id: 5,
    titulo: 'Poda das árvores da Av. Ellis Maas',
    descricao: 'Os galhos estão encostando na fiação e já houve queda de energia em dias de chuva.',
    categoria: 'MEIO_AMBIENTE',
    status: 'CONCLUIDA',
    bairroId: 2,
    autorId: 2,
    metaApoios: 30,
    totalApoios: 33,
    dtCriacao: diasAtras(70),
    dtVirouDemanda: diasAtras(50),
    prazoResposta: diasAtras(35),
    resumoIa: 'Pedido de poda das árvores da Av. Ellis Maas, cujos galhos encostam na rede elétrica.',
    resposta: {
      id: 2,
      gestorId: 3,
      decisao: 'ACEITA',
      justificativa: 'Equipe da subprefeitura fará a poda em conjunto com a Enel.',
      prazoExecucao: dataPura(diasAtras(15)),
      dtResposta: diasAtras(40),
    },
  },
  {
    id: 6,
    titulo: 'Faixa de pedestre em frente à EMEF',
    descricao:
      'Crianças atravessam a avenida sem faixa nem semáforo na saída da escola. Já houve atropelamentos.',
    categoria: 'MOBILIDADE',
    status: 'RECUSADA',
    bairroId: 2,
    autorId: 1,
    metaApoios: 30,
    totalApoios: 31,
    dtCriacao: diasAtras(60),
    dtVirouDemanda: diasAtras(45),
    prazoResposta: diasAtras(30),
    resumoIa: 'Pedido de faixa de pedestre em frente à EMEF, onde crianças atravessam sem sinalização.',
    resposta: {
      id: 3,
      gestorId: 3,
      decisao: 'RECUSADA',
      justificativa:
        'O trecho é uma via estadual e a sinalização é responsabilidade do DER. O pedido foi encaminhado ao órgão.',
      prazoExecucao: null,
      dtResposta: diasAtras(33),
    },
  },
  {
    id: 7,
    titulo: 'Coleta de entulho na Rua Projetada 3',
    descricao: 'Montes de entulho na esquina atraem ratos e escorpiões perto de onde as crianças brincam.',
    categoria: 'ZELADORIA',
    status: 'ABERTA',
    bairroId: 2,
    autorId: 2,
    metaApoios: 30,
    totalApoios: 7,
    dtCriacao: diasAtras(2),
    resumoIa: 'Moradores pedem a retirada de entulho acumulado na Rua Projetada 3.',
  },
  {
    id: 8,
    titulo: 'Academia ao ar livre no Parque da Aclimação',
    descricao: 'Instalar aparelhos de ginástica para idosos perto da entrada principal do parque.',
    categoria: 'LAZER',
    status: 'ABERTA',
    bairroId: 1,
    autorId: 1,
    metaApoios: 50,
    totalApoios: 22,
    dtCriacao: diasAtras(9),
    resumoIa: 'Pedido de aparelhos de ginástica para idosos no parque.',
  },
  {
    id: 9,
    titulo: 'Reforma da quadra da praça Brasil',
    descricao: 'O piso da quadra está quebrado e as traves estão enferrujadas. Os jovens não têm onde jogar.',
    categoria: 'LAZER',
    status: 'EM_EXECUCAO',
    bairroId: 3,
    autorId: 2,
    metaApoios: 40,
    totalApoios: 46,
    dtCriacao: diasAtras(50),
    dtVirouDemanda: diasAtras(25),
    prazoResposta: diasAtras(10),
    resumoIa: 'Moradores pedem a reforma da quadra da praça Brasil.',
    resposta: {
      id: 4,
      gestorId: 3,
      decisao: 'ACEITA',
      justificativa: 'A reforma entrou no plano de obras da subprefeitura.',
      prazoExecucao: dataPura(diasAFrente(30)),
      dtResposta: diasAtras(12),
    },
  },
];

export const comentarios = [
  {
    id: 1,
    propostaId: 1,
    usuarioId: 1,
    texto: 'Meu filho caiu de bicicleta nesse buraco semana passada.',
    dtCriacao: diasAtras(20),
  },
  {
    id: 2,
    propostaId: 1,
    usuarioId: 2,
    texto: 'Já liguei no 156 três vezes e nada.',
    dtCriacao: diasAtras(15),
  },
  {
    id: 3,
    propostaId: 3,
    usuarioId: 3,
    texto: 'A mudança na grade já foi aprovada pela SPTrans.',
    dtCriacao: diasAtras(17),
  },
  {
    id: 4,
    propostaId: 2,
    usuarioId: 2,
    texto: 'Apoio! À noite a rua fica perigosa.',
    dtCriacao: diasAtras(4),
  },
];

export const apoios = [
  { usuarioId: 1, propostaId: 1, dtApoio: diasAtras(25) },
  { usuarioId: 1, propostaId: 3, dtApoio: diasAtras(40) },
  { usuarioId: 2, propostaId: 2, dtApoio: diasAtras(5) },
  { usuarioId: 2, propostaId: 4, dtApoio: diasAtras(10) },
];

export const notificacoes = [
  {
    id: 1,
    usuarioId: 1,
    propostaId: 4,
    mensagem:
      '[Meta atingida] Sua proposta "Pediatra na UBS Jardim Comercial" virou demanda. A prefeitura tem 15 dias para responder.',
    lida: false,
    dtCriacao: diasAtras(6),
  },
  {
    id: 2,
    usuarioId: 1,
    propostaId: 6,
    mensagem: '[Resposta] A prefeitura respondeu à proposta "Faixa de pedestre em frente à EMEF".',
    lida: true,
    dtCriacao: diasAtras(33),
  },
  {
    id: 3,
    usuarioId: 2,
    propostaId: 1,
    mensagem:
      '[Prazo vencido] A prefeitura não respondeu à proposta "Tapar buraco na Rua das Palmeiras" no prazo.',
    lida: false,
    dtCriacao: diasAtras(4),
  },
  {
    id: 4,
    usuarioId: 3,
    propostaId: 1,
    mensagem: '[Prazo vencido] A demanda "Tapar buraco na Rua das Palmeiras" está sem resposta.',
    lida: false,
    dtCriacao: diasAtras(4),
  },
  {
    id: 5,
    usuarioId: 3,
    propostaId: 4,
    mensagem: '[Meta atingida] Nova demanda no Capão Redondo: "Pediatra na UBS Jardim Comercial".',
    lida: false,
    dtCriacao: diasAtras(6),
  },
];
