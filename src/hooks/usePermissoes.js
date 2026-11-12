import { useAuth } from '../contexts/AuthContext';
import { aguardaResposta } from '../constants/status';

export function usePermissoes() {
  const { usuario } = useAuth();
  const isGestor = usuario?.papel === 'GESTOR';
  const ehAutor = (proposta) => proposta?.autorId === usuario?.id;

  return {
    isGestor,
    podeCriarProposta: !isGestor,
    // a API .NET não deixa o autor apoiar a própria proposta
    podeApoiar: (proposta) => !isGestor && proposta?.status === 'ABERTA' && !ehAutor(proposta),
    ehAutor,
    podeEditarProposta: (proposta) => ehAutor(proposta) && proposta?.status === 'ABERTA',
    podeExcluirProposta: (proposta) =>
      isGestor || (ehAutor(proposta) && proposta?.status === 'ABERTA' && proposta?.totalApoios === 0),
    podeResponder: (proposta) => isGestor && aguardaResposta(proposta?.status),
    podeConcluir: (proposta) => isGestor && proposta?.status === 'EM_EXECUCAO',
    ehAutorDoComentario: (comentario) => comentario?.autorId === usuario?.id,
  };
}
