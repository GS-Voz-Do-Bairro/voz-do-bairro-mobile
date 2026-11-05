export function parseData(valor) {
  if (!valor) return null;
  const [data, hora = '00:00:00'] = String(valor).replace('Z', '').split('T');
  const [ano, mes, dia] = data.split('-').map(Number);
  const [h = 0, m = 0, s = 0] = hora.split(':').map((n) => Number.parseInt(n, 10));
  const resultado = new Date(ano, mes - 1, dia, h, m, s);
  return Number.isNaN(resultado.getTime()) ? null : resultado;
}

export function paraIsoData(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function formatarData(valor) {
  const d = parseData(valor);
  return d ? d.toLocaleDateString('pt-BR') : '—';
}

export function formatarDataHora(valor) {
  const d = parseData(valor);
  if (!d) return '—';
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${d.toLocaleDateString('pt-BR')} às ${hora}`;
}

export function diasAte(valor) {
  const alvo = parseData(valor);
  if (!alvo) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  alvo.setHours(0, 0, 0, 0);
  return Math.round((alvo - hoje) / 86400000);
}

export function tempoRelativo(valor) {
  const dias = diasAte(valor);
  if (dias === null) return '';
  const passado = -dias;
  if (passado <= 0) return 'hoje';
  if (passado === 1) return 'ontem';
  if (passado < 30) return `há ${passado} dias`;
  const meses = Math.floor(passado / 30);
  return meses === 1 ? 'há 1 mês' : `há ${meses} meses`;
}

export function textoPrazo(valor) {
  const dias = diasAte(valor);
  if (dias === null) return '';
  if (dias < 0) return `Prazo vencido há ${-dias} ${-dias === 1 ? 'dia' : 'dias'}`;
  if (dias === 0) return 'Prazo termina hoje';
  return `${dias} ${dias === 1 ? 'dia' : 'dias'} para responder`;
}

export function brParaIso(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto?.trim() ?? '');
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  if (d.getDate() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1) return null;
  return paraIsoData(d);
}

export function mascaraData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

export function formatarDuracao(ms) {
  const total = Math.floor((ms ?? 0) / 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(Math.floor(total / 60))}:${p(total % 60)}`;
}
