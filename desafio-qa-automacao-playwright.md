# Desafio Técnico — QA Automação (Pleno)
### Automação de Testes E2E + API com Playwright

---

## 1. Contexto

Olá! 👋

Antes de mais nada, obrigado pelo interesse na vaga. Este desafio faz parte do nosso processo seletivo para a posição de **QA Automação Pleno** e tem como objetivo entender, na prática, como você estrutura, escreve e organiza uma suíte de testes automatizados usando **Playwright**.

Não estamos buscando "o candidato que fez mais testes", e sim **qualidade, organização, boas práticas e clareza de raciocínio**. Um projeto menor, bem estruturado e bem justificado vale mais do que dezenas de testes frágeis e desorganizados.

Leia o documento inteiro antes de começar. Se tiver dúvidas de escopo, tome uma decisão razoável, **documente sua premissa** no README e siga em frente — saber lidar com ambiguidade também faz parte da avaliação.

---

## 2. Objetivo

Construir um projeto de automação de testes com Playwright que cubra:

- **Testes E2E de interface (UI)** sobre uma aplicação web pública.
- **Testes de API** sobre um serviço REST público.
- Uma **arquitetura de projeto** limpa e escalável (Page Objects, fixtures, dados de teste, configuração de ambientes).

---

## 3. O que vamos avaliar

| Categoria | O que observamos |
|---|---|
| **Arquitetura** | Uso de Page Object Model (ou padrão equivalente), separação de responsabilidades, reaproveitamento de código |
| **Qualidade dos testes** | Cenários positivos e negativos, asserts significativos, independência entre testes |
| **Boas práticas Playwright** | Seletores resilientes, auto-waiting (evitar `waitForTimeout`), uso de `expect` com web-first assertions, fixtures |
| **Cobertura de casos** | Casos felizes, de borda e de erro |
| **Organização & legibilidade** | Nomes claros, estrutura de pastas, código limpo |
| **Documentação** | README objetivo, instruções de execução, premissas assumidas |
| **Git** | Histórico de commits coerente e incremental (evite um único commit "final") |

---

## 4. Requisitos técnicos

- **Ferramenta:** Playwright (`@playwright/test`) — obrigatório.
- **Linguagem:** TypeScript (preferencial) ou JavaScript.
- **Gerenciador de pacotes:** npm, yarn ou pnpm (sua escolha).
- **Node.js:** versão LTS (18+).
- O projeto deve rodar com um comando simples após `npm install` (ex.: `npm test`).
- Não utilize ferramentas pagas ou que exijam licença.

---

## 5. O desafio

O desafio é dividido em **3 partes obrigatórias** e uma parte de **diferenciais (bônus)**.

### 🟦 Parte 1 — Testes E2E de UI

Aplicação alvo: **Sauce Demo** → `https://www.saucedemo.com`

É uma loja fictícia com login e fluxo de compra. Os usuários e a senha estão listados na própria página de login.

Automatize os seguintes cenários:

1. **Login — sucesso:** autenticar com o usuário `standard_user` e validar que a página de produtos é exibida.
2. **Login — falha:** tentar autenticar com credenciais inválidas e validar a mensagem de erro exibida.
3. **Login — usuário bloqueado:** autenticar com o usuário `locked_out_user` e validar a mensagem de bloqueio.
4. **Carrinho:** adicionar 2 produtos ao carrinho e validar que o contador (badge) reflete a quantidade correta e que os itens corretos aparecem no carrinho.
5. **Fluxo de compra (E2E completo):** login → adicionar produto(s) → carrinho → checkout (preencher dados) → finalizar → validar a mensagem de sucesso do pedido.
6. **Ordenação:** ordenar os produtos por **preço (menor para maior)** e validar que a lista foi ordenada corretamente (a validação deve ser feita por código, não visualmente).

> 💡 Sugerimos usar o login como **fixture** para não repetir o passo de autenticação em todos os testes que já assumem o usuário logado.

### 🟩 Parte 2 — Testes de API

Serviço alvo: **Restful Booker** → `https://restful-booker.herokuapp.com`
Documentação: `https://restful-booker.herokuapp.com/apidoc/index.html`

Use a API request nativa do Playwright (`request` / `APIRequestContext`) — **não** use a UI para estes testes.

Automatize:

