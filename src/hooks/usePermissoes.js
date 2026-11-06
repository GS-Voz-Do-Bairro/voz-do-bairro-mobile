import { useAuth } from '../contexts/AuthContext';
import { podeEditar } from '../constants/status';

export function usePermissoes() {
  const { usuario } = useAuth();
  const isGestor = usuario?.papel === 'GESTOR';

  return {
    isGestor,
    podeCriarProposta: !isGestor,
    podeApoiar: (proposta) => !isGestor && proposta?.status === 'ABERTA',
    podeEditarProposta: (proposta) => proposta?.autorId === usuario?.id && podeEditar(proposta?.status),
    podeResponder: (proposta) => isGestor && ['DEMANDA', 'ATRASADA'].includes(proposta?.status),
    podeConcluir: (proposta) => isGestor && ['ACEITA', 'AGENDADA'].includes(proposta?.status),
    ehAutorDoComentario: (comentario) => comentario?.autorId === usuario?.id,
  };
}
