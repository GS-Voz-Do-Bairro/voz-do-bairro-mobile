import Constants from 'expo-constants';
import { API_URL, DOTNET_API_URL, USE_MOCK } from './env';

const extra = Constants.expoConfig?.extra ?? {};
const hash = extra.commitHash || 'indisponivel';

export const BUILD_INFO = {
  nome: Constants.expoConfig?.name ?? 'Voz do Bairro',
  versao: Constants.expoConfig?.version ?? '0.0.0',
  commitHash: hash,
  commitCurto:
    hash === 'indisponivel' ? 'indisponível' : hash.slice(0, 7) + (hash.endsWith('-dirty') ? '*' : ''),
  branch: extra.commitBranch ?? 'desconhecida',
  dataBuild: extra.buildDate ?? null,
  ambiente: __DEV__ ? 'Desenvolvimento' : 'Produção',
  apiUrl: USE_MOCK ? 'Dados de exemplo (mock)' : API_URL,
  dotnetApiUrl: USE_MOCK ? 'Dados de exemplo (mock)' : DOTNET_API_URL,
};

export default BUILD_INFO;
