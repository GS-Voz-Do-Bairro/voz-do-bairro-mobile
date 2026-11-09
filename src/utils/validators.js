import { diasAte } from './dateUtils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITES = {
  nome: { min: 3, max: 120 },
  senha: { min: 8, max: 72 },
  titulo: { min: 5, max: 150 },
  descricao: { min: 20, max: 2000 },
  comentario: { min: 2, max: 1000 },
  justificativa: { min: 10, max: 2000 },
};

const tamanho = (texto) => (texto ?? '').trim().length;

export function validarLogin({ email, senha }) {
  const erros = {};
  if (!email?.trim()) erros.email = 'Informe seu e-mail.';
  else if (!EMAIL_REGEX.test(email.trim())) erros.email = 'E-mail inválido.';
  if (!senha) erros.senha = 'Informe sua senha.';
  return erros;
}

export function validarCadastro({ nome, email, senha, confirmarSenha, bairroId }) {
  const erros = {};
  if (tamanho(nome) < LIMITES.nome.min) erros.nome = 'Informe seu nome completo.';
  else if (tamanho(nome) > LIMITES.nome.max) erros.nome = `Máximo de ${LIMITES.nome.max} caracteres.`;
  if (!email?.trim()) erros.email = 'Informe seu e-mail.';
  else if (!EMAIL_REGEX.test(email.trim())) erros.email = 'E-mail inválido.';
  if (!bairroId) erros.bairroId = 'Escolha o seu bairro.';
  if ((senha ?? '').length < LIMITES.senha.min)
    erros.senha = `A senha precisa de pelo menos ${LIMITES.senha.min} caracteres.`;
  else if (senha.length > LIMITES.senha.max) erros.senha = `Máximo de ${LIMITES.senha.max} caracteres.`;
  if (confirmarSenha !== senha) erros.confirmarSenha = 'As senhas não conferem.';
  return erros;
}

export function validarProposta({ titulo, descricao, categoria }) {
  const erros = {};
  if (tamanho(titulo) < LIMITES.titulo.min) erros.titulo = `Use pelo menos ${LIMITES.titulo.min} caracteres.`;
  else if (tamanho(titulo) > LIMITES.titulo.max) erros.titulo = `Máximo de ${LIMITES.titulo.max} caracteres.`;
  if (tamanho(descricao) < LIMITES.descricao.min) erros.descricao = 'Conte um pouco mais sobre o problema.';
  else if (tamanho(descricao) > LIMITES.descricao.max)
    erros.descricao = `Máximo de ${LIMITES.descricao.max} caracteres.`;
  if (!categoria) erros.categoria = 'Escolha uma categoria.';
  return erros;
}

export function validarComentario(texto) {
  if (tamanho(texto) < LIMITES.comentario.min) return 'Escreva um comentário.';
  if (tamanho(texto) > LIMITES.comentario.max) return `Máximo de ${LIMITES.comentario.max} caracteres.`;
  return null;
}

export function validarResposta({ decisao, justificativa, prazoExecucao }) {
  const erros = {};
  if (!decisao) erros.decisao = 'Escolha a decisão.';
  if (tamanho(justificativa) < LIMITES.justificativa.min)
    erros.justificativa = 'Escreva o parecer para os moradores.';
  else if (tamanho(justificativa) > LIMITES.justificativa.max)
    erros.justificativa = `Máximo de ${LIMITES.justificativa.max} caracteres.`;
  if (decisao === 'ACEITA') {
    if (!prazoExecucao) erros.prazoExecucao = 'Informe o prazo de execução (dd/mm/aaaa).';
    else if (diasAte(prazoExecucao) <= 0)
      erros.prazoExecucao = 'O prazo de execução precisa ser uma data futura.';
  }
  return erros;
}
