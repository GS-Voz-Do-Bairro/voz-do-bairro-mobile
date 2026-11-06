const diasAtras = (d, h = 10) => {
  const data = new Date();
  data.setDate(data.getDate() - d);
  data.setHours(h, 0, 0, 0);
  return data.toISOString().slice(0, 19);
};
const diasAFrente = (d) => diasAtras(-d);

export const bairros = [
  { id: 'b1', nome: 'Vila Mariana', cidade: 'São Paulo' },
  { id: 'b2', nome: 'Capão Redondo', cidade: 'São Paulo' },
  { id: 'b3', nome: 'Mooca', cidade: 'São Paulo' },
  { id: 'b4', nome: 'Jardim Ângela', cidade: 'São Paulo' },
];

export const usuarios = [
  {
    id: 'u1',
    nome: 'Maria Souza',
    email: 'maria@email.com',
    senha: '123456',
    papel: 'CIDADAO',
    bairroId: 'b2',
  },
  { id: 'u2', nome: 'João Lima', email: 'joao@email.com', senha: '123456', papel: 'CIDADAO', bairroId: 'b2' },
  {
    id: 'u3',
    nome: 'Carla Mendes',
    email: 'gestor@prefeitura.gov.br',
    senha: '123456',
    papel: 'GESTOR',
    bairroId: 'b2',
  },
];

export const META_APOIOS = 50;

