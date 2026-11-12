import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { demandasService } from '../services/demandasService';
import { queryKeys } from './queryKeys';

export function useDemandas(filtros) {
  return useQuery({
    queryKey: queryKeys.demandas(filtros),
    queryFn: () => demandasService.listar(filtros),
  });
}

function useInvalidarDemanda() {
  const queryClient = useQueryClient();
  return (propostaId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.todasDemandas });
    queryClient.invalidateQueries({ queryKey: queryKeys.todasPropostas });
    queryClient.invalidateQueries({ queryKey: queryKeys.proposta(propostaId) });
    queryClient.invalidateQueries({ queryKey: ['placar'] });
  };
}

export function useResponderDemanda(propostaId) {
  const invalidar = useInvalidarDemanda();
  return useMutation({
    mutationFn: (resposta) => demandasService.responder(propostaId, resposta),
    onSuccess: () => invalidar(propostaId),
  });
}

export function useRascunhoParecer(propostaId) {
  return useMutation({ mutationFn: () => demandasService.gerarRascunho(propostaId) });
}

export function useConcluirDemanda(propostaId) {
  const invalidar = useInvalidarDemanda();
  return useMutation({
    mutationFn: () => demandasService.concluir(propostaId),
    onSuccess: () => invalidar(propostaId),
  });
}
