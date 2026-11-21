# ADR 0002 — Sincronizar o progresso via GitHub Gist do aluno

**Situação:** aceita (2026-11-21)

## Contexto

O progresso fica no IndexedDB de cada navegador. Alunos usam computador e
celular e querem o mesmo progresso nos dois. O site é estático (ADR 0001): não
temos servidor nem banco.

## Decisão

Sincronizar com um **Gist privado na conta do próprio aluno**, usando um token
pessoal do GitHub com **apenas** o escopo `gist`. O documento é o mesmo formato
do backup exportado, mais o campo `limpoEm`. A junção é feita no navegador e
não perde dados (união de tentativas, status que não regride).

## Alternativas consideradas

- **Exportar e importar arquivo** — continua disponível, mas é manual.
- **Backend próprio (Supabase, Firebase)** — exigiria contas, política de
  privacidade, custos e um ponto central com dados de todos os alunos.
- **"O mais recente vence"** — simples, mas apagaria o trabalho feito offline
  em outro aparelho.

## Consequências

- Nenhum dado passa por nós; o aluno controla e pode apagar o Gist.
- O aluno precisa de conta no GitHub e de criar um token (a tela ensina).
- A CSP passa a permitir `api.github.com` e `gist.githubusercontent.com`.
- O token fica no `localStorage`: não recomendado em computador público
  (a tela avisa e oferece "Desconectar").
