# Voz do Bairro

Aplicativo de participação cidadã com cobrança de resultado. Moradores propõem melhorias para o bairro, a comunidade apoia e, quando uma proposta atinge a meta de apoios, ela vira uma demanda oficial. A partir daí a prefeitura tem 15 dias para responder (aceitar com prazo de execução ou recusar com justificativa), e todo mundo acompanha se o que foi prometido saiu do papel.

Projeto da Global Solution FIAP 2026 (CitizenTech), disciplina Mobile Application Development. O app consome as duas APIs do grupo ao mesmo tempo: a API Java (Spring Boot) e a API .NET (ASP.NET Core 8). As duas usam o mesmo banco e o mesmo token JWT, então o usuário faz login uma vez só.

## Integrantes

| Nome | RM | Turma |
|---|---|---|
| Andrei de Paiva Gibbini | 563061 | 2TDSPF |
| Pedro Sakai Silva Zambaca | 565956 | 2TDSPF |
| Pedro Santos Pequini | 561842 | 2TDSPF |
| Arthur Câmara | 562310 | 2TDSPG |
| Diogo Cunha | 563654 | 2TDSPF |

## Vídeo

Demonstração do app: [link do vídeo](COLE_AQUI_O_LINK_DO_YOUTUBE)

## Problema e solução

Pedidos de melhoria no bairro costumam se perder: cada morador reclama por um canal diferente, as mesmas queixas se repetem dezenas de vezes e ninguém fica sabendo se a prefeitura respondeu.

No Voz do Bairro os pedidos ficam reunidos em um só lugar. Antes de publicar, o app avisa se já existe uma proposta parecida, assim os apoios não ficam espalhados em várias cópias do mesmo pedido. Quem tem dificuldade para escrever pode gravar a proposta por áudio. Cada bairro também tem um placar público com as propostas por situação e o percentual de demandas respondidas no prazo, então o atraso da prefeitura fica visível para todo mundo.

ODS relacionados: 11 (cidades sustentáveis), 10 (redução das desigualdades) e 16 (instituições eficazes e transparentes).

## Funcionalidades

- Login e cadastro com JWT; a sessão continua ativa ao reabrir o app
- Feed das propostas do bairro, com busca e filtros por situação e categoria
- Nova proposta por texto ou por áudio (o áudio é transcrito e organizado pela IA da API)
- Aviso de propostas parecidas antes de publicar
- Edição e exclusão da proposta enquanto ela ainda recebe apoios
- Apoio às propostas, com barra de progresso até a meta
- Comentários (criar, editar e excluir os próprios)
- Meus apoios: lista das propostas que o cidadão apoiou
- Resumo automático de cada proposta, gerado pela IA da API
- Prazo de resposta e resposta oficial da prefeitura em cada demanda
- Placar do bairro e comparativo entre bairros
- Notificações de meta atingida, prazo vencido e resposta da prefeitura
- Painel do gestor com as demandas pendentes, ordenadas pelo prazo
- Resposta do gestor com rascunho de parecer e pontos de atenção gerados pela IA
- Conclusão do serviço pelo gestor quando o compromisso é cumprido
- Cadastro, edição e exclusão de bairros pelo gestor
- Tema claro e escuro
- Tela Sobre o App com a versão, o hash do commit e a situação das duas APIs

### Perfis de acesso

| Perfil | O que pode fazer |
|---|---|
| Cidadão | Publica, edita e exclui as próprias propostas, apoia propostas de outros moradores e comenta |
| Gestor | Vê as propostas de todos os bairros, responde às demandas, marca os serviços como concluídos e cadastra bairros |

As telas do gestor só são registradas na navegação quando o usuário logado tem esse perfil.

## Telas

