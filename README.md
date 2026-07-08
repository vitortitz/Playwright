# Playwright E2E Tests — SauceDemo

Suíte de testes end-to-end para o [SauceDemo](https://www.saucedemo.com), escrita em **Playwright + TypeScript** usando o padrão **Page Object Model** e fixtures customizadas.

## Stack

- [Playwright Test](https://playwright.dev) `^1.61`
- TypeScript com path aliases (`@pages`, `@data`, `@fixtures`, `@api`)
- Page Object Model + fixtures customizadas
- Execução multi-browser: Chromium, Firefox e WebKit

## Estrutura

```
src/
  pages/        # Page Objects (login, inventory, cart, checkout)
  fixtures/     # Fixtures customizadas (injeção de Page Objects)
  data/         # Dados de teste (usuários, cenários)
  features/     # Arquivos .feature (Gherkin)
tests/          # Specs de teste E2E
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

As credenciais ficam em um arquivo `.env` (não versionado). Crie o seu a partir do exemplo abaixo:

```bash
# .env
SAUCE_PASSWORD=secret_sauce
```

## Executando os testes

```bash
# Todos os testes
npx playwright test

# Um browser específico
npx playwright test --project=chromium

# Ver o relatório HTML
npx playwright show-report
```

## Cobertura de cenários

- **Login**: sucesso, usuário bloqueado e cenários de credenciais inválidas
- **Carrinho**: badge, adição de produtos e conteúdo do carrinho
- **Ordenação**: por preço (asc/desc) e por nome (A-Z)
- **Checkout**: fluxo de compra completo (login → carrinho → checkout → sucesso)

## CI/CD

O projeto inclui um workflow do GitHub Actions em `.github/workflows/playwright.yml` que roda a suíte a cada push e pull request.
