# TechMaster Academy

Plataforma educacional de tecnologia que ensina em quatro passos: **entender, ver,
fazer e lembrar**. Roda inteira no navegador, sem login e sem servidor, e é
publicada de graça no GitHub Pages.

> Situação: **Fase 2 — fundação.** Estrutura, temas claro/escuro, testes e
> publicação automática prontos. A primeira trilha (Lógica de Programação) vem a
> seguir.

## Tecnologias

| Ferramenta                        | Para quê                                                       |
| --------------------------------- | -------------------------------------------------------------- |
| React + TypeScript (modo estrito) | Interface com tipos verificados                                |
| Vite                              | Servidor de desenvolvimento e build                            |
| Tailwind CSS v4                   | Estilos, a partir dos design tokens em `src/styles/global.css` |
| React Router (rotas com `#`)      | Navegação compatível com o GitHub Pages                        |
| Vitest + Testing Library          | Testes                                                         |
| ESLint (+ jsx-a11y) e Prettier    | Qualidade, acessibilidade e formatação                         |

## Rodando no seu computador

Pré-requisito: [Node.js](https://nodejs.org) 20 ou mais novo (o projeto usa o 22).

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # abre em http://localhost:5173
```

## Comandos

| Comando              | O que faz                                    |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Servidor local com recarregamento automático |
| `npm test`           | Roda os testes uma vez                       |
| `npm run test:watch` | Roda os testes a cada alteração              |
| `npm run lint`       | Procura erros e problemas de acessibilidade  |
| `npm run format`     | Formata o código                             |
| `npm run typecheck`  | Confere os tipos do TypeScript               |
| `npm run check`      | Tudo acima de uma vez (o mesmo que o CI faz) |
| `npm run build`      | Gera o site final em `dist/`                 |
| `npm run preview`    | Serve o `dist/` localmente para conferir     |

## Publicação

Cada push na branch `main` roda o workflow `.github/workflows/deploy.yml`:
verifica (lint, formatação, tipos, testes), gera o build e publica no GitHub
Pages. Pull requests rodam só a verificação (`ci.yml`).

Se o repositório tiver outro nome, troque `REPO_BASE` em `vite.config.ts`.

## Estrutura

```
src/
  app/          rotas, moldura (AppShell) e tema
  features/     uma pasta por funcionalidade (painel, configurações...)
  ui/           componentes visuais reutilizáveis
  styles/       design tokens e estilos globais
  test/         configuração dos testes
content/        conteúdo das aulas (licença CC BY-SA 4.0)
docs/           decisões de arquitetura (ADRs)
```

## Segurança e privacidade

- Content Security Policy aplicada no build (veja `vite.config.ts`).
- Nenhuma chave, senha ou credencial no repositório.
- Nenhum dado sai do navegador; a preferência de tema fica no `localStorage`.

## Licença

Código: [MIT](LICENSE). Conteúdo educacional: [CC BY-SA 4.0](content/LICENSE.md).