1. Login
2. Cadastro
3. Propostas (feed do bairro)
4. Nova proposta / Editar proposta
5. Detalhe da proposta (apoio e comentários)
6. Placar do bairro
7. Painel do gestor
8. Responder demanda
9. Gerenciar bairros / Cadastro de bairro
10. Minhas propostas
11. Meus apoios
12. Notificações
13. Perfil
14. Sobre o App

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Navegação | React Navigation (native-stack e bottom-tabs) |
| Dados remotos | TanStack Query + Axios |
| Autenticação | JWT, guardado no expo-secure-store |
| Áudio | expo-audio |
| Fontes | Poppins (títulos) e Nunito (textos), em `assets/fonts` |
| Qualidade de código | ESLint + Prettier |
| Build e distribuição | EAS Build + Firebase App Distribution |

## Estrutura do projeto

```
assets/
├── fonts/        Poppins e Nunito
└── images/       logo e ilustração do bairro
src/
├── components/   componentes reutilizáveis (cards, botões, inputs, gravador de áudio)
├── config/       endereços das APIs e informações da versão
├── constants/    tema (cores, fontes, espaçamentos), categorias e situações das propostas
├── contexts/     autenticação e tema
├── hooks/        hooks de dados (propostas, apoios, comentários, demandas, placar) e de áudio
├── routes/       navegação: login, abas e telas internas
├── screens/      telas, separadas por área (auth, propostas, placar, gestor, perfil)
├── services/     chamadas às APIs, rotas, conversão de dados e dados de exemplo
└── utils/        datas, validações, erros da API e chave de idempotência
```

As telas só cuidam da interface. Os dados vêm dos hooks (TanStack Query), que chamam os services.

## Integração com as APIs

O app conversa com duas APIs, cada uma responsável por uma parte do sistema:

| API | Responsável por | Endereço |
|---|---|---|
| Java (Spring Boot) | login e cadastro, propostas, resposta da prefeitura, notificações e placar | https://voz-do-bairro-java.onrender.com/api |
| .NET (ASP.NET Core) | bairros, apoios e comentários | https://voz-do-bairro-dotnet.onrender.com/api |

