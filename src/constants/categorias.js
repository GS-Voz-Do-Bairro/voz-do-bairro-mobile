export const CATEGORIAS = {
  SAUDE: { label: 'Saúde', icon: 'heart', cor: '#E0565B' },
  MOBILIDADE: { label: 'Mobilidade', icon: 'navigation', cor: '#2F80D1' },
  ZELADORIA: { label: 'Zeladoria', icon: 'tool', cor: '#D98A0B' },
  LAZER: { label: 'Lazer', icon: 'sun', cor: '#1F9D6B' },
  OUTROS: { label: 'Outros', icon: 'more-horizontal', cor: '#7A819C' },
};

export const LISTA_CATEGORIAS = Object.entries(CATEGORIAS).map(([valor, dados]) => ({ valor, ...dados }));

export function infoCategoria(valor) {
  return CATEGORIAS[valor] ?? CATEGORIAS.OUTROS;
}
