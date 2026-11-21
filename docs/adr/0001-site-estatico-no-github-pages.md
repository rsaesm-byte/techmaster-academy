# ADR 0001 — Site estático no GitHub Pages, sem backend

- **Data:** 2026-11-21
- **Situação:** aceita

## Contexto

O MVP precisa ser gratuito, publicável no GitHub e funcionar sem APIs pagas.
O GitHub Pages só serve arquivos estáticos: não executa código no servidor, não
tem banco de dados e não permite configurar cabeçalhos HTTP.

## Decisão

- SPA em React + TypeScript gerada pelo Vite; toda a lógica roda no navegador.
- Rotas com hash (`/#/rota`) para nunca pedir ao servidor uma página inexistente.
- Content Security Policy por `<meta>`, injetada só no build.
- Arquivos nunca embutidos como `data:` (`assetsInlineLimit: 0`), para a CSP
  poder bloquear `data:` em fontes.
- Progresso do aluno no próprio navegador (IndexedDB, próxima etapa).

## Consequências

- Custo zero de hospedagem e nenhum dado pessoal em servidores.
- O progresso não sincroniza entre aparelhos (mitigado por exportar/importar).
- `frame-ancestors` não funciona via `<meta>`; aceitável para o MVP.
- Recursos que exigem servidor (tutor com IA) ficam para a Fase 6.
