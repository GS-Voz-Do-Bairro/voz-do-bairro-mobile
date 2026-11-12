import { useQuery } from '@tanstack/react-query';
import { placarService } from '../services/placarService';
import { queryKeys } from './queryKeys';

export function usePlacarDoBairro(bairroId) {
  return useQuery({
    queryKey: queryKeys.placar(bairroId),
    queryFn: () => placarService.doBairro(bairroId),
    enabled: !!bairroId,
  });
}

export function usePlacarGeral() {
  return useQuery({
    queryKey: queryKeys.placarGeral,
    queryFn: placarService.geral,
  });
}
