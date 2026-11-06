import { useEffect, useState } from 'react';

export function useDebounce(valor, atrasoMs = 400) {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const timer = setTimeout(() => setAtrasado(valor), atrasoMs);
    return () => clearTimeout(timer);
  }, [valor, atrasoMs]);
  return atrasado;
}
