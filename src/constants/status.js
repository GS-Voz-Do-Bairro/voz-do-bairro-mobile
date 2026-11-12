export const STATUS_PROPOSTA = {
  ABERTA: { label: 'Recebendo apoios', icon: 'users', tom: 'info' },
  DEMANDA: { label: 'Aguardando resposta', icon: 'clock', tom: 'warning' },
  ATRASADA: { label: 'Resposta atrasada', icon: 'alert-triangle', tom: 'critical' },
  EM_EXECUCAO: { label: 'Em execução', icon: 'tool', tom: 'primary' },
  CONCLUIDA: { label: 'Concluída', icon: 'award', tom: 'success' },
  RECUSADA: { label: 'Recusada', icon: 'x-circle', tom: 'neutral' },
};

export const FILTROS_STATUS = [
  { valor: null, label: 'Todas' },
  { valor: 'ABERTA', label: 'Recebendo apoios' },
  { valor: 'DEMANDA', label: 'Aguardando' },
  { valor: 'ATRASADA', label: 'Atrasadas' },
  { valor: 'EM_EXECUCAO', label: 'Em execução' },
  { valor: 'CONCLUIDA', label: 'Concluídas' },
  { valor: 'RECUSADA', label: 'Recusadas' },
];

export const DECISOES = {
  ACEITA: { label: 'Aceitar', resultado: 'Aceita', icon: 'check', tom: 'success' },
  RECUSADA: { label: 'Recusar', resultado: 'Recusada', icon: 'x', tom: 'critical' },
};

export function infoStatus(status) {
  return STATUS_PROPOSTA[status] ?? { label: status ?? '—', icon: 'circle', tom: 'neutral' };
}

export function corDoTom(tom, colors) {
  return colors[tom] ?? colors.neutral;
}

export function aguardaResposta(status) {
  return status === 'DEMANDA' || status === 'ATRASADA';
}
