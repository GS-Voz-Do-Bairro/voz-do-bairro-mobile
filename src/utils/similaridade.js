const PALAVRAS_IGNORADAS = new Set([
  'para',
  'pela',
  'pelo',
  'como',
  'mais',
  'muito',
  'muita',
  'esta',
  'esse',
  'essa',
  'isso',
  'aqui',
  'onde',
  'quando',
  'porque',
  'tambem',
  'rua',
  'avenida',
  'bairro',
  'perto',
  'frente',
  'numero',
]);

function palavras(texto) {
  return new Set(
    (texto ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .split(/[^a-z0-9]+/)
      .filter((p) => p.length > 3 && !PALAVRAS_IGNORADAS.has(p)),
  );
}

export function similaridade(a, b) {
  const pa = palavras(a);
  const pb = palavras(b);
  if (!pa.size || !pb.size) return 0;
  let comuns = 0;
  pa.forEach((p) => {
    if (pb.has(p)) comuns += 1;
  });
  return comuns / Math.min(pa.size, pb.size);
}
