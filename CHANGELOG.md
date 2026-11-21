# Histórico de mudanças

Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

## 2026-11-21

### Adicionado

- **Fundamentos, módulo 2 — "Sistemas, redes e segurança"** (5 aulas completas):
  Sistema operacional e processos, Permissões de arquivo, IP e sub-redes, DNS e
  HTTP, Senhas e segurança; 10 termos novos no glossário.
- Laboratório **Sistemas, redes e segurança** com 5 simuladores: escalonador de
  processos (FIFO e Round Robin), permissões (rwx e octal), calculadora de IP e
  sub-rede, passo a passo de abrir um site (DNS e HTTP) e força de senha.
- O conteúdo das aulas agora vai em pedaços de JavaScript próprios (um por
  disciplina), mantendo o código do app dentro do orçamento de tamanho.
- **Escola A — "Fundamentos da Computação"** (5 aulas completas): Bits e binário,
  Texto e hexadecimal, Portas lógicas, CPU e memória, Arquivos e terminal;
  15 termos novos no glossário.
- Laboratórios novos: **Binário** (bits, soma com vai-um, texto em bytes),
  **Portas lógicas** (AND/OR/XOR..., meio-somador e somador completo),
  **CPU e memória** (assembly didático com ciclo buscar–decodificar–executar) e
  **Terminal** simulado (sistema de arquivos de mentira, com missões).
- Montador de aulas (`content/fundamentos/montar.ts`) para as aulas da escola A.
- **Módulo 2 de Lógica — "Organizando dados e código"**: Vetores, Funções e
  procedimentos, Busca linear e binária, Ordenação e Recursividade (5 aulas
  completas, 13 termos novos no glossário).
- **Sincronização entre aparelhos** via Gist privado do aluno (token com escopo
  `gist`), com junção sem perda de progresso e indicador no topo.
- **Nova identidade visual**: ícone hexagonal neon com "T" de circuito; ícones
  PNG e maskable para instalar no Android e no iPhone.
- Laboratório de busca e ordenação (bolha, seleção, inserção, linear, binária).
- Portugol com vetores, funções, procedimentos, recursão e pilha de chamadas.
- Tutor de pistas, diagnóstico adaptativo, recomendações, "Meu progresso" e
  conquistas.
- Testes de ponta a ponta (Playwright, desktop e celular) e orçamento de
  tamanho do JavaScript no CI.
- Documentação: arquitetura, guia de autoria de aulas e ADR 0002.

### Corrigido

- O app não quebra mais quando o navegador bloqueia o service worker.

## Antes

- Fundação (Fase 2): React + TypeScript, temas, testes, CI e deploy no GitHub
  Pages; módulo 1 de Lógica, revisão espaçada, glossário, busca, laboratórios,
  modo offline e Editor Web isolado.
