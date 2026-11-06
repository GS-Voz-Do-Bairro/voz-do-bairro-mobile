export const STATUS_PROPOSTA = {
  ABERTA: { label: 'Recebendo apoios', icon: 'users', tom: 'info' },
  DEMANDA: { label: 'Aguardando resposta', icon: 'clock', tom: 'warning' },
  ATRASADA: { label: 'Resposta atrasada', icon: 'alert-triangle', tom: 'critical' },
  ACEITA: { label: 'Aceita', icon: 'check-circle', tom: 'success' },
  AGENDADA: { label: 'Agendada', icon: 'calendar', tom: 'primary' },
  RECUSADA: { label: 'Recusada', icon: 'x-circle', tom: 'neutral' },
  CONCLUIDA: { label: 'Concluída', icon: 'award', tom: 'success' },
};

export const FILTROS_STATUS = [
  { valor: null, label: 'Todas' },
  { valor: 'ABERTA', label: 'Recebendo apoios' },
  { valor: 'DEMANDA', label: 'Aguardando' },
  { valor: 'ATRASADA', label: 'Atrasadas' },
  { valor: 'ACEITA', label: 'Aceitas' },
  { valor: 'AGENDADA', label: 'Agendadas' },
  { valor: 'CONCLUIDA', label: 'Concluídas' },
];

export const TIPOS_RESPOSTA = {
  ACEITA: { label: 'Aceitar', icon: 'check', tom: 'success' },
  AGENDADA: { label: 'Agendar', icon: 'calendar', tom: 'primary' },
  RECUSADA: { label: 'Recusar', icon: 'x', tom: 'critical' },
};

export function infoStatus(status) {
  return STATUS_PROPOSTA[status] ?? { label: status ?? '—', icon: 'circle', tom: 'neutral' };
}

export function corDoTom(tom, colors) {
  return colors[tom] ?? colors.neutral;
}

export function podeEditar(status) {
  return status === 'ABERTA';
}