Repositórios: [voz-do-bairro-java](https://github.com/GS-Voz-Do-Bairro/voz-do-bairro-java) e [voz-do-bairro-dotnet](https://github.com/GS-Voz-Do-Bairro/voz-do-bairro-dotnet).

Os endereços ficam em variáveis de ambiente (sem `.env` o app usa os endereços acima):

| Variável | Uso |
|---|---|
| `EXPO_PUBLIC_API_URL` | API Java (termina em `/api`) |
| `EXPO_PUBLIC_DOTNET_API_URL` | API .NET (termina em `/api`) |
| `EXPO_PUBLIC_IA_API_URL` | Serviço de IA: transcrição de áudio e busca de propostas parecidas (opcional) |

O login é feito na API Java, que devolve um token JWT. O mesmo token vai no cabeçalho `Authorization: Bearer` das chamadas às duas APIs. O token vale 2 horas e, quando expira, o app volta para o login.

Apoiar e comentar mandam um `Idempotency-Key` (a API .NET exige). Se a conexão cair antes da resposta, o app reenvia com a mesma chave e a API devolve o resultado da primeira vez, então o apoio não é contado duas vezes.

As APIs estão no plano gratuito do Render, que desliga o servidor depois de um tempo sem uso. A primeira chamada pode levar perto de 1 minuto. Na tela Sobre o App dá para ver se as duas estão no ar (e abrir essa tela já acorda os servidores).

Sem o serviço de IA configurado, a opção de gravar por áudio fica oculta e a busca de propostas parecidas é feita no próprio app, comparando o texto com as propostas do bairro.

### Situações da proposta

| Status | Significado |
|---|---|
| `ABERTA` | Recebendo apoios |
| `DEMANDA` | Atingiu a meta; a prefeitura tem 15 dias para responder |
| `ATRASADA` | O prazo venceu sem resposta |
| `EM_EXECUCAO` | Aceita, com prazo de execução |
| `CONCLUIDA` | Serviço feito |
| `RECUSADA` | Recusada com justificativa |

### Endpoints usados

API Java:

| Ação | Método | Endpoint |
|---|---|---|
| Login | POST | `/api/auth/login` |
| Cadastro | POST | `/api/auth/register` |
| Usuário logado | GET | `/api/usuarios/me` |
| Placar do bairro | GET | `/api/bairros/{id}/placar` |
| Propostas | GET | `/api/propostas?bairroId&status&categoria&page&size` |
| Minhas propostas | GET | `/api/propostas/minhas` |
| Detalhe, edição e exclusão | GET / PUT / DELETE | `/api/propostas/{id}` |
| Nova proposta | POST | `/api/propostas` |
| Concluir serviço | PATCH | `/api/propostas/{id}/concluir` |
| Resposta da prefeitura | POST | `/api/propostas/{id}/resposta` |
| Rascunho do parecer | POST | `/api/propostas/{id}/resposta/rascunho-ia` |
| Notificações | GET | `/api/notificacoes` |
| Marcar como lida | PATCH | `/api/notificacoes/{id}/lida` |
| Saúde | GET | `/actuator/health` |

API .NET:

| Ação | Método | Endpoint |
|---|---|---|
| Bairros | GET | `/api/bairros` |
| Cadastrar bairro (gestor) | POST | `/api/bairros` |
| Editar e excluir bairro (gestor) | PUT / DELETE | `/api/bairros/{id}` |
| Apoiar / retirar apoio | POST / DELETE | `/api/propostas/{id}/apoios` |
| Resumo dos apoios (e se eu já apoiei) | GET | `/api/propostas/{id}/apoios/resumo` |
| Meus apoios | GET | `/api/usuarios/me/apoios` |
| Comentários | GET / POST | `/api/propostas/{id}/comentarios` |
| Editar e excluir comentário | PUT / DELETE | `/api/comentarios/{id}` |
| Saúde | GET | `/health` |

Algumas regras que vêm da API .NET e aparecem no app: o autor não pode apoiar a própria proposta, o apoio só pode ser retirado enquanto a proposta está aberta e um bairro com propostas ou moradores não pode ser excluído.

### Dados de exemplo

Com `EXPO_PUBLIC_USE_MOCK=true` no `.env` o app usa os dados de `src/services/mock` em vez da API. Usamos isso para testar as telas enquanto as APIs não estavam no ar. Os dados de exemplo seguem as mesmas regras das duas APIs.

## Como executar

Pré-requisitos: Node.js 18 ou superior e o Expo Go no celular (ou um emulador Android).

```bash
npm install
cp .env.example .env    # opcional: só se for usar as APIs rodando local
npx expo start
```

Depois é só ler o QR Code com o Expo Go ou apertar `a` para abrir no emulador.

Outros comandos:

```bash
npm run lint      # ESLint
npm run format    # Prettier
```

### Contas de teste

São os usuários criados pelo script do banco (`banco/script-bd-base.sql` da API Java) e valem para as duas APIs.

| Perfil | Nome | E-mail | Senha |
|---|---|---|---|
| Cidadã (Capão Redondo) | Maria Cidadã | `cidadao@vozdobairro.com` | `Senha@123` |
| Cidadão (Capão Redondo) | João Vizinho | `vizinho@vozdobairro.com` | `Senha@123` |
| Gestora | Carla Gestora | `gestor@vozdobairro.com` | `Senha@123` |

Maria e João são do mesmo bairro, então um pode apoiar a proposta do outro (o autor não pode apoiar a própria).

## Sobre o App

Em Perfil > Sobre o app aparecem a versão, o hash do commit (curto e completo), a branch, a data do build, os endereços das duas APIs e se cada uma está no ar. O hash é gravado no momento do build pelo `app.config.js`. Se o build for feito com alterações não commitadas, o hash recebe o sufixo `-dirty`.

## Publicação

O APK é gerado com o EAS Build e distribuído pelo Firebase App Distribution.

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

As URLs das APIs usadas no APK ficam no `eas.json`. O hash do commit vai nas notas da versão no Firebase e é o mesmo que aparece na tela Sobre o App.
