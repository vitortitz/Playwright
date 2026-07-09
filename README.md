# Testes Automatizados E2E + API — Playwright

Suíte de testes automatizados escrita em **Playwright + TypeScript**, cobrindo **interface (UI)** e **API**, com arquitetura baseada em **Page Object Model**, camada de serviço para a API e fixtures customizadas.

> Este projeto foi desenvolvido como resposta ao desafio técnico descrito em [`desafio-qa-automacao-playwright.md`](./desafio-qa-automacao-playwright.md), na raiz do projeto. As premissas assumidas durante a implementação estão documentadas ao longo deste README.

## Escopo

- **Testes de UI** sobre o [SauceDemo](https://www.saucedemo.com) — aplicação web pública.
- **Testes de API** sobre a [Restful Booker](https://restful-booker.herokuapp.com) — serviço REST público.

## Stack

- [Playwright Test](https://playwright.dev) `^1.61`
- TypeScript com path aliases (`@pages`, `@data`, `@fixtures`, `@api`)
- Page Object Model (UI) + camada de serviço (API) + fixtures customizadas
- Execução multi-browser: Chromium, Firefox e WebKit
- Projects separados para UI e API (a API não sobe navegador)

## Estrutura

```
src/
  pages/        # Page Objects da UI (login, inventory, cart, checkout)
  api/          # Camada de serviço da API (booking.api.ts)
  fixtures/     # Fixtures customizadas (injeção de Page Objects e do serviço de API)
  data/         # Dados de teste (usuários, credenciais, builders de booking)
  features/     # Arquivos .feature (Gherkin)
tests/
  ui/           # Specs de interface
  api/          # Specs de API
playwright.config.ts
```

## Pré-requisitos

- Node.js (LTS)
- Instalar dependências e browsers:

```bash
npm ci
npx playwright install --with-deps
```

## Configuração

As credenciais e URLs base ficam em um arquivo `.env` (não versionado). Todas têm defaults no `playwright.config.ts`/dados de teste, então o `.env` é opcional para rodar localmente. Exemplo:

```bash
# .env

# URLs base (opcional — há defaults no projeto)
UI_BASE_URL=https://www.saucedemo.com
API_BASE_URL=https://restful-booker.herokuapp.com

# Credenciais (dados públicos das apps de demonstração)
SAUCE_PASSWORD=secret_sauce
API_USERNAME=admin
API_PASSWORD=password123
```

## Executando os testes

Os scripts do `package.json` permitem rodar cada grupo isoladamente:

```bash
npm test               # roda tudo (UI nos 3 browsers + API)
npm run test:ui        # apenas testes de interface
npm run test:api       # apenas testes de API
npm run test:ui:chromium  # UI somente no Chromium (mais rápido no dia a dia)
npm run report         # abre o último relatório HTML
```

## Cobertura de cenários

### UI (SauceDemo)

- **Login**: sucesso, usuário bloqueado e cenários de credenciais inválidas
- **Carrinho**: badge, adição de produtos e conteúdo do carrinho
- **Ordenação**: por preço (asc/desc) e por nome (A-Z)
- **Checkout**: fluxo de compra completo (login → carrinho → checkout → sucesso)

### API (Restful Booker)

- **Autenticação**: `POST /auth` retorna token
- **Criação**: `POST /booking` cria reserva e retorna os dados enviados
- **Consulta**: `GET /booking/{id}` retorna a reserva criada
- **Atualização**: `PUT /booking/{id}` altera a reserva (autenticado)
- **Remoção**: `DELETE /booking/{id}` exige autenticação

## CI/CD

O projeto inclui um workflow do GitHub Actions em `.github/workflows/playwright.yml` que roda a suíte (UI + API) a cada push e pull request. As credenciais são injetadas via GitHub Secrets (`SAUCE_PASSWORD`, `API_USERNAME`, `API_PASSWORD`).

## Decisões de arquitetura

- **Page Object Model para a UI, camada de serviço para a API.** Cada página do SauceDemo é uma classe em `src/pages/` que encapsula locators e ações; a API Restful Booker tem uma classe de serviço (`src/api/booking.api.ts`) que encapsula endpoints e autenticação. As specs ficam declarativas e livres de detalhes de baixo nível.
- **Fixtures para setup e reúso.** As fixtures em `src/fixtures/fixture.ts` injetam os Page Objects prontos, fornecem um `loggedInInventory` (usuário já autenticado, evitando repetir o login) e um `bookingApi` já autenticado (contexto de API com token). Isso atende diretamente à sugestão do desafio de usar login como fixture.
- **Projects separados para UI e API.** No `playwright.config.ts`, o project `api` roda sem navegador (usa apenas o `APIRequestContext`), enquanto os projects de UI rodam nos três browsers. Isso permite executar cada grupo de forma isolada (`npm run test:ui` / `npm run test:api`) e evita subir browser à toa nos testes de API.
- **Testes independentes.** Cada teste de API que precisa de um booking o cria dentro do próprio teste, sem depender de ordem de execução. Os testes de UI partem de estado limpo via fixtures.
- **Teste data-driven.** O cenário de login inválido é parametrizado a partir de uma lista de casos (`invalidLoginScenarios`), cobrindo credenciais inválidas, usuário bloqueado e campos em branco com um único bloco de teste.
- **Web-first assertions e auto-waiting.** As validações usam `expect` com asserções que aguardam automaticamente; não há `waitForTimeout` como estratégia de sincronização.
- **Configuração por ambiente.** URLs base e credenciais vêm de variáveis de ambiente (`.env` local, Secrets no CI), com defaults sensatos no código para o projeto rodar out-of-the-box.

## Premissas assumidas

- **As credenciais são públicas/de demonstração.** Tanto o SauceDemo (`secret_sauce`) quanto a Restful Booker (`admin`/`password123`) usam credenciais públicas. Por isso o projeto funciona com defaults no código, mas ainda assim as credenciais são mantidas fora do código-fonte (via `.env` e GitHub Secrets) para demonstrar a prática correta.
- **A Restful Booker é um ambiente compartilhado e instável.** Por ser uma instância gratuita e pública, pode ter cold start e indisponibilidades pontuais; por isso o CI usa retries. Os testes não assumem estado pré-existente no servidor.
- **`main` protegida por CI.** Assume-se fluxo via Pull Request com o check da CI obrigatório antes do merge — nada entra na `main` sem os testes passarem.

## O que eu faria com mais tempo

- **Lint/format e hooks de pré-commit:** ESLint + Prettier com Husky/lint-staged para garantir padrão de código a cada commit.
- **Dockerfile** para rodar a suíte em container, padronizando o ambiente de execução.(Necessário mais estudos) 
- **Teste de acessibilidade** com `@axe-core/playwright` em uma das páginas do SauceDemo.
- **Relatórios mais ricos:** integração com Allure, além do HTML report já configurado.
- **Migração para BDD:** o projeto já tem um `src/features/login.feature` iniciado; o próximo passo seria adotar `playwright-bdd` para descrever os cenários em Gherkin sem abrir mão do runner do Playwright.
- **Cobertura adicional de borda** na API (payloads inválidos, tokens expirados) e na UI (outros usuários problemáticos do SauceDemo).

## TO DO

- [ ] **Migrar a suíte para BDD.** Descrever os cenários em estilo *Given / When / Then*, tornando-os legíveis por pessoas não técnicas. O projeto já tem um `src/features/login.feature` iniciado como ponto de partida. A abordagem pode ser:
  - **Sem dependência extra (preferencial):** organizar os testes em estilo BDD dentro do próprio Playwright, com passos `Given/When/Then` encapsulados em funções/fixtures reutilizáveis — mantém tudo no runner atual, sem adicionar ferramentas.
  - **Com Gherkin em arquivos `.feature`:** caso se queira separar as especificações do código em arquivos `.feature` de fato, avaliar uma ferramenta de integração (ex.: `playwright-bdd` ou Cucumber). Passo opcional, apenas se a leitura por não técnicos justificar a dependência.