1. **Auth:** gerar um token via `POST /auth` e validar que o token foi retornado.
2. **Create:** criar um booking via `POST /booking`, validar `status code` e o corpo da resposta (o objeto criado deve refletir os dados enviados).
3. **Read:** buscar o booking criado via `GET /booking/{id}` e validar os dados.
4. **Update:** atualizar o booking (`PUT` ou `PATCH`) usando o token de autenticação e validar a alteração.
5. **Delete:** remover o booking e validar que ele não existe mais (`GET` deve retornar 404).

> 💡 O ideal é que os testes sejam **independentes**: cada teste que precise de um booking deve criá-lo (não dependa da ordem de execução).

### 🟨 Parte 3 — Arquitetura & Boas Práticas

Independente dos cenários acima, esperamos ver:

- **Page Object Model** (ou padrão equivalente) para a camada de UI.
- Separação clara entre **dados de teste**, **páginas/serviços** e **especificações (specs)**.
- **Fixtures** do Playwright para setup/reuso (ex.: usuário logado, contexto de API autenticado).
- **Configuração de ambiente** via `playwright.config.ts` e/ou variáveis de ambiente (ex.: `baseURL`, credenciais fora do código-fonte quando fizer sentido).
- Pelo menos **um teste data-driven** (parametrizado) — o cenário de login é um bom candidato.

---

## 6. Diferenciais (bônus — opcionais)

Não são obrigatórios, mas contam pontos. Faça só o que der tempo, **sem sacrificar a qualidade do obrigatório**:

- ⭐ **CI:** pipeline no GitHub Actions rodando a suíte a cada push/PR.
- ⭐ **Relatórios:** configurar o HTML report do Playwright ou integrar Allure.
- ⭐ **Execução paralela** e/ou **cross-browser** (Chromium, Firefox, WebKit).
- ⭐ **Docker:** um `Dockerfile` que rode a suíte em container.
- ⭐ **Trace/screenshots/vídeo** habilitados em caso de falha.
- ⭐ **Lint/format** (ESLint + Prettier) e/ou hooks de pré-commit.
- ⭐ **Teste de acessibilidade** (ex.: `@axe-core/playwright`) em uma das páginas.

---

## 7. Critérios de aceite

Consideramos o desafio "pronto para avaliação" quando:

- [ ] O projeto instala e roda com comandos documentados no README.
- [ ] Todas as 3 partes obrigatórias estão implementadas.
- [ ] Os testes são independentes e podem rodar em qualquer ordem.
- [ ] Não há uso de esperas fixas (`waitForTimeout`) como estratégia principal de sincronização.
- [ ] Os asserts validam comportamento real (e não apenas "a página abriu").
- [ ] O README explica decisões, premissas e como executar.

---

## 8. Entregáveis

1. **Repositório Git público** (GitHub, GitLab, etc.) com o código.
   - Como alternativa, um arquivo `.zip` do projeto **incluindo a pasta `.git`** (não envie `node_modules`).
2. **README.md** contendo:
   - Pré-requisitos e passo a passo de instalação/execução.
   - Estrutura do projeto (breve explicação das pastas).
   - Premissas e decisões que você tomou.
   - O que você faria a mais se tivesse mais tempo.

---

## 9. Rubrica de avaliação

| Peso | Item |
|:---:|---|
| 30% | Arquitetura e organização do projeto |
| 25% | Cobertura e qualidade dos cenários (UI + API) |
| 20% | Boas práticas de Playwright (seletores, waits, asserts, fixtures) |
| 15% | Legibilidade, documentação e histórico de commits |
| 10% | Diferenciais (bônus) |

---

## 10. Prazo e esforço esperado

- **Prazo de entrega:** até **5 dias corridos** a partir do recebimento.
- **Esforço estimado:** de 4 a 8 horas. **Não** é preciso "gastar o prazo todo" — priorize qualidade sobre quantidade.

Se por algum motivo você não conseguir concluir tudo, entregue o que fez e descreva no README o que faltou e como resolveria. Entregas parciais bem justificadas são bem-vindas.

---

## 11. Dicas finais

- Prefira seletores estáveis (`getByRole`, `getByTestId`, `data-*`) a seletores frágeis baseados em CSS/xpath longos.
- Deixe cada teste **contar uma história clara** — quem lê o nome do teste deve entender o que ele valida.
- Rode sua suíte mais de uma vez antes de entregar para garantir que ela é **estável** (sem flakiness).
- Um bom README pode ser a diferença entre um "bom" e um "ótimo".

Boa sorte! Estamos ansiosos para ver sua solução. 🚀

---
*Documento de desafio técnico — Processo Seletivo QA Automação Pleno*
