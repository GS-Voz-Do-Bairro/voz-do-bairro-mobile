import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apoiosService } from '../services/apoiosService';
import { queryKeys } from './queryKeys';

export function useJaApoiou(propostaId, habilitado = true) {
  return useQuery({
    queryKey: queryKeys.apoio(propostaId),
    queryFn: async () => (await apoiosService.resumo(propostaId)).usuarioApoiou,
    enabled: !!propostaId && habilitado,
  });
}

export function useMeusApoios() {
  return useQuery({
    queryKey: queryKeys.meusApoios,
    queryFn: apoiosService.meus,
  });
}

export function useApoio(propostaId) {
  const queryClient = useQueryClient();
  const chaveProposta = queryKeys.proposta(propostaId);
  const chaveApoio = queryKeys.apoio(propostaId);

  return useMutation({
    mutationFn: async (apoiar) => {
      try {
        return apoiar ? await apoiosService.apoiar(propostaId) : await apoiosService.retirar(propostaId);
      } catch (error) {
        // 409 = o apoio já estava registrado
        if (apoiar && error.response?.status === 409) return null;
        throw error;
      }
    },

    onMutate: async (apoiar) => {
      await queryClient.cancelQueries({ queryKey: chaveProposta });
      const anterior = queryClient.getQueryData(chaveProposta);
      const apoioAnterior = queryClient.getQueryData(chaveApoio);
      if (anterior) {
        queryClient.setQueryData(chaveProposta, {
          ...anterior,
          totalApoios: Math.max(0, anterior.totalApoios + (apoiar ? 1 : -1)),
        });
      }
      queryClient.setQueryData(chaveApoio, apoiar);
      return { anterior, apoioAnterior };
    },

    onError: (_erro, _apoiar, contexto) => {
      if (contexto?.anterior) queryClient.setQueryData(chaveProposta, contexto.anterior);
      queryClient.setQueryData(chaveApoio, contexto?.apoioAnterior ?? false);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chaveApoio });
      queryClient.invalidateQueries({ queryKey: queryKeys.meusApoios });
      queryClient.invalidateQueries({ queryKey: chaveProposta });
      queryClient.invalidateQueries({ queryKey: queryKeys.todasPropostas });
      queryClient.invalidateQueries({ queryKey: ['placar'] });
    },
  });
}
