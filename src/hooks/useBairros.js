import { useQuery } from '@tanstack/react-query';
import { bairrosService } from '../services/bairrosService';
import { queryKeys } from './queryKeys';

export function useBairros() {
  return useQuery({
    queryKey: queryKeys.bairros,
    queryFn: bairrosService.listar,
    staleTime: 10 * 60 * 1000,
  });
}
