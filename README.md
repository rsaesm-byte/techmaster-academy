# TechMaster Academy

Plataforma educacional de tecnologia que ensina em quatro passos: **entender, ver,
fazer e lembrar**. Roda inteira no navegador, sem servidor próprio, funciona
offline e é publicada de graça no GitHub Pages.

**Acesse:** https://rsaesm-byte.github.io/techmaster-academy/

## O que já existe

- **Trilha de Lógica de Programação** — 2 módulos, 10 aulas completas:
  algoritmos, variáveis, operadores, condicionais, repetição, vetores, funções,
  busca, ordenação e recursividade.
- **Aulas em 3 modos** (Essencial, Guiado, Técnico), diagnóstico adaptativo,
  tutor de pistas, exercícios de 9 tipos com correção automática e domínio por
  critério (nunca por tempo).
- **Laboratórios**: Visualizador de Algoritmos (Portugol passo a passo, com
  gavetas de memória, vetores e pilha de chamadas), robô, expressões, laço
  gráfico em WebGL, busca e ordenação animadas e Editor Web isolado.
- **Revisão espaçada** (SM-2), glossário, busca global, conquistas e
  recomendações.
- **Sincronização entre aparelhos** com um Gist privado do próprio aluno
  (token só com escopo `gist`).
- Instalável como app (PWA), tema claro/escuro, acessibilidade (teclado,
  leitor de tela, menos movimento, texto maior).

## Tecnologias

| Ferramenta                      | Para quê                                                       |
| ------------------------------- | -------------------------------------------------------------- |
| React 19 + TypeScript (estrito) | Interface com tipos verificados                                |
| Vite                            | Servidor de desenvolvimento e build                            |
| Tailwind CSS v4                 | Estilos, a partir dos design tokens em `src/styles/global.css` |
| React Router (rotas com `#`)    | Navegação compatível com o GitHub Pages                        |
| Zod                             | Validação do conteúdo e dos backups                            |
| Dexie (IndexedDB)               | Progresso do aluno no navegador                                |
| Vitest + Testing Library + axe  | Testes de unidade, de tela e de acessibilidade                 |
| Playwright                      | Testes de ponta a ponta num Chrome de verdade                  |
| ESLint (+ jsx-a11y) e Prettier  | Qualidade, acessibilidade e formatação                         |

## Rodando no seu computador

Pré-requisito: [Node.js](https://nodejs.org) 20 ou mais novo (o projeto usa o 22).

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # abre em http://localhost:5173
```

## Comandos

| Comando                    | O que faz                                                   |
| -------------------------- | ----------------------------------------------------------- |
| `npm run dev`              | Servidor local com recarregamento automático                |
| `npm test`                 | Testes de unidade e de tela                                 |
| `npm run validate:content` | Só os testes do conteúdo (use ao escrever aulas)            |
| `npm run check`            | Lint, formatação, tipos e testes (o mesmo que o CI faz)     |
| `npm run build`            | Gera o site final em `dist/`                                |
| `npm run budget`           | Confere o orçamento de tamanho do JavaScript                |
| `npm run e2e`              | Testes de ponta a ponta no site gerado (rode o build antes) |

Para o `e2e`, instale o navegador uma vez com `npx playwright install chromium`
ou aponte para um Chrome já instalado: `PW_CHROME=/caminho/do/chrome npm run e2e`.

## Publicação

Cada push na `main` roda `.github/workflows/deploy.yml`: primeiro o CI
(`ci.yml`: lint, formatação, tipos, testes, build, orçamento de tamanho e testes
de ponta a ponta) e, se tudo passar, o build é publicado no GitHub Pages.
Pull requests rodam só o CI.

Se o repositório tiver outro nome, troque `REPO_BASE` em `vite.config.ts`.

## Documentação

- [Arquitetura](docs/ARQUITETURA.md) — como as peças se encaixam.
- [Como escrever uma aula](docs/CONTEUDO.md) — guia de autoria de conteúdo.
- [Decisões de arquitetura (ADRs)](docs/adr/).
- [Histórico de mudanças](CHANGELOG.md).

## Segurança e privacidade

- Content Security Policy aplicada no build (veja `vite.config.ts`); só
  `api.github.com` é liberado para fora, por causa da sincronização.
- Código do aluno roda isolado: JavaScript num Web Worker sem rede, HTML num
  `iframe` sandbox de outra origem.
- Nenhuma chave no repositório. O token de sincronização é do aluno, fica só no
  navegador dele e precisa apenas do escopo `gist`.

## Licença

Código: [MIT](LICENSE). Conteúdo educacional: [CC BY-SA 4.0](content/LICENSE.md).
