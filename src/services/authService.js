import api from './api';
import { ENDPOINTS } from './endpoints';
import { mapLogin, mapUsuario } from './mappers';

export const authService = {
  login: async ({ email, senha }) => {
    const { data } = await api.post(ENDPOINTS.auth.login, { email, senha });
    return mapLogin(data);
  },

  registrar: async ({ nome, email, senha, bairroId }) => {
    const { data } = await api.post(ENDPOINTS.auth.registro, { nome, email, senha, bairroId });
    return mapLogin(data);
  },

  me: async () => {
    const { data } = await api.get(ENDPOINTS.auth.me);
    return mapUsuario(data);
  },
};

export default authService;
