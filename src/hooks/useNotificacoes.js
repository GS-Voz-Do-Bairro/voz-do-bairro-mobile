import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificacoesService } from '../services/notificacoesService';
import { queryKeys } from './queryKeys';

export function useNotificacoes() {
  return useQuery({
    queryKey: queryKeys.notificacoes,
    queryFn: notificacoesService.listar,
    refetchInterval: 60 * 1000,
  });
}

export function useNaoLidas() {
  const { data } = useNotificacoes();
  return (data ?? []).filter((n) => !n.lida).length;
}

export function useMarcarComoLida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificacoesService.marcarComoLida,
    onMutate: (id) => {
      queryClient.setQueryData(queryKeys.notificacoes, (lista) =>
        (lista ?? []).map((n) => (n.id === id ? { ...n, lida: true } : n)),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.notificacoes }),
  });
}
