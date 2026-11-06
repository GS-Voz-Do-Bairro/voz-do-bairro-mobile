import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { comentariosService } from '../services/comentariosService';
import { queryKeys } from './queryKeys';

export function useComentarios(propostaId) {
  return useQuery({
    queryKey: queryKeys.comentarios(propostaId),
    queryFn: () => comentariosService.listar(propostaId),
    enabled: !!propostaId,
  });
}

export function useSalvarComentario(propostaId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, texto }) =>
      id ? comentariosService.atualizar(id, texto) : comentariosService.criar(propostaId, texto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comentarios(propostaId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.proposta(propostaId) });
    },
  });
}

export function useRemoverComentario(propostaId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => comentariosService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comentarios(propostaId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.proposta(propostaId) });
    },
  });
}
