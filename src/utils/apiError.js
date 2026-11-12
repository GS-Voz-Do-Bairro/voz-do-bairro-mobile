const NOMES_CAMPOS = {
  titulo: 'Título',
  descricao: 'Descrição',
  categoria: 'Categoria',
  bairroId: 'Bairro',
  nome: 'Nome',
  email: 'E-mail',
  senha: 'Senha',
  decisao: 'Decisão',
  justificativa: 'Parecer',
  prazoExecucao: 'Prazo de execução',
  texto: 'Comentário',
};

export function camposDoErro(error) {
  const data = error?.response?.data;
  const campos = data?.campos ?? data?.errors;
  if (!campos || typeof campos !== 'object') return {};
  return Object.fromEntries(
    Object.entries(campos).map(([campo, msg]) => [campo, Array.isArray(msg) ? msg.join(' ') : String(msg)]),
  );
}

export function mensagemDeErro(error, fallback = 'Não foi possível concluir a operação. Tente novamente.') {
  if (!error?.response) {
    return error?.code === 'ECONNABORTED'
      ? 'O servidor demorou para responder. Tente novamente.'
      : 'Sem conexão com o servidor. Verifique sua internet.';
  }

  const status = error.response.status;
  const data = error.response.data;

  if (status === 429) return 'Muitas tentativas em pouco tempo. Aguarde um instante e tente de novo.';

  const campos = Object.entries(camposDoErro(error));
  if (campos.length)
    return campos.map(([campo, msg]) => `${NOMES_CAMPOS[campo] ?? campo}: ${msg}`).join('\n');

  const texto =
    typeof data === 'object' && data ? data.detail || data.mensagem || data.title || data.message : null;
  if (texto) return texto;

  if (status === 401) return 'Sessão expirada. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para esta ação.';
  if (status === 404) return 'Registro não encontrado.';
  if (status === 409) return 'Esta ação entra em conflito com o que já está registrado.';
  if (status === 422) return 'Esta ação não é permitida na situação atual da proposta.';
  if (status >= 500) return 'O servidor encontrou um problema. Tente novamente em instantes.';
  return fallback;
}
