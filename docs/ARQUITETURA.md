# Arquitetura

Visão geral de como a TechMaster Academy funciona por dentro. A regra que guia
tudo: **site estático** (ver [ADR 0001](adr/0001-site-estatico-no-github-pages.md)).
Não há servidor nosso; tudo roda no navegador do aluno.

## As camadas

```
content/           O "livro": aulas, disciplinas e glossário (dados em TypeScript)
   │  validado por Zod em src/domain/conteudo.ts
   ▼
src/content/       Monta o catálogo (montarCatalogo) e recusa conteúdo inválido
   │
src/engines/       Lógica pura, sem React — fácil de testar
   ├─ portugol/    lexer, expressões e interpretador com rastro passo a passo
   ├─ grading/     correção de cada tipo de questão
   ├─ sandbox/     execução de JavaScript do aluno num Web Worker isolado
   ├─ mastery/     domínio de uma aula (acertos sem ver a resposta; nunca tempo)
   ├─ srs/         revisão espaçada SM-2
   ├─ pedagogia/   recomendações, diagnóstico, estatísticas e conquistas
   ├─ algoritmos/  quadros das animações de busca e ordenação
   └─ busca.ts     índice da busca global
   │
src/persistence/   ProgressRepository: a "tomada" do progresso
   ├─ dexie.ts     implementação real (IndexedDB)
   └─ memoria.ts   implementação em memória (testes)
   │
src/sync/          Sincronização opcional entre aparelhos via Gist
   │
src/features/      Telas, uma pasta por funcionalidade
src/app/           Rotas, moldura (AppShell), tema, preferências, offline
src/ui/            Componentes visuais reutilizáveis
```

As telas só conhecem a interface `ProgressRepository`, nunca o IndexedDB. Assim
os testes usam a versão em memória, e a sincronização entra "embrulhando" o
repositório (`comSincronizacao`) sem que nenhuma tela mude.

## Fluxo de uma resposta

1. `QuestaoCard` monta a resposta e chama `corrigirQuestao` (engines/grading).
   Programas em JavaScript rodam no Worker; Portugol, no interpretador.
2. `useProgressoAula.registrar` grava a tentativa e recalcula o domínio.
3. Se a sincronização estiver ligada, a gravação agenda um envio ao Gist
   (3 s depois, juntando várias mudanças seguidas).

## Sincronização entre aparelhos

Ver [ADR 0002](adr/0002-sincronizacao-via-gist.md). Resumo:

- O aluno cola um token do GitHub (escopo `gist`). O app procura um Gist com o
  arquivo `techmaster-progresso.json`; se não existir, cria um **privado**.
- A cada ciclo: exporta o local, lê o remoto, **junta** (`src/sync/mesclar.ts`),
  grava o resultado onde mudou.
- A junção nunca perde trabalho: tentativas são unidas pelo id; o status de uma
  aula nunca regride; o cartão de revisão revisado mais vezes vence.
- "Apagar tudo" grava `limpoEm`, e os outros aparelhos descartam o que é anterior.
- Quando chegam dados novos, a área de conteúdo é remontada (`useVersaoDados`)
  para as telas relerem o progresso.

## Segurança

| Risco                                | Proteção                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Script injetado no site              | CSP por `<meta>` no build; nada de HTML vindo do conteúdo (`TextoRico`)   |
| Código do aluno (JS) travar ou vazar | Web Worker sem `fetch`/`XHR`/`WebSocket`/`indexedDB`, limite de 2 s       |
| Código do aluno (HTML) no Editor Web | `iframe sandbox` sem `allow-same-origin`, com CSP própria                 |
| Laço infinito em Portugol            | Limite de passos (2 000) e de pilha (200)                                 |
| Token de sincronização               | Só escopo `gist`, guardado só no navegador do aluno, nunca no repositório |

## Offline

`vite.config.ts` gera o `sw.js` no build com a lista de todos os arquivos. O
service worker guarda tudo na primeira visita; a versão do cache muda a cada
deploy e o app mostra "Uma nova versão está pronta".

## Testes

| Camada        | Ferramenta                     | Onde                           |
| ------------- | ------------------------------ | ------------------------------ |
| Lógica        | Vitest                         | `src/**/*.test.ts`             |
| Telas e a11y  | Testing Library + axe          | `src/**/*.test.tsx`            |
| Conteúdo      | Vitest                         | `src/content/catalogo.test.ts` |
| Ponta a ponta | Playwright (desktop e celular) | `e2e/`                         |
| Tamanho       | `scripts/orcamento.mjs`        | CI                             |

O teste de conteúdo garante que toda aula tem as etapas obrigatórias, que toda
solução de referência passa nos próprios testes, que todo programa de
demonstração executa sem erro e que toda etapa renderiza.