export const propostas = [
  {
    id: 'p1',
    titulo: 'Tapar buraco na Rua das Palmeiras',
    descricao:
      'Tem um buraco enorme na altura do número 230. Já caíram duas motos e os carros desviam pela calçada.',
    categoria: 'ZELADORIA',
    status: 'ATRASADA',
    origem: 'AUDIO',
    bairroId: 'b2',
    autorId: 'u2',
    totalApoios: 78,
    prazoResposta: diasAtras(3),
    criadaEm: diasAtras(40),
    resumoIa:
      'Moradores pedem o conserto de um buraco na Rua das Palmeiras, altura do nº 230, que já causou acidentes com motos.',
  },
  {
    id: 'p2',
    titulo: 'Iluminação na praça Dona Benta',
    descricao:
      'A praça fica totalmente escura à noite. As mães não deixam mais as crianças brincarem depois das 18h.',
    categoria: 'LAZER',
    status: 'ABERTA',
    origem: 'TEXTO',
    bairroId: 'b2',
    autorId: 'u1',
    totalApoios: 31,
    criadaEm: diasAtras(6),
    resumoIa:
      'Pedido de iluminação na praça Dona Benta, que fica sem luz à noite e deixou de ser usada pelas famílias.',
  },
  {
    id: 'p3',
    titulo: 'Ônibus até o posto de saúde aos sábados',
    descricao: 'A linha 6045 não circula aos sábados e quem precisa do posto tem que andar 40 minutos.',
    categoria: 'MOBILIDADE',
    status: 'AGENDADA',
    origem: 'TEXTO',
    bairroId: 'b2',
    autorId: 'u2',
    totalApoios: 112,
    prazoResposta: diasAtras(10),
    criadaEm: diasAtras(55),
    resumoIa:
      'Moradores pedem que a linha 6045 circule aos sábados para facilitar o acesso ao posto de saúde.',
    resposta: {
      id: 'r1',
      tipo: 'AGENDADA',
      justificativa:
        'A SPTrans incluirá a linha 6045 na grade de sábado a partir do próximo mês, com saídas a cada 30 minutos.',
      dataPrevista: diasAFrente(20).slice(0, 10),
      gestorNome: 'Carla Mendes',
      respondidaEm: diasAtras(12),
    },
  },
  {
    id: 'p4',
    titulo: 'Médico pediatra na UBS Jardim Comercial',
    descricao:
      'Faz três meses que a UBS está sem pediatra. As consultas estão sendo marcadas para outro bairro.',
    categoria: 'SAUDE',
    status: 'DEMANDA',
    origem: 'AUDIO',
    bairroId: 'b2',
    autorId: 'u1',
    totalApoios: 64,
    prazoResposta: diasAFrente(9),
    criadaEm: diasAtras(18),
    resumoIa:
      'A UBS Jardim Comercial está há três meses sem pediatra, e as famílias são encaminhadas para outro bairro.',
  },
  {
    id: 'p5',
    titulo: 'Poda das árvores da Av. Ellis Maas',
    descricao: 'Os galhos estão encostando na fiação e já houve queda de energia em dias de chuva.',
    categoria: 'ZELADORIA',
    status: 'CONCLUIDA',
    origem: 'TEXTO',
    bairroId: 'b2',
    autorId: 'u2',
    totalApoios: 59,
    prazoResposta: diasAtras(30),
    criadaEm: diasAtras(70),
    resumoIa: 'Pedido de poda das árvores da Av. Ellis Maas, cujos galhos encostam na rede elétrica.',
    resposta: {
      id: 'r2',
      tipo: 'ACEITA',
      justificativa: 'Equipe da subprefeitura fará a poda em conjunto com a Enel.',
      dataPrevista: diasAtras(15).slice(0, 10),
      gestorNome: 'Carla Mendes',
      respondidaEm: diasAtras(33),
      cumprida: true,
    },
  },
  {
    id: 'p6',
    titulo: 'Faixa de pedestre na frente da escola',
    descricao: 'Os alunos da E.E. Prof. Lima atravessam a avenida sem faixa e sem semáforo.',
    categoria: 'MOBILIDADE',
    status: 'RECUSADA',
    origem: 'TEXTO',
    bairroId: 'b2',
    autorId: 'u1',
    totalApoios: 53,
    prazoResposta: diasAtras(20),
    criadaEm: diasAtras(60),
    resumoIa: 'Pedido de faixa de pedestre em frente à E.E. Prof. Lima.',
    resposta: {
      id: 'r3',
      tipo: 'RECUSADA',
      justificativa:
        'O trecho é uma via estadual e a sinalização é responsabilidade do DER. O pedido foi encaminhado ao órgão.',
      gestorNome: 'Carla Mendes',
      respondidaEm: diasAtras(22),
    },
  },
  {
    id: 'p7',
    titulo: 'Coleta de entulho na Rua Projetada 3',
    descricao: 'Montes de entulho na esquina atraem ratos e escorpiões.',
    categoria: 'ZELADORIA',
    status: 'ABERTA',
    origem: 'TEXTO',
    bairroId: 'b2',
    autorId: 'u2',
    totalApoios: 12,
    criadaEm: diasAtras(2),
    resumoIa: 'Moradores pedem a retirada de entulho acumulado na Rua Projetada 3.',
  },
  {
    id: 'p8',
    titulo: 'Academia ao ar livre no Parque Vila Mariana',
    descricao: 'Instalar aparelhos de ginástica para idosos perto da entrada principal.',
    categoria: 'LAZER',
    status: 'ABERTA',
    origem: 'TEXTO',
    bairroId: 'b1',
    autorId: 'u1',
    totalApoios: 22,
    criadaEm: diasAtras(9),
    resumoIa: 'Pedido de aparelhos de ginástica para idosos no parque.',
  },
];

export const comentarios = [
  {
    id: 'c1',
    propostaId: 'p1',
    autorId: 'u1',
    texto: 'Meu filho caiu de bicicleta nesse buraco semana passada.',
    criadoEm: diasAtras(20),
  },
  {
    id: 'c2',
    propostaId: 'p1',
    autorId: 'u2',
    texto: 'Já liguei no 156 três vezes e nada.',
    criadoEm: diasAtras(15),
  },
  {
    id: 'c3',
    propostaId: 'p3',
    autorId: 'u3',
    texto: 'A mudança na grade já foi aprovada pela SPTrans.',
    criadoEm: diasAtras(12),
  },
  {
    id: 'c4',
    propostaId: 'p2',
    autorId: 'u2',
    texto: 'Apoio! À noite a praça vira ponto de uso de drogas.',
    criadoEm: diasAtras(4),
  },
];

export const apoios = {
  u1: new Set(['p1', 'p3']),
  u2: new Set(['p2', 'p4']),
};
