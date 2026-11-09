import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propostasService } from '../services/propostasService';
import { queryKeys } from './queryKeys';

function contemTermo(proposta, termo) {
  const alvo = `${proposta.titulo} ${proposta.descricao}`.toLowerCase();
  return alvo.includes(termo.toLowerCase());
}

export function usePropostas({ bairroId, status, categoria } = {}, busca = '') {
  const filtros = { bairroId, status, categoria };
  return useQuery({
    queryKey: queryKeys.propostas(filtros),
    queryFn: () => propostasService.listar(filtros),
    select: busca ? (lista) => lista.filter((p) => contemTermo(p, busca)) : undefined,
  });
}

export function useMinhasPropostas() {
  return useQuery({
    queryKey: queryKeys.minhasPropostas,
    queryFn: propostasService.minhas,
  });
}

export function useProposta(id) {
  return useQuery({
    queryKey: queryKeys.proposta(id),
    queryFn: () => propostasService.buscarPorId(id),
    enabled: !!id,
  });
}

function useInvalidarPropostas() {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.todasPropostas });
    queryClient.invalidateQueries({ queryKey: ['placar'] });
    if (id) queryClient.invalidateQueries({ queryKey: queryKeys.proposta(id) });
  };
}

export function useSalvarProposta() {
  const invalidar = useInvalidarPropostas();
  return useMutation({
    mutationFn: ({ id, dados }) =>
      id ? propostasService.atualizar(id, dados) : propostasService.criar(dados),
    onSuccess: (proposta) => invalidar(proposta?.id),
  });
}

export function useRemoverProposta() {
  const queryClient = useQueryClient();
  const invalidar = useInvalidarPropostas();
  return useMutation({
    mutationFn: (id) => propostasService.remover(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.proposta(id) });
      invalidar();
    },
  });
}

export function useBuscarSimilares() {
  return useMutation({ mutationFn: propostasService.buscarSimilares });
}

export function useTranscreverAudio() {
  return useMutation({ mutationFn: propostasService.transcreverAudio });
}
