import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apoiosService } from '../services/apoiosService';
import { queryKeys } from './queryKeys';

export function useApoio(propostaId) {
  const queryClient = useQueryClient();
  const chave = queryKeys.proposta(propostaId);

  return useMutation({
    mutationFn: (apoiar) => (apoiar ? apoiosService.apoiar(propostaId) : apoiosService.retirar(propostaId)),

    onMutate: async (apoiar) => {
      await queryClient.cancelQueries({ queryKey: chave });
      const anterior = queryClient.getQueryData(chave);
      if (anterior) {
        queryClient.setQueryData(chave, {
          ...anterior,
          apoiadaPorMim: apoiar,
          totalApoios: Math.max(0, anterior.totalApoios + (apoiar ? 1 : -1)),
        });
      }
      return { anterior };
    },

    onError: (_erro, _apoiar, contexto) => {
      if (contexto?.anterior) queryClient.setQueryData(chave, contexto.anterior);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chave });
      queryClient.invalidateQueries({ queryKey: queryKeys.todasPropostas });
      queryClient.invalidateQueries({ queryKey: ['placar'] });
    },
  });
}
