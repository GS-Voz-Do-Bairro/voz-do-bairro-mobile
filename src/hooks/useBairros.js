import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bairrosService } from '../services/bairrosService';
import { queryKeys } from './queryKeys';

export function useBairros() {
  return useQuery({
    queryKey: queryKeys.bairros,
    queryFn: bairrosService.listar,
    staleTime: 10 * 60 * 1000,
  });
}

export function useBairro(id) {
  return useQuery({
    queryKey: [...queryKeys.bairros, id],
    queryFn: () => bairrosService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useSalvarBairro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => (id ? bairrosService.atualizar(id, dados) : bairrosService.criar(dados)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bairros });
      queryClient.invalidateQueries({ queryKey: ['placar'] });
    },
  });
}

export function useRemoverBairro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bairrosService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bairros });
      queryClient.invalidateQueries({ queryKey: ['placar'] });
    },
  });
}
