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

  const campos = Object.values(camposDoErro(error));
  if (campos.length) return campos.join('\n');

  const texto =
    typeof data === 'object' && data ? data.mensagem || data.detail || data.title || data.message : null;
  if (texto) return texto;

  if (status === 401) return 'Sessão expirada. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para esta ação.';
  if (status === 404) return 'Registro não encontrado.';
  if (status === 409) return 'Esta ação não é permitida na situação atual.';
  if (status >= 500) return 'O servidor encontrou um problema. Tente novamente em instantes.';
  return fallback;
}
