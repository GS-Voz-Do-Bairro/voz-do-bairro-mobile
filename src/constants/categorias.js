export const CATEGORIAS = {
  ZELADORIA: { label: 'Zeladoria', icon: 'tool', cor: '#D98A0B' },
  MOBILIDADE: { label: 'Mobilidade', icon: 'navigation', cor: '#2F80D1' },
  SAUDE: { label: 'Saúde', icon: 'heart', cor: '#E0565B' },
  EDUCACAO: { label: 'Educação', icon: 'book-open', cor: '#8E5BD6' },
  LAZER: { label: 'Lazer', icon: 'sun', cor: '#1F9D6B' },
  SEGURANCA: { label: 'Segurança', icon: 'shield', cor: '#3346D3' },
  MEIO_AMBIENTE: { label: 'Meio ambiente', icon: 'feather', cor: '#2E8B57' },
  OUTROS: { label: 'Outros', icon: 'more-horizontal', cor: '#7A819C' },
};

export const LISTA_CATEGORIAS = Object.entries(CATEGORIAS).map(([valor, dados]) => ({ valor, ...dados }));

export function infoCategoria(valor) {
  return CATEGORIAS[valor] ?? CATEGORIAS.OUTROS;
}
