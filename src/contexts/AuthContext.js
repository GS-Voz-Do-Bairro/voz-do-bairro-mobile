import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { registrarHandlerSessaoExpirada } from '../services/api';
import { queryClient } from '../services/queryClient';
import { lerToken, lerUsuario, limparSessao, salvarToken, salvarUsuario } from '../services/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [processando, setProcessando] = useState(false);

  const encerrarSessao = useCallback(async () => {
    await limparSessao();
    queryClient.clear();
    setUsuario(null);
  }, []);

  const iniciarSessao = useCallback(async ({ token, usuario: doToken }) => {
    await salvarToken(token);
    let perfil = doToken;
    try {
      perfil = await authService.me();
    } catch {
      // ignora
    }
    await salvarUsuario(perfil);
    setUsuario(perfil);
    return perfil;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await lerToken();
        if (!token) return;
        const perfil = await authService.me();
        await salvarUsuario(perfil);
        setUsuario(perfil);
      } catch (error) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          await limparSessao();
        } else {
          setUsuario(await lerUsuario());
        }
      } finally {
        setCarregandoSessao(false);
      }
    })();
  }, []);

  useEffect(() => {
    registrarHandlerSessaoExpirada(() => {
      encerrarSessao();
    });
  }, [encerrarSessao]);

  const login = useCallback(
    async ({ email, senha }) => {
      setProcessando(true);
      try {
        const resposta = await authService.login({ email: email.trim().toLowerCase(), senha });
        return await iniciarSessao(resposta);
      } finally {
        setProcessando(false);
      }
    },
    [iniciarSessao],
  );

  const registrar = useCallback(
    async ({ nome, email, senha, bairroId }) => {
      setProcessando(true);
      try {
        const dados = { nome: nome.trim(), email: email.trim().toLowerCase(), senha, bairroId };
        const resposta = await authService.registrar(dados);
        return await iniciarSessao(resposta);
      } finally {
        setProcessando(false);
      }
    },
    [iniciarSessao],
  );

  const value = useMemo(
    () => ({
      usuario,
      isAuthenticated: !!usuario,
      isGestor: usuario?.papel === 'GESTOR',
      carregandoSessao,
      processando,
      login,
      registrar,
      logout: encerrarSessao,
    }),
    [usuario, carregandoSessao, processando, login, registrar, encerrarSessao],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}

export default AuthContext;
